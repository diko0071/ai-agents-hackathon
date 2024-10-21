FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    postgresql-client \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN pip install gunicorn

COPY . .

ENV PYTHONPATH=/app/backend

CMD ["gunicorn", "--chdir", "/app/backend", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]