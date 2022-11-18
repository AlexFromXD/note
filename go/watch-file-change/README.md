# Description

watch config file and update in real time.

# Test

```
$ go run cmd/main.go
```

then edit `conf/test.yaml`

## Watch out !

If the watch target is mounted in k8s, e.g. `secret`, the event type would be slightly counter-intuitive due to the `tmpfs` mechanism.

| target |   event type   |
| :----: | :------------: |
|  file  | chmod / remove |
| folder | chmod / create |

[more detail](https://github.com/fsnotify/fsnotify/issues/363)
