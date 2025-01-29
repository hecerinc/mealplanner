#!/bin/bash
location=$(dirname "$0")
source "$location/../.venv/bin/activate"
gunicorn --timeout 360 -b "0.0.0.0:8993" "server:app"
