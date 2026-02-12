from celery import Celery
from Domen.Config.config import Config

celery_app = Celery(
    broker= Config.CELERY_BROKER_URL,
)

def notify_promotion(subject,to,body):
    celery_app.send_task("email.task.send_email_promotion",args=[subject,to,body],)
