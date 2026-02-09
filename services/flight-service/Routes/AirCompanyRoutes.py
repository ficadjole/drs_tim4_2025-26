from cmath import isnan

from flask import Blueprint,request,jsonify
from Services.AirCompanyService import AirCompanyService
from Database.InitializationDataBase import db
from DTO.AirCompanyDTO import AirCompanyDTO
from DTO.AirCompanyCreateDTO import AirCompanyCreateDTO

companies_bp = Blueprint("companies",__name__, url_prefix='/api/companies')

@companies_bp.route('/getAll', methods=['GET'])
def get_all_companies():
    try:
        companies = AirCompanyService.get_all()
        return jsonify(companies), 200
    except Exception as e:
        return jsonify({'error': str(e)}),500

@companies_bp.route('/<int:air_company_id>', methods=['GET'])
def get_company(air_company_id):
    try:
        company = AirCompanyService.get_by_id(air_company_id)

        if not company:
            return jsonify({"error": f'Company not found {air_company_id}'}), 404


        return jsonify(company), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companies_bp.route('/create', methods=['POST'])
def create_company():
    try:
        
        json_data = AirCompanyCreateDTO(request.json)

        errors = AirCompanyCreateDTO.is_valid(json_data)

        if errors:
            return jsonify({"message": "Validation failed", "errors": errors}), 400
        
        company = AirCompanyService.create(json_data.name)
        return jsonify(company), 201
    except Exception as e:
        return jsonify({'error': str(e)}) , 500

@companies_bp.route('/<int:aircompany_id>', methods=['PUT'])
def update_company(aircompany_id):
    try:
        data = request.json
        name = data.get('name')

        if not name or name.strip() == "":
            return jsonify({'error': "Name is required for update"}), 400

        if aircompany_id!=0 :
            company = AirCompanyService.update_by_id(aircompany_id, name)
            return jsonify(company), 200
        else:
            return jsonify({'error': "Passed aircompany_id is not a number"}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@companies_bp.route('/<int:aircompany_id>', methods=['DELETE'])
def delete_company(aircompany_id):
    try:

        success = AirCompanyService.delete(aircompany_id)
        if success:
            return jsonify({"message": "Air Company successfully deleted"}), 200
        else:
            return jsonify({"error": "Air Company  not found"}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
