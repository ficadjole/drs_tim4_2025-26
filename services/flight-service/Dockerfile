FROM python:3.14.3-slim

WORKDIR /app

ENV TZ: Europe/Belgrade

RUN apt-get update && apt-get install -y gcc libpq-dev python3-dev && rm -rf /var/lib/apt/lists/*

COPY  pyproject.toml poetry.lock ./

RUN pip install --upgrade pip && pip install poetry && poetry install --no-root

COPY . .

EXPOSE 5002

CMD ["poetry","run","python","app.py"]