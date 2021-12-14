使用[graphql-upload](https://www.npmjs.com/package/graphql-upload)這個套件，可以輕鬆接收 client 傳過來的檔案。

- ##### 在 module 啟用 middleware

  ```ts
  // gql.module.ts
  export class GqlModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(graphqlUploadExpress()).forRoutes("graphql");
    }
  }
  ```

- ##### 定義 arg type

  ```ts
  @ArgsType()
  export class UploadArgs {
    @Field(() => GraphQLUpload)
    file!: UploadFile;
  }
  ```

- ##### 實作 resolver

  ```ts
  @Resolver()
  export class FileResolver {
    @Mutation(() => Boolean)
    uploadFile(@Args() args: UploadArgs): Promise<boolean> {
      const { createReadStream, filename } = args.file
      return new Promise((resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(`./uploads/${filename}`))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false))
      );
    }
  ```

---

但如果你剛好有用到 nest 的 [validation pipe](https://docs.nestjs.com/techniques/validation#auto-validation) 而且有啟用 `transform` 的話

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  })
);
```

在[plainToClass](https://github.com/typestack/class-transformer#plaintoclass)的過程中，`UploadFile`裡的`createWriteStream`會從 function type 變成執行過的`ReadStream`，也就無法傳給後面的 resolver / service 處理。

#### 解法如下：

- ##### 在 Upload 的欄位加上 [@Exclude](https://github.com/typestack/class-transformer#skipping-specific-properties)

  ```ts
  @ArgsType()
  export class UploadArgs {
    @Exclude()
    @Field(() => GraphQLUpload)
    file!: UploadFile;
  }
  ```

- ##### 指定 mutation / query 的參數欄位

  ```ts
  @Resolver()
  export class FileResolver {
    @Mutation(() => Boolean)
    uploadFile(@Args('file') file: UploadFile): Promise<boolean> {
      const { createReadStream, filename } = file
      return new Promise((resolve, reject) =>
        createReadStream()
          .pipe(createWriteStream(`./uploads/${filename}`))
          .on('finish', () => resolve(true))
          .on('error', () => reject(false))
      );
    }
  ```

---

### reference

- #### [NestJS GraphQL File Upload](https://stephen-knutter.github.io/2020-02-07-nestjs-graphql-file-upload/)
