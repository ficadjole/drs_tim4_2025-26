#!/bin/bash
set -e

# Start Redis (ako je unutar istog image-a)
# redis-server &

# Start User Service
python ./server/app.py &

# Start Flight Service
python ./flight-service/app.py &

# Start Mailing Service
python ./mailing-service/run.py &

# Start Celery worker (ako želiš)
cd ./mailing-service
poetry run celery -A app.tasks.celery worker --loglevel=info --pool=solo &

# Wait forever (držimo container živim)
wait
