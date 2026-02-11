import requests
import resend
from flask_mail import Message
from .extensions import resend, celery
from .config import Config
import base64


@celery.task
def send_email(to,subject,body):
        recipients = to if isinstance(to,list) else [to]

        r = resend.Emails.send({
                "from": Config.MAIL_USERNAME,
                "to": recipients,
                "subject": subject,
                "html": f"<p>{body}</p>"
        })


@celery.task(name="email.task.send_ticket_cancelled_email")
def send_ticket_cancel_email(userId,flightId):
        user_resp = requests.get(f"http://user-service:5001/api/users/{userId}")
        user_data = user_resp.json()
        recipients = [user_data["email"]]

        flight_resp = requests.get(f"http://flight-service:5002/api/flights/getFlight/{flightId}")
        flight_data = flight_resp.json()

        params: resend.Emails.SendParams = {
                "from": Config.MAIL_USERNAME,
                "to": recipients,
                "subject": "Ticket cancelled",
                "html": f"<p>Your ticket for flight: <strong>{flight_data["name"]}</strong> has been cancelled.</p>"
        }

        resend.Emails.send(params)


@celery.task(name="email.task.send_flight_cancelled_email")
def send_flight_cancelled_email(flightId):
        ticket_response = requests.get(f"http://flight-service:5002/api/tickets/flights-tickets/{flightId}")
        ticket_data = ticket_response.json()
        for ticket in ticket_data:
                user_response = requests.get(f"http://user-service:5001/api/users/{ticket['userId']}",timeout=5)

                user_data = user_response.json()

                params: resend.Emails.SendParams = {
                        "from": Config.MAIL_USERNAME,
                        "to": [user_data['email']],
                        "subject": "Flight cancelled",
                        "html": f"<p>Your flight {flightId} has been cancelled.</br>Your ticket #{ticket['id']} (price: {ticket['ticketPrice']}) is no longer valid.</p>"
                }

                resend.Emails.send(params)

@celery.task(name="email.task.send_report_pdf")
def send_report_pdf(admin_email, tab_name, pdf_b64):
        file_data = base64.b64decode(pdf_b64)

        with open("izvestaj_test.pdf", "wb") as f:
                f.write(file_data)

        params: resend.Emails.SendParams = {
                "from": Config.MAIL_USERNAME,
                "to": [admin_email],
                "subject": f"Flight Report - {tab_name}",
                "html": f"<p>Attached is the generated report for the <b>{tab_name}</b> tab.</p>",
                "attachments": [{
                                "filename": f"report_{tab_name.lower()}.pdf",
                                "content": pdf_b64,
                                "type": "application/pdf"
                        }]
        }

        response = resend.Emails.send(params)

        return response

        # msg = Message(
        #         subject = f"Flight Report - {tab_name}",
        #         sender= Config.MAIL_USERNAME,
        #         recipients=[admin_email],
        #         body=f"Attached is the generated report for the {tab_name} tab."
        # )


