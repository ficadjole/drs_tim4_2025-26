from flask_socketio import SocketIO, join_room
from flask import request

socketio = SocketIO(cors_allowed_origins="*")

def register_socket_events(socketio):

    @socketio.on("connect")
    def on_connect():
        print("Client connected:", request.sid)

    @socketio.on("disconnect")
    def on_disconnect():
        print("Client disconnected:", request.sid)

    @socketio.on("join_admin")
    def join_admin():
        join_room("admins")
        print("Admin joined admins room:", request.sid)