from asyncio import run, sleep

from app.queue import RabbitMessageQueue


async def main():
    queue = RabbitMessageQueue()
    async def handler(msg):
        print(f"Received: {msg}")
        await sleep(2)

    await queue.subscribe(handler)
    
if __name__ == "__main__":
    run(main())
