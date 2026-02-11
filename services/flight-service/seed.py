from app import app
from Database.InitializationDataBase import db
from Domen.Models.AirCompany import AirCompanies
from Domen.Models.Flights import Flights
from Domen.Models.BoughtTickets import BoughtTickets
from datetime import datetime, timedelta

def seed_air_companies():
    companies = ["RyanAir", "Lufthansa", "EasyJet"]
    for name in companies:
        if not AirCompanies.query.filter_by(name=name).first():
            db.session.add(AirCompanies(name=name))
    db.session.commit()
    print("Sedovane avio kompanije")

def seed_flights():
    company = AirCompanies.query.first()
    if not company:
        print("Ne postoje avio kompanije, prekidam seedovanje")
        return

    for i in range(1, 4):
        flight_name = f"FL-{i}"
        if not Flights.query.filter_by(name=flight_name).first():
            flight = Flights(
                name=flight_name,
                airCompanyId=company.id,
                flightDuration=120 + i * 10,
                currentFlightDuration=0,
                departureTime=datetime.now() + timedelta(days=i),
                departureAirport="CityA",
                arrivalAirport="CityB",
                ticketPrice=100 + i * 50,
                createdBy=1,
                cancelled=False
            )
            db.session.add(flight)
    db.session.commit()
    print("Letovi sedovani")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed_air_companies()
        seed_flights()
        print("Zavrseno seedovanje flight-servica")
