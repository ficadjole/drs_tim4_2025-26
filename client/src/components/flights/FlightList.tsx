import { useEffect, useState } from "react";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { Flight } from "../../models/flight/FlightDto";
import { useNavigate } from "react-router-dom";

export default function FlightList() {
    const [flights, setFlights] = useState<Flight[]>([]);
    const nav = useNavigate();

    const load = () => flightApi.getAllFlights().then(setFlights).catch(console.error);


    useEffect(() => {
        load();
    }, []);

    const remove = (id: number) => {
        if (!confirm("Delete flight?")) return;
        flightApi.deleteFlight(id).then(load);
    }

    return (
        <div>
            <h2>Flights</h2>
            <button onClick={() => nav("/create-flight")}>Create new</button>
            <table cellPadding={6} border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Company</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Departure</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {flights.map(f => (
                        <tr key={f.id}>
                            <td>{f.id}</td>
                            <td>{f.name}</td>
                            <td>{f.airCompanyId}</td>
                            <td>{f.departureAirport}</td>
                            <td>{f.arrivalAirport}</td>
                            <td>{new Date(f.departureTime).toLocaleString()}</td>
                            <td>{f.ticketPrice}</td>
                            <td>{f.status}</td>
                            <td>
                                <button onClick={() => nav(`/edit-flight/${f.id}`)}>Edit</button>
                                <button onClick={() => remove(f.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    );
}