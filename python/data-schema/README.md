比較一下 data validation 的部分:

|                           | dataclass | pydantic dataclass | pydantic base_model |
| :-----------------------: | :-------: | :----------------: | :-----------------: |
| initialized speed (ms/1m) |    208    |        1106        |        1023         |
|         error msg         |  simple   |       detail       |       detail        |
|      type transform       |    no     |        yes         |         yes         |
|      nested validate      |    no     |        yes         |         yes         |

如果只是要定義靜態型別，可以用 dataclass 就好。外部傳入的還是用 `pydantic` 比較保險。

## Ref

- [Exploring Pydantic and Dataclasses in Python: A Comprehensive Comparison](https://medium.com/@danielwume/exploring-pydantic-and-dataclasses-in-python-a-comprehensive-comparison-c3269eb606af)
