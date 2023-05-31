AWS RDS / Aurora 有個 DAS (Database Activity Streaming) 功能：

> https://aws.amazon.com/tw/blogs/database/audit-amazon-rds-for-sql-server-using-database-activity-streams/

可以透過 kinesis datastream 把 audit log 以「幾乎即時」的方式送到 S3 之類的地方，而這些 log 會經過 KMS 加密，Schema 可以參考：

> https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/DBActivityStreams.Monitoring.html#DBActivityStreams.AuditLog

根據文件我們要先解開 `key`，再用明文的 key 去解 `databaseActivityEvents`，然後查得到的文件大概都長這樣：

```
echo <AYABeG1fRHnPRnX68g...> | base64 -d > encrypted.bin
```

```
aws kms decrypt \
  --ciphertext-blob fileb://encrypted.bin \
  --key-id <key_id> \
  --encryption-context 'aws:rds:dbc-id'=<cluster_id> \
  --query Plaintext \
  --output text
```

重點來了，如果你開的是獨立的 RDS Instance 就不會有 cluster_id，所以要把 `encryption-context` 改成：

```
'aws:rds:db-id'=<instance_id>
```

至於 instance_id 可以透過這個指令取得：

```
aws rds describe-db-instances --query 'DBInstances[].{instance_id:DbiResourceId,id:DBInstanceIdentifier}'
```
