import json

from Domen.Models.Users import Users
from Database.InitializationDataBase import db
from Extensions.Bcrypt import bcrypt
from Domen.Config.redis_client import redis_client


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

        cache_key = f"user:{user_id}"

        cache = redis_client.get(cache_key)

        if cache:
            return json.loads(cache)

        user = Users.query.get(user_id)

        user_data = user.to_dict()

        redis_client.set(cache_key, json.dumps(user_data),ex=300)

        return user_data


    @staticmethod
    def get_user_by_email(email):
        return Users.query.filter_by(email=email).first()

    @staticmethod
    def get_all_users():
        return Users.query.all()
    
    @staticmethod
    def delete_user(user_id):
        user = Users.query.get(user_id)

        if user:
            cache_key = f"user:{user_id}"

            db.session.delete(user)
            db.session.commit()

            redis_client.delete(cache_key)

            return True
        
        return False

    @staticmethod
    def add_money(user_id, money):
        user:Users = Users.query.get(user_id)
        if not user:
            raise ValueError("User does not exist")

        user.accountBalance += money
        cache_key = f"user:{user_id}"
        db.session.commit()

        redis_client.delete(cache_key)

        return True
    
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

        fields_for_update = ["firstName", "lastName", "dateOfBirth", "gender", "state", "streetName", "streetNumber", "accountBalance", "userRole","userImageUrl"]

        for field in fields_for_update:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()



        cache_key = f"user:{user_id}"
        redis_client.delete(cache_key)

        return user
    