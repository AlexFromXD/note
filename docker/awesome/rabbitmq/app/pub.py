from asyncio import run

from app.queue import RabbitMessageQueue


async def main():
    queue = RabbitMessageQueue()
    for i in range(30):
        task = f"task-{i}"
        await queue.publish(task)
        print("send:", task)


if __name__ == "__main__":
    run(main())
