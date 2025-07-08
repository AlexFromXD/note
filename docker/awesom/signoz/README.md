> Fork from https://github.com/SigNoz/signoz/tree/main/deploy

### Using Docker Compose

```sh
cd deploy/docker
docker compose up -d
```

Open http://localhost:8080 in your favourite browser.

To start generating sample traces, run the following command:

```sh
cd generator/hotrod
docker compose up -d
```

In a couple of minutes, you should see the data generated from hotrod in SigNoz UI.

For more details, please refer to the [SigNoz documentation](https://signoz.io/docs/install/docker/).
