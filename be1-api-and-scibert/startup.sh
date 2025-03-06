#!/bin/bash

# Optional: Log for debugging (visible in Kudu SSH if needed)
echo "Running startup script..."

# Install dependencies inside App Service (in case they aren't installed correctly)
pip install -r /home/site/wwwroot/requirements.txt

# Start the application with Gunicorn and UvicornWorker
gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000 be1-api-and-scibert.main:app
