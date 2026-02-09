import axios from "axios";
import type { TicketCreateDto } from "../../models/ticket/TicketCreateDto";
import type { Ticket } from "../../models/ticket/TicketDto";
import type { ITicketAPIService } from "./ITicketAPIService";

const API_URL = `${import.meta.env.VITE_GATEWAY_URL}gateway/tickets`;

export const ticketsApi: ITicketAPIService = {
    async createTicket(data: TicketCreateDto): Promise<Ticket> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post<Ticket>(`${API_URL}/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while creating ticket.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getTicketByID(id: number): Promise<Ticket> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get<Ticket>(`${API_URL}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            return res.data;
        } catch (error) {
            let message = "Error while fetching ticket.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getTicketsByUser(userId: number): Promise<Ticket[]> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get<Ticket[]>(`${API_URL}/user-tickets/${userId}`, {
                 headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while fetching user tickets.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async getTicketsByFlight(ticketId: number): Promise<Ticket[]> {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get<Ticket[]>(`${API_URL}/flights-tickets/${ticketId}`, {
                 headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        } catch (error) {
            let message = "Error while fecthing flight tickets.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    },
    async cancelTicket(ticketId: number): Promise<void> {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/cancel/${ticketId}`, undefined, { 
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            let message = "Error while cancelling ticket.";
            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message || message;
            }
            throw new Error(message);
        }
    }
}