FROM python:3.14.3-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./

COPY start.sh .

RUN pip install --upgrade pip && pip install poetry && poetry install --no-root

COPY . .

EXPOSE 4001

RUN chmod +x start.sh
CMD ["./start.sh"]