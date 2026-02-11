FROM docker/compose:2.17.3

WORKDIR /app

# Kopiramo docker-compose i sve servise
COPY docker-compose.yml .
COPY services ./services

# Build svih servisa
RUN docker-compose build

CMD ["docker-compose", "up"]
