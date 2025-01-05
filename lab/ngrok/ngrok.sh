#!/bin/zsh

#------------------------------------------------------------------
# remeber to edit your ~/.ssh/config first
#
#   Host ngrok
#     User ec2-user
#     ProxyCommand aws ec2-instance-connect open-tunnel --instance-id i-xxxx
#-----------------------------------------------------------------
# also you have to send your public key
# https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ec2-instance-connect/send-ssh-public-key.html
#-----------------------------------------------------------------
#   aws ec2-instance-connect send-ssh-public-key \
#       --instance-id i-021a9913826a456dd \
#       --instance-os-user ec2-user \
#       --ssh-public-key file:///Users/alexwu/.ssh/id_rsa.pub
#------------------------------------------------------------------

local_port=$1
if [ -z $local_port]; then
  echo port is required
  exit 255
fi

ngrok_server=http://13.113.210.44:3000
resp=$(curl -s -XPOST "$ngrok_server/register")
id=$(echo $resp | jq -r '.id')
port=$(echo $resp | jq '.port')

echo "your service is expported at $ngrok_server/$id"
ssh -NR "${port}:localhost:${local_port}" ngrok
