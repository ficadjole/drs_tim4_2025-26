from flask import Blueprint,request,jsonify
from .tasks import send_email

mail_bp = Blueprint('mail',__name__)

@mail_bp.route("/send", methods=["POST"])
def send():
    data = request.get_json(silent=True)

    if data:
        send_email.delay(
            data['to'],
            data['subject'],
            data['body']
        )
        return jsonify({'status': 'queued'}),202
    return jsonify({'status': 'failed'}), 400