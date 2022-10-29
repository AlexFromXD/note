一開始寫[NestJS](https://github.com/nestjs/nest) 的時候常常遇到一個問題，就是到底什麼時候需要加`@Injectable()`或`@Inject()`

假設目前有個 project 如下:

```txt
src
|
|-module
|   |
|   |-dog
|   |  |-dog.service.ts
|   |  |-dog.module.ts
|   |
|   |-cat
|   |   |-cat.service.ts
|   |   |-cat.module.ts
|   |
|   |-pet
|      |-pet.service.ts
|      |-pet.module.ts
|
|-main.ts
```

#### dog.service.ts

```ts
export class DogService {
  name = "dog";
}
```

#### dog.module.ts

```ts
import { Module } from "@nestjs/common";
import { DogService } from "./dog.service";

@Module({
  providers: [DogService],
  exports: [DogService],
})
export class DogModule {}
```

#### cat.service.ts

```ts
export class CatService {
  name = "cat";
}
```

#### cat.module.ts

```ts
import { Module } from "@nestjs/common";
import { CatService } from "./cat.service";

@Module({
  providers: [CatService],
  exports: [CatService],
})
export class CatModule {}
```

#### pet.service.ts

```ts
import { CatService } from "../cat/cat.service";
import { DogService } from "../dog/dog.service";

export class PetService {
  constructor(
    private readonly _dogService: DogService,
    private readonly _catService: CatService
  ) {}

  print() {
    console.log(
      `both ${this._dogService.name} & ${this._catService.name} are good`
    );
  }
}
```

#### pet.module.ts

```ts
import { Module } from "@nestjs/common";
import { CatModule } from "../cat/cat.module";
import { DogModule } from "../dog/dog.module";
import { PetService } from "./pet.service";

@Module({
  imports: [DogModule, CatModule],
  providers: [PetService],
})
export class PetModule {}
```

#### main.ts

```ts
import { NestFactory } from "@nestjs/core";
import { PetModule } from "./module/pet/pet.module";
import { PetService } from "./module/pet/pet.service";

async function bootstrap() {
  const app = await NestFactory.create(PetModule);
  app.get(PetService).print();
}
bootstrap();
```

如果執行`main.ts`的話會出現

```
TypeError: Cannot read property 'name' of undefined
```

原因是在`pet.service.ts`裡面的`_catService`跟`_dogService`沒有注入成功，所以這兩個 property 的 value 其實是 `undefined`。要找到注入失敗的原因，可以先檢查有沒有正確地把 dependency 放進 `IOC container`。

在`main.ts`加上幾行就可以了

```ts
async function bootstrap() {
  const app = await NestFactory.create(PetModule);
  console.log(app.get(DogService)); // DogService { name: 'dog' }
  console.log(app.get(CatService)); // CatService { name: 'cat' }
  console.log(app.get(PetService)); // PetService { _dogService: undefined, _catService: undefined }
  app.get(PetService).print();
}
bootstrap();
```

可以看到`nest`有幫我們建出三個 service，然而卻沒有把`DogService`跟`CatService`注入進`PetService`。要解決這個問題目前有兩個方案:

#### 1. 在`PetService`加上`@Injectable()`

```ts
import { Injectable } from "@nestjs/common";
import { CatService } from "../cat/cat.service";
import { DogService } from "../dog/dog.service";

@Injectable()
export class PetService {
  ...
}
```

#### 2. 在`_dogService` or `_catService` _擇一加上_` @Inject(XXXService)`

```ts
  constructor(
    @Inject(DogService)
    private readonly _dogService: DogService,
    private readonly _catService: CatService,
  ) {}
```

或

```ts
  constructor(
    private readonly _dogService: DogService,
    @Inject(CatService)
    private readonly _catService: CatService,
  ) {}
```

> 註：兩個都加也是可以

至於原因等我看完 source code 再補上...

---

#### 備註

- 範例使用的版本為：

```
 "@nestjs/common": "^8.0.0"
 "@nestjs/core": "^8.0.0"
```

- 想體驗`DI`但是不想使用`Nest`的話可以考慮[InversifyJS](https://github.com/inversify/InversifyJS)
