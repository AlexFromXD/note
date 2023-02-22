當我們用 terraform 跑了一些帶有 credential 的東西，通常 value 不會直接被顯示出來：

```
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

secret = <sensitive>
```

如果想看 value 可以去 `terraform.tfstate` 裡面找，這時候可以用 `-target` 指定 resource / module ，縮小尋找範圍。

```sh
terraform plan -target={} -out=./tfplan
terraform show -json ./tfplan
```

以 [example](./example/) 為例：

```
terraform plan -target random_password.password -out=./tfplan
terraform show -json ./tfplan | jq '.resource_changes[0].change.after.result'

```

以 [AWS RDS AURORA MODULE](https://github.com/terraform-aws-modules/terraform-aws-rds-aurora) 為例：

```
terraform plan -target=module.{}.random_password.master_password -out=./tfplan
terraform show -json ./tfplan | jq '.resource_changes[0].change.after.result'
```
