如果有啟用 AWS MFA，cli tool 也需要額外的 token 才能正常使用

```sh
#!/bin/sh

credential=$(aws sts get-session-token \
    --serial-number arn:aws:iam::757713829801:mfa/alex \
    --token-code $1)

echo $credential

export AWS_ACCESS_KEY_ID=$(echo $credential | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $credential | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $credential | jq -r .Credentials.SessionToken)
```

> 執行 script 的時候要用`source`，環境變數才會 pass 到原本執行的 session。

## Reference

- [https://aws.amazon.com/tw/premiumsupport/knowledge-center/authenticate-mfa-cli/](https://aws.amazon.com/tw/premiumsupport/knowledge-center/authenticate-mfa-cli/)
