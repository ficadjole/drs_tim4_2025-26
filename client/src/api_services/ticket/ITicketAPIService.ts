import type { TicketCreateDto } from "../../models/ticket/TicketCreateDto";
import type { Ticket } from "../../models/ticket/TicketDto";

export interface ITicketAPIService {
    createTicket(data: TicketCreateDto): Promise<Ticket>;
    getTicketByID(id: number): Promise<Ticket>;
    getTicketsByUser(userId: number): Promise<Ticket[]>;
    getTicketsByFlight(ticketId: number): Promise<Ticket[]>;
    cancelTicket(ticketId: number): Promise<void>;
    rateTicket(ticketId: number, rating: number): Promise<Ticket>;
    getAllRatings(): Promise<Ticket[]>;
    getRatingsByFlight(): Promise<{ flightId: number; avgRating: number; count: number }[]>;
}