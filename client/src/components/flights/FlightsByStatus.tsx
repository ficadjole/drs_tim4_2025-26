import { useEffect, useState } from "react";
import type { Flight } from "../../models/flight/FlightDto";
import { flightApi } from "../../api_services/flight/FlightApiService";

// doraditi
export default function FlightsByStatus({ status }: { status: string }) {
    const [flights, setFlights] = useState<Flight[]>([]);
    useEffect(() => { flightApi.getFlightsByStatus(status).then(setFlights).catch(console.error); }, [status]);

    return (
        <div>
            <h2>Flights - {status}</h2>
            {flights.map(f => <div key={f.id}>{f.name}</div>)}
        </div>
    )
}