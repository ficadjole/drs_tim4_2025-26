import type { TicketCreateDto } from "../models/ticket/TicketCreateDto";

export function validateTicketCreate(data: TicketCreateDto): string[] {
    const errors: string[] = [];

    if (data.userId <= 0) {
        errors.push("You need to log in to buy a ticket.");
    }

    if (data.flightId <= 0) {
        errors.push("Choosen flight is not valid.");
    }

    if (data.ticketPrice <= 0) {
        errors.push("Ticket price must be a positive number.");
    }

    if (!data.ticketDescription || data.ticketDescription.trim().length < 5) {
        errors.push("Ticket description must be at least 5 characters.");
    }


    return errors;
}