1. docker pull sonarsource/sonar-scanner-cli

2. docker run -v $PWD:/app -it sonarsource/sonar-scanner-cli bash

3. scan

```
sonar-scanner \
  -Dsonar.projectKey=$PROJECT \
  -Dsonar.sources=. \
  -Dsonar.host.url=http://host.docker.internal:9000 \
  -Dsonar.token=$TOKEN
```
