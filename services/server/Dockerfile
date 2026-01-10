FROM python:3-12-slim

#instalira poetry
RUN pip install poetry

#govori da nam je ovo radni folder
WORKDIR /app

#Kopira zavisnost
COPY pyproject.toml poetry.lock* ./

RUN poetry config virutalenvs.create false \ && poetry install --no-interaction --no-ansi

#Kopira kod
COPY . .

#Servis ce raditi na portu 5000
EXPOSE 5000

CMD ["python","app.py"]


