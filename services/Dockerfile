FROM python:3.11-slim

WORKDIR /app

COPY ./services/server ./server
COPY ./services/flight-service ./flight-service
COPY ./services/mailing-service ./mailing-service

RUN pip install --no-cache-dir poetry

RUN poetry config virtualenvs.create false \
    && cd server && poetry install --no-dev \
    && cd ../flight-service && poetry install --no-dev \
    && cd ../mailing-service && poetry install --no-dev

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Startujemo sve servise
ENTRYPOINT ["/entrypoint.sh"]
