#!/bin/zsh

node server/server.js &

echo "Waiting for server to start..."
sleep 2

echo "\n"

echo "$ kubectl get crd"
curl -XGET http://localhost:3000/crd

echo "\n\n"

echo "$ kubectl get crd/crd-example"
curl -XGET http://localhost:3000/crd/crd-example

echo "\n\n"

echo "$ kubectl apply -f crd/crd-example.yaml"
curl -XPOST http://localhost:3000/crd \
  -H "content-type: application/json" \
  -d '{"metadata":{"name":"crd-example"}}'

echo "\n\n"

echo "$ kubectl get crd"
curl -XGET http://localhost:3000/crd

echo "\n\n"

echo "$ kubectl get crd/crd-example"
curl -XGET http://localhost:3000/crd/crd-example

echo "\n\n"

echo "$ kubectl create -f crd/crd-example/xyz.yaml"
curl -XPOST http://localhost:3000/crd/crd-example \
  -H "content-type: application/json" \
  -d '{"metadata":{"name":"xyz"}}'
echo "\n\n"

echo "$ kubectl get crd/crd-example"
curl -XGET http://localhost:3000/crd/crd-example

echo "\n\n"

echo "$ kubectl get crd/crd-example xyz"
curl -XGET http://localhost:3000/crd/crd-example/xyz

echo "\n\n"

kill -9 $(lsof -t -i:3000)
