from datetime import datetime
from json import loads
from os.path import join
from pathlib import Path
from time import time

from pydantic.dataclasses import dataclass


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
        # User(address=Address(street='123 Maple Street', city='Springfield', zip='12345'), age=18, active=True)

    start_time = time()
    for i in range(1000000):
        user = User(**data)
    end_time = time()
    print(f"init 1000000 次所花費的時間：{end_time - start_time} 秒")
    # 1.106717824935913

    with open(join(current_dir, "data/invalid-user.json")) as f:
        user = User(**loads(f.read()))
        print(user)
        # pydantic_core._pydantic_core.ValidationError: 4 validation errors for User
        # address.street
        # Field required [type=missing, input_value={'zip': 12345}, input_type=dict]
        #     For further information visit https://errors.pydantic.dev/2.10/v/missing
        # address.city
        # Field required [type=missing, input_value={'zip': 12345}, input_type=dict]
        #     For further information visit https://errors.pydantic.dev/2.10/v/missing
        # address.zip
        # Input should be a valid string [type=string_type, input_value=12345, input_type=int]
        #     For further information visit https://errors.pydantic.dev/2.10/v/string_type
        # active
        # Field required [type=missing, input_value=ArgsKwargs((), {'address'...ip': 12345}, 'age': 18}), input_type=ArgsKwargs]
        #     For further information visit https://errors.pydantic.dev/2.10/v/missing
