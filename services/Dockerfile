FROM python:3.11-slim

WORKDIR /app

# Kopiraj svaki servis u svoj folder
COPY server ./server
COPY flight-service ./flight-service
COPY mailing-service ./mailing-service

# Instaliraj zavisnosti za svaki servis
RUN pip install --no-cache-dir poetry

# instalacija za svaki servis
RUN cd server && poetry config virtualenvs.create false && poetry install --no-dev
RUN cd flight-service && poetry config virtualenvs.create false && poetry install --no-dev
RUN cd mailing-service && poetry config virtualenvs.create false && poetry install --no-dev

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Startujemo sve servise
ENTRYPOINT ["/entrypoint.sh"]
