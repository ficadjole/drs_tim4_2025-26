import axios from "axios";
import type { IFlightAPIService } from "./IFlightAPIService";
import type { Flight } from "../../models/flight/FlightDto";
import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import type { FlightUpdateDto } from "../../models/flight/FlightUpdateDto";

const API_URL = `${import.meta.env.VITE_GATEWAY_URL}gateway/flights`;

export const flightApi: IFlightAPIService = {
    async getAllFlights(): Promise<Flight[]> {
        try {
            const res = await axios.get<Flight[]>(`${API_URL}/getAll`);
            return res.data;
        } catch (error) {
            let message = "Error while fetching flights.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getAllFlightsAdmin(): Promise<Flight[]> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get<Flight[]>(`${API_URL}/admin/getAll`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (error) {
            let message = "Error while deleting flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getMyFlightsManager(): Promise<Flight[]> {
        const token = localStorage.getItem("token");

        const res = await axios.get<Flight[]>(
            `${API_URL}/manager/my`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return res.data;
    }
    ,
    async getFlightById(id: number): Promise<Flight> {
        try {
            const res = await axios.get<Flight>(`${API_URL}/${id}`);
            return res.data;
        } catch (error) {
            let message = "Error while fetching flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getFlightsByAirCompany(airCompanyId: number): Promise<Flight[]> {
        try {
            const res = await axios.get<Flight[]>(`${API_URL}/getFlight-byAirCompany/${airCompanyId}`);
            return res.data;
        } catch (error) {
            let message = "Error while fetching flights by air company.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getFlightsByStatus(status: string): Promise<Flight[]> {
        try {
            const res = await axios.get<Flight[]>(`${API_URL}/status/${status}`);
            return res.data;
        } catch (error) {
            let message = "Error while fetching flights by status.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async createFlight(data: FlightCreateDto): Promise<Flight> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post<Flight>(`${API_URL}/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while creating flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async updateFlight(id: number, data: FlightUpdateDto): Promise<Flight> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put<Flight>(`${API_URL}/update/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while updating flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async deleteFlight(id: number): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            await axios.delete<Flight>(`${API_URL}/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            let message = "Error while deleting flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async approveFlight(id: number): Promise<Flight> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put<Flight>(`${API_URL}/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (error) {
            let message = "Error while deleting flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },

    async rejectFlight(id: number, reason: string): Promise<Flight> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put<Flight>(
                `${API_URL}/reject/${id}`,
                { reason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            let message = "Error while deleting flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },

    async cancelFlight(id: number): Promise<Flight> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.put<Flight>(`${API_URL}/cancel/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (error) {
            let message = "Error while deleting flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },

    async generateReport(tabName: string): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${API_URL}/generate-report`,
                { tabName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error) {
            let message = "Error while deleting flight.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    }

};