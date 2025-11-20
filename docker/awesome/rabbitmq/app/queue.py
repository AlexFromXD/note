import asyncio
from typing import Any, Awaitable, Callable, Optional

import pika
from pika.adapters.asyncio_connection import AsyncioConnection
from pika.channel import Channel

RABBITMQ_QUEUE = "test-quorum-queue"
WORKER_CONCURRENCY = 1

urls = [
    f"amqp://admin:admin@localhost:5671/",
    f"amqp://admin:admin@localhost:5672/",
    f"amqp://admin:admin@localhost:5673/",
]
class RabbitMessageQueue:

    def __init__(self) -> None:
        self._connection: Optional[AsyncioConnection] = None
        self._channel: Optional[Channel] = None
        self._queue: Optional[str] = None
        self._init_lock: asyncio.Lock = asyncio.Lock()
        self._url_index: int = 0

    async def _try_connect(self, url: str) -> bool:
        fut: asyncio.Future[bool] = asyncio.get_event_loop().create_future()

        def on_open(conn: AsyncioConnection) -> None:
            conn.channel(on_open_callback=lambda ch: self._on_channel_open(ch, fut))

        def on_error(conn: AsyncioConnection, exc: BaseException) -> None:
            if not fut.done():
                fut.set_exception(exc)

        self._connection = AsyncioConnection(
            pika.URLParameters(url),
            on_open_callback=on_open,
            on_open_error_callback=on_error,
            on_close_callback=lambda c, r: None,
        )

        return await fut

    def _on_channel_open(self, channel: Any, fut: asyncio.Future[bool]) -> None:
        self._channel = channel
        channel.queue_declare(
            queue=RABBITMQ_QUEUE,
            durable=True,
            arguments={"x-queue-type": "quorum"},
            callback=lambda _: fut.set_result(True),
        )

    async def _ensure(self) -> None:
        async with self._init_lock:
            if self._channel:
                return

            last_exc: Optional[Exception] = None
            for _ in range(len(urls)):
                url = urls[self._url_index]
                self._url_index = (self._url_index + 1) % len(urls)
                try:
                    await self._try_connect(url)
                    return
                except Exception as e:
                    last_exc = e
                    await asyncio.sleep(1)

            if last_exc:
                raise last_exc
            raise ConnectionError("Failed to connect to RabbitMQ")

    async def publish(self, message: str) -> None:
        await self._ensure()
        if self._channel:
            self._channel.basic_publish(
                exchange="",
                routing_key=RABBITMQ_QUEUE,
                body=message.encode("utf-8"),
                properties=pika.BasicProperties(delivery_mode=2),
            )

    async def subscribe(self, handle: Callable[[str], Awaitable[None]]) -> None:
        """
        handle: async function(message_str) -> None
        """

        await self._ensure()

        semaphore = asyncio.Semaphore(WORKER_CONCURRENCY)

        async def process_message(body: bytes, delivery_tag: int):
            async with semaphore:
                await handle(body.decode("utf-8"))
                # ACK 必須在 I/O loop thread 執行 → call_soon_threadsafe
                self._connection.ioloop.call_soon_threadsafe(
                    self._channel.basic_ack, delivery_tag
                )

        def on_msg(channel, method, properties, body):
            asyncio.create_task(process_message(body, method.delivery_tag))

        # 和 aio-pika 行為一致：設定 prefetch
        self._channel.basic_qos(prefetch_count=WORKER_CONCURRENCY)

        # 註冊 consumer（這之後 pika 就會持續推消息）
        self._channel.basic_consume(
            queue=RABBITMQ_QUEUE,
            on_message_callback=on_msg,
        )

        # ❗關鍵：AsyncioConnection 不會自動跑 → 必須啟動 I/O loop
        # 如果外層是 asyncio.run()，需啟動持續 pump
        while True:
            await asyncio.sleep(3600)
