#!/bin/bash

echo "Start SSH tunnel to swaziland"
# This script starts the SSH tunnel link and restarts it as needed
while true; do
  ssh -R 13022:127.0.0.1:22 -p 37777 -l tdolby tdolby.demon.co.uk "/export/users/dad/html/bin/ssh-keepalive.sh"
  sleep 10
done
