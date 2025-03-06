#!/bin/bash

echo "========= Starting Custom Startup Script ========="

cd /home/site/wwwroot || exit

echo "Installing dependencies from requirements.txt..."
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo "Starting FastAPI application with Gunicorn..."
exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app
