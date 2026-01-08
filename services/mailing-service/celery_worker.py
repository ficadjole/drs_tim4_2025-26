from app.extensions import celery
from app import create_app
celery.start()
app = create_app()
app.app_context().push()