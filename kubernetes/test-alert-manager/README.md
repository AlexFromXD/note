有次在串接 SNS 做為 AlertManager 的 receiver 時，依照慣例裝好了 prom-operator

```
helm upgrade -i prometheus-stack oci://ghcr.io/prometheus-community/charts/kube-prometheus-stack -f values.yaml --version 77.6.1
```

之後送個測試

```
curl -XPOST http://localhost:9093/api/v2/alerts \
 -H 'Content-Type: application/json' \
  -d '[
    {
      "labels": {
        "alertname": "AlarmTest",
        "severity": "info",
        "namespace": "default"
      },
      "annotations": {
        "summary": "This is a test alert from AlertManager"
      }
    }
  ]'
```

有順利收到 SNS 送來的信。

過沒多久卻被反應說沒收到 Alarm，錯誤訊息是

> sns/sns[0]: notify retry canceled due to unrecoverable error after 1 attempts: unexpected status code 400: Invalid parameter: Subject

雖然有看到相關 Issue [#prometheus/alertmanager/issues/2781](https://github.com/prometheus/alertmanager/issues/2781)，看起來就是 SNS 的鍋了，不過還是先來做個 E2E Test。

1. 先透過 PrometheusRule 定義一個測試用的 Alert 規則。

   ```
   kubectl apply -f ./fake-alarm.yaml
   ```

1. 因為沒辦法直接送 metrics 進 prometheus，只能透過 pushgateway 讓 prometheus 自己去爬。

   ```
   helm upgrade -i pushgateway oci://ghcr.io/prometheus-community/charts/prometheus-pushgateway \
    --set serviceMonitor.enabled=true \
    --set serviceMonitor.additionalLabels.release=prometheus
   ```

1. 實際把資料打進 pushgateway。

   ```
   curl -X POST http://localhost:9091/metrics/job/fake_alarm_test \
    -H "Content-Type: text/plain" \
    --data-binary $'fake_alarm 1\n'
   ```

   > 如果要消除 alarm 再送一個 --data-binary $'fake_alarm 0\n'

有了測試方法後，回頭看 [SNS 文件](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) 也有提到

> Constraints: Subjects must be UTF-8 text with no line breaks or control characters, and less than 100 characters long.

再看 [sns_config](https://prometheus.io/docs/alerting/latest/configuration/#sns_config) default subject 是 `'{{ template "sns.default.subject" .}}'`，我們可以在 AlertManager 的 [source code](https://github.com/prometheus/alertmanager/blob/7d6cebe45aa7b981490bdf8af6c09c33f42a773b/template/default.tmpl#L103) 裡面看到 `sns.default.subject` 指向另一個 template `{{ template "__subject" . }}`，實際格式為

```go
{{ define "__subject" }}[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .GroupLabels.SortedPairs.Values | join " " }} {{ if gt (len .CommonLabels) (len .GroupLabels) }}({{ with .CommonLabels.Remove .GroupLabels.Names }}{{ .Values | join " " }}{{ end }}){{ end }}{{ end }}
```

稍微整理一下

```go
{{- define "__subject" }}
  [{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}]
  {{ .GroupLabels.SortedPairs.Values | join " " }}
  {{- if gt (len .CommonLabels) (len .GroupLabels) }}
    ({{- with .CommonLabels.Remove .GroupLabels.Names }}
      {{ .Values | join " " }}
    {{- end }})
  {{- end }}
{{- end }}
```

- 第一段是 Alarm 狀態例如 `[FIRING:3]` or `[RESOLVED]`
- 第二段是把 GroupLabels 排序後取值 join

  ```yaml
  alertname: CPUThrottlingHigh
  namespace: kube-system
  ```

  變成

  ```
  CPUThrottlingHigh kube-system
  ```

- 最後是當 common label 比 group label 多，就在括號內補上「group 以外的其他 label 值」。
  ```yaml
  CommonLabels:
    alertname: AlertmanagerClusterFailedToSendAlerts
    namespace: kube-system
    integration: sns
    severity: warning
  GroupLabels:
    alertname: AlertmanagerClusterFailedToSendAlerts
  ```
  變成
  ```
  (kube-system sns warning)
  ```

因為這個 default 規則的關係讓 subject 很容易超過 100 字元的限制。解法就是自訂 subject format 吧

```
sns_configs:
  - topic_arn: arn:aws:sns:us-east-1:123456789012:EKSAlarm
    subject: "{{ .CommonLabels.alertname }} ({{ .Status | toUpper }})"
```
