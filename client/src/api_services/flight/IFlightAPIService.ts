import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import type { Flight } from "../../models/flight/FlightDto";

export interface IFlightAPIService {
    getAllFlights(): Promise<Flight[]>;
    getAllFlightsAdmin(): Promise<Flight[]>;
    getMyFlightsManager(): Promise<Flight[]>;
    getFlightById(id: number): Promise<Flight>;
    getFlightsByAirCompany(airCompanyId: number): Promise<Flight[]>;
    getFlightsByStatus(status: string): Promise<Flight[]>;
    createFlight(data: FlightCreateDto): Promise<Flight>;
    updateFlight(id: number, data: Partial<Flight>): Promise<Flight>;
    deleteFlight(id: number): Promise<void>;
    approveFlight(id: number): Promise<Flight>;
    rejectFlight(id: number, reason: string): Promise<Flight>;
    cancelFlight(id: number): Promise<Flight>;
    generateReport(tabName: string, email: string): Promise<void>;
}