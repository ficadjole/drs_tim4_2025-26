from sqlalchemy import Enum
from ..Enums.UserRoles import UserRoles
from ..Enums.Genders import Genders
from Database.InitializationDataBase import db

class Users(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120),nullable=False,unique=True)
    password_hash = db.Column(db.String(256),nullable=False)

    firstName = db.Column(db.String(20),nullable=False)
    lastName = db.Column(db.String(20),nullable=False)
    dateOfBirth = db.Column(db.DateTime,nullable=False)
    gender = db.Column(db.Enum(Genders),nullable=False,default=Genders.MALE)

    state = db.Column(db.String(50),nullable=False)
    streetName = db.Column(db.String(50),nullable=False)
    streetNumber = db.Column(db.String(10),nullable=False)

    accountBalance = db.Column(db.Float,nullable=False,default=0.0)
    userRole = db.Column(db.Enum(UserRoles),nullable=False,default=UserRoles.USER)

    failedAttempts = db.Column(db.Integer, default=0)
    blockedUntil = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"User('{self.firstName}','{self.lastName}','{self.email}')"