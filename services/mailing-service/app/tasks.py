import requests
from flask_mail import Message
from .extensions import mail, celery
from .config import Config
import base64


@celery.task
def send_email(to,subject,body):
        recipients = to if isinstance(to,list) else [to]
        msg = Message(subject,sender=Config.MAIL_USERNAME,recipients=recipients,body=body)
        mail.send(msg)


@celery.task(name="email.task.send_ticket_cancelled_email")
def send_ticket_cancel_email(userId,flightId):
        user_resp = requests.get(f"http://localhost:5001/api/users/{userId}")
        user_data = user_resp.json()
        recipients = [user_data["email"]]

        flight_resp = requests.get(f"http://localhost:5002/api/flights/{flightId}")
        flight_data = flight_resp.json()

        msg = Message(
                "Ticket cancelled",
                sender=Config.MAIL_USERNAME,
                recipients=recipients,
                body=f"Your ticket for flight: {flight_data["name"]} has been cancelled."
        )
        mail.send(msg)

@celery.task(name="email.task.send_flight_cancelled_email")
def send_flight_cancelled_email(flightId):
        ticket_response = requests.get(f"http://127.0.0.1:5002/api/tickets/flights-tickets/{flightId}")
        ticket_data = ticket_response.json()
        for ticket in ticket_data:
                user_response = requests.get(f"http://127.0.0.1:5001/api/users/{ticket['userId']}",timeout=5)

                user_data = user_response.json()

                msg = Message("Flight cancelled",sender=Config.MAIL_USERNAME,recipients=[user_data['email']],body=(
                    f"Your flight {flightId} has been cancelled.\n"
                    f"Your ticket #{ticket['id']} "
                    f"(price: {ticket['ticketPrice']}) is no longer valid."
                ))

                mail.send(msg)

@celery.task(name="email.task.send_report_pdf")
def send_report_pdf(admin_email, tab_name, pdf_b64):

        
        msg = Message(
                subject = f"Flight Report - {tab_name}",
                sender= Config.MAIL_USERNAME,
                recipients=[admin_email],
                body=f"Attached is the generated report for the {tab_name} tab."
        )

        file_data = base64.b64decode(pdf_b64)

       # with open("izvestaj_test.pdf", "wb") as f:
       #         f.write(file_data) ovo ako hocete da vam se sacuva pa da vidite kako izgleda


        msg.attach(f"report_{tab_name.lower()}.pdf", "application/pdf", file_data)

        mail.send(msg)