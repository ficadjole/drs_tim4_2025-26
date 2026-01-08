
from flask_mail import Message
from .extensions import mail, celery
from .config import Config

@celery.task
def send_email(to,subject,body):
        recipients = to if isinstance(to,list) else [to]
        msg = Message(subject,sender=Config.MAIL_USERNAME,recipients=recipients,body=body)
        mail.send(msg)
