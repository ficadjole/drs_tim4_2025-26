class UserCreateDTO:
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
        self.accountBalance = data.get("accountBalance", 0.0)

    def is_valid(self):
        return all([
            self.email,
            self.password,
            self.firstName,
            self.lastName,
            self.dateOfBirth
        ])
    
class UserResponseDTO:
    def __init__(self, user):
        self.id = user.id
        self.email = user.email
        self.firstName = user.firstName
        self.lastName = user.lastName
        self.role = user.userRole.value

    def to_dict(self):
        return self.__dict__
    
class UserUpdateDTO:
    def __init__(self, data):
        self.email = data.get("email")
        self.password = data.get("password")
        self.firstName = data.get("firstName")
        self.lastName = data.get("lastName")
        self.dateOfBirth = data.get("dateOfBirth")
        self.gender = data.get("gender")
        self.state = data.get("state")
        self.streetName = data.get("streetName")
        self.streetNumber = data.get("streetNumber")
        self.accountBalance = data.get("accountBalance", 0.0)
        self.userRole = data.get("userRole")
        self.userImageUrl = data.get("userImageUrl")


    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if v is not None}

class UserProfileDTO:
    def __init__(self, user):
        if isinstance(user, dict):
            self.email = user.get("email")
            self.firstName = user.get("firstName")
            self.lastName = user.get("lastName")
            self.dateOfBirth = user.get("dateOfBirth")
            self.gender = user.get("gender")
            self.state = user.get("state")
            self.streetName = user.get("streetName")
            self.streetNumber = user.get("streetNumber")
            self.userImageUrl = user.get("userImageUrl")
            self.userRole = user.get("userRole")
            self.accountBalance = user.get("accountBalance")
        else:
            self.email = user.email
            self.firstName = user.firstName
            self.lastName = user.lastName
            self.dateOfBirth = user.dateOfBirth.strftime("%Y-%m-%d") if user.dateOfBirth else None
            self.gender = user.gender.name if user.gender else None
            self.state = user.state
            self.streetName = user.streetName
            self.streetNumber = user.streetNumber
            self.userImageUrl = user.userImageUrl
            self.userRole = user.userRole.name if user.userRole else None
            self.accountBalance = user.accountBalance
    def to_dict(self):
        return self.__dict__