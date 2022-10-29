# shell for loop

```sh
declare -a port_arr=(
  3306 # mysql
  6379 # redis
)

for port in "${port_arr[@]}"
do
  declare -i pid=$(lsof -t -i :$port -sTCP:LISTEN)
  if [[ $pid -ne 0 ]]; then
    echo "kill process occupying on port: $port"
    kill $(lsof -t -i :$port -sTCP:LISTEN)
  fi
done


kubectl port-forward svc/mysql -n infra 3306 &
kubectl port-forward svc/redis-master -n infra 6379 &
```
