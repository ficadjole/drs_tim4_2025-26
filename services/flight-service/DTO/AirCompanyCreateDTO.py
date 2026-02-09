class AirCompanyCreateDTO:
    def __init__(self, data: dict):
        self.name = data.get('name')

    def is_valid(self):
        if not self.name or len(self.name) < 2:
            return "Name of company must have at least 2 characters."
        return None