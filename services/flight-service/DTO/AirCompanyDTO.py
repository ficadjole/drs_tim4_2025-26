class AirCompanyDTO:
        def __init__(self, data):
            self.id = data.get("id")
            self.name = data.get("name")
            