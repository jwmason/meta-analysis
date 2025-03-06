#!/bin/bash
set -e  # Exit script on first error

echo "========== Starting Custom Startup Script =========="
echo "Current directory: $(pwd)"
echo "Listing files in /home/site/wwwroot:"
ls -l /home/site/wwwroot

echo "Installing dependencies from requirements.txt..."
pip install --no-cache-dir -r /home/site/wwwroot/requirements.txt

echo "Launching Gunicorn with UvicornWorker..."
exec gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 main:app