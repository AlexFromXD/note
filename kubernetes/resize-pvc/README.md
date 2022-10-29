前陣子遇到了 APM [queue is full ](https://www.elastic.co/guide/en/apm/guide/master/common-problems.html#queue-full)的問題，查了一下發現原來是 log 多到已經塞滿 elasticserach disk。雖然用 helm 裝的 apm 有個 default [ILM](https://www.elastic.co/guide/en/elasticsearch/reference/master/set-up-lifecycle-policy.html): `apm-rollover-30-days`，但 elasticserach 的 default disk size 也只有 30Gi，一天 4Gi 的 log 量一下子就塞爆了。因為目前沒有保留 log 的需求，只要把 ILM 改為 `Hot(1 day) -> Warm(7day) -> delete`就搞定了。不過為了以防萬一還是來研究一下如何調整 PVC 的大小。

#### 1. 在 `StorageClass` 上加個`allowVolumeExpansion: true`

Kubernetes v1.11 之後提供[ Expanding Persistent Volumes Claims ](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)的功能，不過有限制 volume type 。

#### 2. 刪掉 `StatefulSets` 只留下 `Pod`

如果直接去改 StatefulSets 會得到 error:

```
spec: Forbidden: updates to statefulset spec for fields other than ‘replicas’, ‘template’, and ‘updateStrategy’ are forbidden
```

所以要先刪掉 StatefulSets

```sh
kubectl delete sts <statefulset-name> --cascade=orphan
```

#### 3. 修改 PVC status.capacity.storage=xxx

#### 4. 把剛剛刪掉的 `StatefulSets` 加回來

用 helm 裝的話跑個 upgrade 就好了，記得要把參數加上去。

```
helm upgrade elasticsearch elastic/elasticsearch \
  --set volumeClaimTemplate.resources.requests.storage=xxx \
```

---

## Reference

- [https://ithelp.ithome.com.tw/articles/10244575](https://ithelp.ithome.com.tw/articles/10244575)

- [https://itnext.io/resizing-statefulset-persistent-volumes-with-zero-downtime-916ebc65b1d4](https://itnext.io/resizing-statefulset-persistent-volumes-with-zero-downtime-916ebc65b1d4)
