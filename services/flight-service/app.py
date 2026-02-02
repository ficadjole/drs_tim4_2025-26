from flask import Flask
from Database.InitializationDataBase import db
from Domen.Config.config import  Config
from Routes.AirCompanyRoutes import companies_bp
from Routes.BoughtTicketsRoutes import ticktes_bp
from Routes.FlightsRoutes import flights_bp
from Domen.Models.AirCompany import AirCompanies
from Domen.Models.BoughtTickets import BoughtTickets
from Domen.Models.Flights import  Flights
from Websocket.socket import socketio, register_socket_events

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
socketio.init_app(app, cors_allowed_origins="*")
register_socket_events(socketio)

app.register_blueprint(companies_bp)
app.register_blueprint(ticktes_bp)
app.register_blueprint(flights_bp)

if __name__ == "__main__":
    with app.app_context():
            # create_all() proverava sve klasu koje nasleđuju db.Model
            db.create_all()
            print("Uspesno je pokrenut FLIGHT-SERVICE")

    socketio.run(app, debug=True, port=5002) #zato socketio jer inace ne bi radio WebSocket