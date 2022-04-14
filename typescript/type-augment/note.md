有時候第三方套件沒有正確的定義 type，就會造成約束力降低，成為 bug 的溫床。 遇到這種情況使用`Augment`就對了，我個人習慣在 project 中開一個 augment 資料夾放 xxx.d.ts，然後在 `tsconfig.json` 中 `include` augment 就行了。 以下列出幾種範例：

### 1. process.env

```ts
// ./augment/index.d.ts
declare namespace NodeJS {
  declare interface ProcessEnv {
    readonly NODE_ENV: "test" | "dev" | "staging" | "prod";
  }
}
```

### 2. elastic-apm-node v3 的 transaction 底下少了 `setCustomContext` 這個 method

```ts
// ./augment/apm.d.ts
import { Transaction as _Transaction } from "elastic-apm-node";

declare module "elastic-apm-node" {
  interface Transaction extends _Transaction {
    setCustomContext(context: Record<string, unknown>): void;
  }
}
```

### 3. `aws-sdk`的`s3 ACL`

```ts
// ./augment/aws.d.ts
import * as _AWS from "aws-sdk";

declare module "aws-sdk" {
  declare class S3 extends _AWS.S3 {
    upload(
      params: PutObjectRequest,
      options?: ManagedUpload.ManagedUploadOptions,
      callback?: (err: Error, data: ManagedUpload.SendData) => void
    ): ManagedUpload;

    upload(
      params: PutObjectRequest,
      callback?: (err: Error, data: ManagedUpload.SendData) => void
    ): ManagedUpload;
  }
}

interface PutObjectRequest extends _AWS.S3.Types.PutObjectRequest {
  ACL?:
    | "private"
    | "public-read"
    | "public-read-write"
    | "authenticated-read"
    | "aws-exec-read"
    | "bucket-owner-read"
    | "bucket-owner-full-control";
}
```

aws 原本的 type 這樣寫...最後那個 string 直接破壞前面的 literal...

```ts
export type ObjectCannedACL =
  | "private"
  | "public-read"
  | "public-read-write"
  | "authenticated-read"
  | "aws-exec-read"
  | "bucket-owner-read"
  | "bucket-owner-full-control"
  | string;
```

### 4. typeorm 在 nestjs 中可以指定 connection name 做 DI

```ts
import "@nestjs/typeorm";

declare module "@nestjs/typeorm" {
  declare const InjectRepository: (
    entity: EntityClassOrSchema,
    connection?: "default" | "master" | "read-replica" | "whatever-you-want"
  ) => (
    target: object,
    key: string | symbol,
    index?: number | undefined
  ) => void;
}
```

> 這個套件每一層都是 export \*，一直到 InjectRepository 就是一個 const，所以寫起來比較不一樣。
