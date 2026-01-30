from Database.InitializationDataBase import db
from sqlalchemy.orm import relationship


class Flights(db.Model):
    __tablename__ = "Flights"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50),nullable=False)

    airCompany_id = db.Column(db.Integer,db.ForeignKey("AirCompanies.id",ondelete="CASCADE"))
    airCompany = db.relationship("AirCompanies")

    flightDuration = db.Column(db.Integer,nullable=False,default=0)
    currentFlightDuration = db.Column(db.Integer,nullable=False,default=0)
    departureTime = db.Column(db.DateTime,nullable=False,default=0)
    departureAirport = db.Column(db.String(50),nullable=False)
    arrivalAirport = db.Column(db.String(50),nullable=False)
    ticketPrice = db.Column(db.Integer,nullable=False,default=0)

    createdBy = db.Column(db.Integer,nullable=False,default=0)

    db.relationship("BoughtTickets",back_populates="flight")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "flightDuration": self.flightDuration,
            "currentFlightDuration": self.currentFlightDuration,
            "departureTime": self.departureTime,
            "departureAirport": self.departureAirport,
            "arrivalAirport": self.arrivalAirport,
            "ticketPrice": self.ticketPrice,
            "createdBy": self.createdBy,
        }

    def __repr__(self):
        return f"User('{self.name}','{self.flightDuration}','{self.ticketPrice}','{self.createdBy}')"