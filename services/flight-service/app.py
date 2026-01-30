from flask import Flask
from Database.InitializationDataBase import db
from Domen.Config.config import  Config
from Routes.AirCompanyRoutes import companies_bp
from Domen.Models.AirCompany import AirCompanies
from Domen.Models.BoughtTickets import BoughtTickets
from Domen.Models.Flights import  Flights

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

app.register_blueprint(companies_bp)

if __name__ == "__main__":
    with app.app_context():
            # create_all() proverava sve klasu koje nasleđuju db.Model
            db.create_all()
            print("Uspesno je pokrenut FLIGHT-SERVICE")

    app.run(debug=True, port=5002)