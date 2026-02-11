from flask import Flask
from Database.InitializationDataBase import db
from Domen.Models.Users import Users
from Domen.Config.config import Config
from Extensions.Bcrypt import bcrypt
from Routes.UserRoutes import user_bp
from Auth.JWTManager import jwt
from Routes.AuthRoutes import auth_bp
from Routes.Gateway import gateway_bp
from flask_cors import CORS
from WebSocket.Socket import socketio, register_socket_events
from flask_socketio import SocketIO
app = Flask(__name__)
CORS(app,origins=["https://frontend-service.onrender.com"])
app.config.from_object(Config)
db.init_app(app)

socketio.init_app(app)
register_socket_events(socketio)
bcrypt.init_app(app)
jwt.init_app(app)
app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(gateway_bp)

if __name__ == "__main__":
    with app.app_context():
            # create_all() proverava sve klasu koje nasleđuju db.Model
            db.create_all()
            print("Tabele su uspešno kreirane u bazi!")

    socketio.run(app, port=5001, host="0.0.0.0")