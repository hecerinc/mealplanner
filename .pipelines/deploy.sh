#!/bin/bash

# UI

## Build react
tz=$(date +"%Y-%m-%d %H:%M:%S%z")
echo "$tz Deploying mealplanner."
echo "-------------------------------------------------"

DEST='/var/www/html/atom'
cd ui/
if [ "$ENVIRONMENT" == "PRODUCTION" ]; then
	rm -rf build
	PUBLIC_URL='/atom' yarn build
	cp -R build/* $DEST
fi

## Move to atom folder


# API

## Restart the service
location=$(dirname "$0")
source "$location/../.venv/bin/activate"

pip3 install -r "$location/../requirements.txt"
sudo systemctl restart mealplanner_api

tz=$(date +"%Y-%m-%d %H:%M:%S%z")
echo "-------------------------------------------------"
echo "$tz Deployment done."
