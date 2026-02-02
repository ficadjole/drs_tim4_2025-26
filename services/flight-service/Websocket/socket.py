from flask_socketio import SocketIO, join_room

socketio = SocketIO(cors_allowed_origins="*")

def register_socket_events(socketio):
    @socketio.on("connect")
    def handle_connect():
        print("Client connected")

    @socketio.on("join_admin")
    def handle_join_admin():
        join_room("admins")