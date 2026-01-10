from datetime import datetime, timedelta
from flask_jwt_extended import create_access_token
from Domen.Models.Users import Users
from Extensions.Bcrypt import bcrypt
from Database.InitializationDataBase import db

class AuthService:
    @staticmethod
    def login(email, password):
        user = Users.query.filter_by(email=email).first()

        if not user:
            raise ValueError("Invalid credentials")
        
        if user.blockedUntil and user.blockedUntil > datetime.utcnow():
            raise ValueError("Account temporarily blocked")
        
        if not bcrypt.check_password_hash(user.password_hash, password):
            user.failedAttempts += 1

            if user.failedAttempts >= 3:
                user.blockedUntil = datetime.utcnow() + timedelta(minutes=1)
                user.failedAttempts = 0
            
            db.session.commit()
            raise ValueError("Invalid credentials")
        
        user.failedAttempts = 0
        user.blockedUntil = None
        db.session.commit()

        token = create_access_token(
            identity=user.id,
            additional_claims={
                "role":user.userRole.name
            }
        )

        return token