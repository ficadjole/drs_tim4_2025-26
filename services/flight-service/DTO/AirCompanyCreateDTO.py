class AirCompanyCreateDTO:
    def __init__(self, data: dict):
        self.name = data['name']