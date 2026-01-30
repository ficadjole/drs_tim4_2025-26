from Domen.Models.AirCompany import AirCompanies
from Domen.Config.redis_client import redis_client
import json
from Database.InitializationDataBase import db


class AirCompanyService:

    @staticmethod
    def get_all():

        # cached_companies = redis_client.hgetall("airCompanies")

        # if cached_companies:
        #     return cached_companies

        companies = AirCompanies.query.all()
        print(companies)
        # redis_client.set("airCompanies", companies)

        return companies

    @staticmethod
    def get_by_id(id):
        cache_key = f"airCompany:{id}"
        cached_company = redis_client.get(cache_key)

        if cached_company:
            return json.loads(cached_company)

        company = AirCompanies.query.get(id)

        if not company:
            return None

        company_data = company.to_dict()

        redis_client.set(cache_key,json.dumps(company_data), ex=300)

        return company_data

    @staticmethod
    def get_by_name(name):

        company = AirCompanies.query.filter_by(name=name).first()

        if not company:
            return None

        company_data = company.to_dict()

        return company_data

    @staticmethod
    def update_by_id(id,name):
        airCompany = AirCompanies.query.get(id)

        if not airCompany:
            return None

        airCompany.name = name

        cache_key = f"airCompany:{id}"

        cached_company = redis_client.get(cache_key)

        if cached_company:
            redis_client.set(cache_key, json.dumps(airCompany.to_dict()), ex=300)

        db.session.commit()
        return airCompany.to_dict()

    @staticmethod
    def delete(id):
        airCompany = AirCompanies.query.get(id)
        cache_key = f"airCompany:{id}"
        if airCompany:

            redis_client.delete(cache_key)
            db.session.delete(airCompany)
            db.session.commit()
            return True
        else:
            return False

    @staticmethod
    def create(name):
        print(name)
        airCompany = AirCompanies(name=name)

        db.session.add(airCompany)
        db.session.commit()

        print(airCompany)
        return airCompany.to_dict()

