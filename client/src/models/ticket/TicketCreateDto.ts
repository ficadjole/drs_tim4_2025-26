export interface TicketCreateDto {
    userId: number;
    flightId: number;
    ticketDescription: string;
    ticketPrice: number;
}