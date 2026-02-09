import type { FlightCreateDto } from "../models/flight/FlightCreateDto";

export function validateFlightCreate(data: FlightCreateDto): string[] {
    const errors: string[] = [];
    const now = new Date();
    const departure = new Date(data.departureTime);

    if(!data.name || data.name.trim().length < 3) {
        errors.push("Flight name must be at least 3 characters.");
    }

    if(departure <= now) {
        errors.push("Departure time must be in future.");
    }

    if(data.departureAirport === data.arrivalAirport) {
        errors.push("Departure and arrival airport cannot be the same.");
    }

    if(data.ticketPrice <= 0) {
        errors.push("Ticket price must be a positive number.");
    }

    if(data.flightDuration <= 0) {
        errors.push("Flight duration must be a positive number.");
    }

    return errors;
}