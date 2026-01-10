from flask_jwt_extended import JWTManager
from flask_jwt_extended import get_jwt
from Domen.Models.TokenBlacklist import TokenBlacklist

jwt = JWTManager()

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return TokenBlacklist.query.filter_by(jti=jti).first() is not None