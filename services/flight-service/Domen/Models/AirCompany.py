from Database.InitializationDataBase import db

class AirCompanies(db.Model):
    __tablename__ = "AirCompanies"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100),nullable=False,unique=True)
    db.relationship("Flights",back_populates="airCompany")

    def __repr__(self):
        return f"AirCompany {self.name}"