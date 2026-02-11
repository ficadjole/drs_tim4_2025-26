FROM python:3.14.3-slim

WORKDIR /app

COPY pyproject.toml poetry.lock ./

RUN pip install --upgrade pip && pip install poetry && poetry install --no-root

COPY . .

EXPOSE 4001

CMD ["poetry","run","python","run.py"]