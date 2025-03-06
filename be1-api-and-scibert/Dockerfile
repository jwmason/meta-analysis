# Use slim Python image to keep it lightweight
FROM python:3.11-slim

# Set working directory inside container
WORKDIR /app

# Copy your FastAPI app code into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose FastAPI port
EXPOSE 8000

# Command to run FastAPI with Gunicorn (production setup)
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "main:app"]
