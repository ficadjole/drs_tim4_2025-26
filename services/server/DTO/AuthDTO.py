class LoginDTO:
    def __init__(self, data):
        self.email = data.get("email")
        self.password = data.get("password")

    def is_valid(self):
        return self.email and self.password

class RegisterDTO:
    def __init__(self, data: dict):
        self.email = data.get("email")
        self.password = data.get("password")
        self.firstName = data.get("firstName")
        self.lastName = data.get("lastName")
        self.dateOfBirth = data.get("dateOfBirth")
        self.gender = data.get("gender")
        self.state = data.get("state")
        self.streetName = data.get("streetName")
        self.streetNumber = data.get("streetNumber")
    
    def is_valid(self):
        return all([
            self.email,
            self.password,
            self.firstName,
            self.lastName,
            self.dateOfBirth
        ])