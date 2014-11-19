#!/bin/bash

apt-get update
apt-get install build-essential
apt-get install -y tcl8.5

curl -sL https://deb.nodesource.com/setup | sudo bash -
apt-get install -y nodejs
npm install -g nodemon
