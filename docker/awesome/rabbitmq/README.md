RabbitMQ 支援 Cluster mode 來達到 HA 的效果，除了 Infra 部署成多節點（node）組成的 cluster 之外，Queue 也要另外宣告成 quorum queue 才會有效。

關鍵是節點數量 & erlangCookie。quorum queue 因為建立在投票機制上，至少需要三個節點才能運作，erlangCookie 則是 node 之間加入同一個 cluster 的認證資訊。

另外在 cluster 中需要用 node name / hostname 來識別彼此，所以要在 docker compose 中指定 hostname

> https://www.rabbitmq.com/docs/clustering#cluster-formation-requirements

可以用 `$ rabbitmq-diagnostics cluster_status` 檢查 cluster 狀態。

```sh
/ # rabbitmq-diagnostics cluster_status
Cluster status of node rabbit@rabbitmq-2 ...
Basics

Cluster name: rabbit@rabbitmq-2
Total CPU cores available cluster-wide: 24

Cluster Tags

(none)

Disk Nodes

rabbit@rabbitmq-1
rabbit@rabbitmq-2
rabbit@rabbitmq-3

Running Nodes

rabbit@rabbitmq-1
rabbit@rabbitmq-2
rabbit@rabbitmq-3

Versions

rabbit@rabbitmq-2: RabbitMQ 4.2.1 on Erlang 27.3.4.6
rabbit@rabbitmq-1: RabbitMQ 4.2.1 on Erlang 27.3.4.6
rabbit@rabbitmq-3: RabbitMQ 4.2.1 on Erlang 27.3.4.6

...
```

---

test

```
python -m app.pub
python -m app.sub

# rotate container 觀察變化
docker stop rabbitmq-x
docker restart rabbitmq-x
```

Known Issues

雖然確實會看到投票機制有在運作

```
2025-11-20 13:04:32.461418+00:00 [info] <0.248.0> RabbitMQ metadata store: leader saw request_vote_rpc from {rabbitmq_metadata,'rabbit@rabbitmq-1'} for term 17 abdicates term: 16!
2025-11-20 13:04:32.465458+00:00 [notice] <0.248.0> RabbitMQ metadata store: leader -> follower in term: 17 machine version: 2, last applied 477
2025-11-20 13:04:32.465560+00:00 [info] <0.248.0> RabbitMQ metadata store: granting vote for {rabbitmq_metadata,'rabbit@rabbitmq-1'} with last {index, term} {477,16} for term 17 previous term was 17
2025-11-20 13:04:32.468996+00:00 [info] <0.248.0> RabbitMQ metadata store: detected a new leader {rabbitmq_metadata,'rabbit@rabbitmq-1'} in term 17
2025-11-20 13:04:34.155869+00:00 [info] <0.400.0> queue 'test-quorum-queue' in vhost '/': granting vote for {'%2F_test-quorum-queue','rabbit@rabbitmq-1'} with last {index, term} {646,19} for term 20 previous term was 19
rabbitmq-1  | 2025-11-20 13:04:34.159005+00:00 [notice] <0.386.0> queue 'test-quorum-queue' in vhost '/': candidate -> leader in term: 20 machine version: 7, last applied 646
2025-11-20 13:04:34.159429+00:00 [info] <0.400.0> queue 'test-quorum-queue' in vhost '/': detected a new leader {'%2F_test-quorum-queue','rabbit@rabbitmq-1'} in term 20
```

不過在 Docker@Mac 速度偏慢，據說是 docker 的問題，之後到 linux 再試試看。
