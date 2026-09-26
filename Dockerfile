FROM python:3.12-slim
WORKDIR /repo

RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt /repo/backend/requirements.txt
RUN pip install --no-cache-dir -r /repo/backend/requirements.txt

COPY backend /repo/backend
COPY ml /repo/ml
COPY data /repo/data

ENV PYTHONPATH=/repo
WORKDIR /repo/backend

EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
