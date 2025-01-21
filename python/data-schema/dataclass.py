from dataclasses import dataclass
from json import loads
from os.path import join
from pathlib import Path
from time import time


@dataclass
class Address:
    street: str
    city: str
    zip: str


@dataclass
class User:
    address: Address
    age: int
    active: bool


if __name__ == "__main__":
    current_dir = Path(__file__).parent

    with open(join(current_dir, "data/valid-user.json")) as f:
        data = loads(f.read())
        user = User(**data)
        print(user)
        # User(address={'street': '123 Maple Street', 'city': 'Springfield', 'zip': '12345'}, age='18', active='true')

    start_time = time()
    for i in range(1000000):
        user = User(**data)
    end_time = time()
    print(f"init 1000000 次所花費的時間：{end_time - start_time} 秒")
    # 0.21503424644470215

    with open(join(current_dir, "data/invalid-user.json")) as f:
        user = User(**loads(f.read()))
        print(user)
    # TypeError: User.__init__() missing 1 required positional argument: 'active'
