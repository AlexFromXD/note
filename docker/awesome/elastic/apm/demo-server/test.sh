#!/bin/bash

echo "=== not login ==="
curl "localhost:3000/data?id=1" # 401
echo

echo "=== user: 123 ==="
curl -H "x-user-id: 123" "localhost:3000/data?id=1"
echo
curl -H "x-user-id: 123" "localhost:3000/data?id=2"
echo
curl -XPOST -H "x-user-id: 123" "localhost:3000/span"
echo

echo "=== user: 234 ==="
curl -H "x-user-id: 234" "localhost:3000/data?id=3"
echo
curl -H "x-user-id: 234" "localhost:3000/data" # 400
echo
curl -XPOST -H "x-user-id: 234" "localhost:3000/span"
echo

echo "=== user: 666 ==="
curl -H "x-user-id: 666" "localhost:3000/data?id=4" # 500
echo
curl -XPOST -H "x-user-id: 666" "localhost:3000/span"
echo

echo "=== ignore ==="
curl "localhost:3000/ignore/path-1"
echo

echo "=== dependency ==="
curl "localhost:3000/dep"
echo
