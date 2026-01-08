from flask_mail import Mail
from celery import Celery
from .config import Config

mail = Mail()
celery = Celery(__name__, broker=Config.CELERY_BROKER_URL)