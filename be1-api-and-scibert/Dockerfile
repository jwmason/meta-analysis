# Use full Python image (NOT slim) for better compatibility
FROM python:3.11

# Set working directory inside container
WORKDIR /app

# Install system dependencies required for scientific libraries (torch, sentence-transformers, etc.)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy your FastAPI app code into the container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your FastAPI app runs on
EXPOSE 8000

# Command to run FastAPI with Gunicorn (production setup)
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "main:app"]
