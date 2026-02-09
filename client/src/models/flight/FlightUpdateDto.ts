export interface FlightUpdateDto {
    name?: string;
    airCompanyId?: number;
    flightDuration?: number;
    currentFlightDuration?: number;
    departureTime?: string;
    departureAirport?: string;
    arrivalAirport?: string;
    ticketPrice?: number;
}