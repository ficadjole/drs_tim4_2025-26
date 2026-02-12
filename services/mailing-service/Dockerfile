FROM python:3.14.3-slim

WORKDIR /app

ENV TZ: Europe/Belgrade

COPY pyproject.toml poetry.lock ./

COPY start.sh .

RUN pip install --upgrade pip && pip install poetry && poetry install --no-root

COPY . .

EXPOSE 4001

RUN chmod +x start.sh
CMD ["./start.sh"]