import axios from "axios";
import type { AirCompanyCreateDto } from "../../models/air-company/AirCompanyCreateDto";
import type { AirCompany } from "../../models/air-company/AirCompanyDto";
import type { IAirCompanyAPIService } from "./IAirCompanyAPIService";

const API_URL = `${import.meta.env.VITE_GATEWAY_URL}gateway/air_company`;

export const airCompanyApi: IAirCompanyAPIService = {
    async getAllCompanies(): Promise<AirCompany[]> {
        try {
            const res = await axios.get<AirCompany[]>(`${API_URL}/getAll`);
            return res.data;
        } catch (error) {
            let message = "Error while fetching companies.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getCompanyById(id: number): Promise<AirCompany> {
        try {
            const res = await axios.get<AirCompany>(`${API_URL}/${id}`);
            return res.data;
        } catch (error) {
            let message = "Error while fetching company.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async createCompany(dto: AirCompanyCreateDto): Promise<AirCompany> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post<AirCompany>(`${API_URL}/create`, dto, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while creating company.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async updateCompany(id: number, name: string): Promise<AirCompany> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put<AirCompany>(`${API_URL}/${id}`, { name }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while updating company.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async deleteCompany(id: number): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            await axios.delete<AirCompany>(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            let message = "Error while deleting company.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    }
}