from flask import Flask
from .config import Config
from .extensions import mail,celery

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    mail.init_app(app)

    celery.conf.update(
        broker_url = app.config['CELERY_BROKER_URL'],
        result_backend = None,
    )

    from .routes import mail_bp
    app.register_blueprint(mail_bp, url_prefix='/mail')

    return app

class ContextTask(celery.Task):
    """Celery task koji koristi Flask app context"""
    def __call__(self, *args, **kwargs):
        app = create_app()
        with app.app_context():
            return self.run(*args, **kwargs)




celery.Task = ContextTask

