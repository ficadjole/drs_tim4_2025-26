import requests
from flask import Blueprint, request, jsonify
from Services.UserService import UserService
from DTO.UserDTO import UserCreateDTO, UserResponseDTO, UserUpdateDTO, UserProfileDTO
from Domen.Enums.UserRoles import UserRoles


user_bp = Blueprint("users", __name__, url_prefix="/api/users")

@user_bp.route("/create", methods=["POST"])
def register_user():
    try:
        dto = UserCreateDTO(request.json)

        if not dto.is_valid():
            return jsonify({"error": "Invalid data"}), 400
        
        user = UserService.create_user(dto.__dict__)
        return jsonify(UserResponseDTO(user).to_dict()), 201
    
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    
    # try:
    #     data=request.json
    #     user = UserService.create_user(data)

    #     return jsonify({
    #         "id": user.id,
    #         "email": user.email,
    #         "firstName": user.firstName,
    #         "lastName": user.lastName
    #     }), 201
    
    # except ValueError as e:
    #     return jsonify({"error": str(e)}), 400

    
    
@user_bp.route("/getAll", methods=["GET"])
def get_users():
    users = UserService.get_all_users()
    return jsonify([
        {
            "id": u.id,
            "email": u.email,
            "firstName": u.firstName,
            "lastName": u.lastName,
            "userRole": u.userRole.name,
            "state": u.state,
        } for u in users
    ])

@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = UserService.get_user_by_id(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(UserProfileDTO(user).to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        success = UserService.delete_user(user_id)

        if success:
            return jsonify({"message": "User successfully deleted"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": "An error occurred during deletion"}), 500

@user_bp.route("/add-money/<int:user_id>", methods=["PUT"])
def add_money(user_id):
    try:

        money = request.json.get("money")

        if not money:
            return jsonify({"error": "Money is required"}), 400

        user = UserService.get_user_by_id(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        success = UserService.add_money(user_id, money)

        if success:
            return jsonify({"message": "Money successfully added"}), 200
        else:
            return jsonify({"error": "Money not added"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:


        dto_update = UserUpdateDTO(request.json)

        old_user = UserService.get_user_by_id(user_id)
        old_role = old_user["userRole"]
        updated_user = UserService.update_user(user_id, dto_update.to_dict())

        if not updated_user:
            return jsonify({"error": "User not found"}), 404

        if (
            dto_update.to_dict().get("userRole") == "MANAGER"
            and old_role == 'USER'
        ):
            requests.post(
                "http://127.0.0.1:4001/mail/send",
                json={
                    "subject": "Promotion!!!",
                    "to": [updated_user.email],
                    "body": "Hello, " + updated_user.firstName + " " + updated_user.lastName + " you are promoted to Manager!! Congratulations!"
                }
            )

        return jsonify(UserResponseDTO(updated_user).to_dict()), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500


