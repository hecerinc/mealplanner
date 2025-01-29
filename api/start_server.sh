#!/bin/bash

gunicorn --timeout 360 -b "0.0.0.0:8993" "server:app"
