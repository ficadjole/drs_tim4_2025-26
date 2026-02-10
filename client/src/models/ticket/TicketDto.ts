export interface Ticket {
    id: number;
    userId: number;
    flightId: number;
    ticketPrice: number;
    cancelled: boolean;
    ticketDescription: string;
    ticketDate: string;
    rating?: number | null;
}