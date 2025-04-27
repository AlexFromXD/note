[Update] 全部都去用 [aws-vault](https://github.com/99designs/aws-vault)，人生更美好。

- 同時開多個 AWS Console

  ```sh
  aws-login () {
      aws-vault login -s $1 | xargs /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --lang="en" --no-first-run --new-window --disk-cache="$HOME/.aws/console" --user-data-dir="$HOME/.aws/console" --profile-directory=$1
  }
  ```

- aws-vault 自動補齊

  ```sh
  autoload -Uz compinit
  compinit

  _list_profiles() {
  compadd $(aws-vault list --profiles | tr "\n" " ")
  }

  compdef _list_profiles aws-vault exec
  compdef _list_profiles aws-login
  ```

---

以下 Archive 以下 Archive 以下 Archive 以下 Archive 以下 Archive

---

如果有啟用 AWS MFA，cli tool 也需要額外的 token 才能正常使用

```sh
#!/bin/sh

credential=$(aws sts get-session-token \
    --serial-number arn:aws:iam::<AccountId>:mfa/<UserName> \
    --token-code $1)

echo $credential

export AWS_ACCESS_KEY_ID=$(echo $credential | jq -r .Credentials.AccessKeyId)
export AWS_SECRET_ACCESS_KEY=$(echo $credential | jq -r .Credentials.SecretAccessKey)
export AWS_SESSION_TOKEN=$(echo $credential | jq -r .Credentials.SessionToken)
```

> 執行 script 的時候要用`source`，環境變數才會 pass 到原本執行的 session。

## Reference

- [https://aws.amazon.com/tw/premiumsupport/knowledge-center/authenticate-mfa-cli/](https://aws.amazon.com/tw/premiumsupport/knowledge-center/authenticate-mfa-cli/)
