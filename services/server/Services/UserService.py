from Domen.Models.Users import Users
from Database.InitializationDataBase import db
from Extensions.Bcrypt import bcrypt

class UserService:
    @staticmethod
    def create_user(data):
        #provera da li email vec postoji
        existing_user = Users.query.filter_by(email=data["email"]).first()
        if existing_user:
            raise ValueError("Email already exists")
        
        user = Users(
            email=data["email"],
            password_hash=bcrypt.generate_password_hash(data["password"]).decode("utf-8"),
            firstName=data["firstName"],
            lastName=data["lastName"],
            dateOfBirth=data["dateOfBirth"],
            gender=data["gender"],
            state=data["state"],
            streetName=data["streetName"],
            streetNumber=data["streetNumber"],
            accountBalance=data.get("accountBalance", 0.0)
        )

        db.session.add(user)
        db.session.commit()

        return user
    
    @staticmethod
    def get_user_by_id(user_id):
        return Users.query.get(user_id)
        
    @staticmethod
    def get_all_users():
        return Users.query.all()
    
    @staticmethod
    def delete_user(user_id):
        user = Users.query.get(user_id)

        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        
        return False
    
    @staticmethod
    def update_user(user_id, data):
        user = Users.query.get(user_id)

        if not user:
            return None
        
        if "email" in data and data["email"] != user.email:
            existing = Users.query.filter_by(email = data["email"]).first()
            if existing:
                raise ValueError("Email already exists")
            
            user.email = data["email"]
        
        if "password" in data:
            user.password_hash = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

        fields_for_update = ["firstName", "lastName", "dateOfBirth", "gender", "state", "streetName", "streetNumber", "accountBalance", "userRole"]

        for field in fields_for_update:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return user
    