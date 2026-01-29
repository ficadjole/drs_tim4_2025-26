from Domen.Models.AirCompany import AirCompany
from Database.InitializationDataBase import db

class AirCompanyService:

    @staticmethod
    def get_all():
        return AirCompany.query.getAll()

    @staticmethod
    def get_by_id(id):
        return AirCompany.query.get(id)

    @staticmethod
    def get_by_name(name):
        return AirCompany.query.filter_by(name=name).first()

    @staticmethod
    def update_by_id(id,name):
        airCompany = AirCompany.query.get(id)
        airCompany.name = name
        db.session.commit()
        return airCompany

    @staticmethod
    def delete(id):
        airCompany = AirCompany.query.get(id)

        if airCompany:
            db.session.delete(airCompany)
            db.session.commit()
            return True
        else:
            return False
        