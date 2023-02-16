## Loop

terraform 有兩種跑迴圈的方式

- [count](./example/count.tf) 用來 loop list
- [for_each](./example/each.tf) 用來 loop key-value

## Import

[registry.terraform.io](https://registry.terraform.io/) 上可以找到某個 resource 的 import 語法，通常是這種格式

```
terraform import {resource}.{name} {id, name, arn, ...}
```

例如 [kubernetes namespace](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs/resources/namespace_v1#import)：

```
terraform import kubernetes_namespace_v1.n terraform-example-namespace
```

但如果 resource 帶有 loop 呢？

```hcl
variable "namespaces" {
  type = list(string)
  default = [
    "default",
    "kube-system",
    "monitor",
    "logging"
  ]
}

locals {
  namespaces = zipmap(var.namespaces, var.namespaces)
}

resource "kubernetes_namespace_v1" "namespaces" {
  for_each = local.namespaces
  metadata {
    name = each.value
  }
}
```

基本上就是在 `{resource}.${name}` 後面會多一個 id / key，變成這樣

```
terraform import '{resource}.{name}["{key}"]' {id, name, arn, ...}
```

> string 單引號要記得加

或是也可以用 `terraform state list` 看到完整的 resource list。如果有需要 import 到 module 裡面的也就一清二楚了。
