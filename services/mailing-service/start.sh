#!/bin/sh
# start.sh

poetry run celery -A app.tasks.celery worker --loglevel=info --pool=solo &

poetry run python run.py
