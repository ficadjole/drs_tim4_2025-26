# seed.py
from app import app  # uvezi tvoj Flask app
from Database.InitializationDataBase import db
from Domen.Models.Users import Users  # primer modela koji seeduješ
from  Domen.Enums.UserRoles import UserRoles
from Domen.Enums.Genders import Genders
from Extensions.Bcrypt import bcrypt

def seed():
    existing = Users.query.filter_by(email="velemirfilip@gmail.com").first()
    if existing:
        print("Admin već postoji, preskačem insert")
        return

    admin_user = Users(
        email="velemirfilip@gmail.com",
        password_hash=bcrypt.generate_password_hash("admin").decode("utf-8"),
        firstName="Admin",
        lastName="User",
        dateOfBirth="1990-01-01",
        gender=Genders.MALE,
        state="SomeState",
        streetName="AdminStreet",
        streetNumber="1",
        accountBalance=0.0,
        userRole=UserRoles.ADMINISTRATOR
        )

    db.session.add(admin_user)
    db.session.commit()


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        seed()
