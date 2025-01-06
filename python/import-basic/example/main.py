import logging

from example import hello

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("main")
    logger.info(hello.hello())
    print(hello.hello())
