import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { FlightUpdateDto } from "../../models/flight/FlightUpdateDto";
import { flightApi } from "../../api_services/flight/FlightApiService";

export default function EditFlight() {
    const { id } = useParams();
    const nav = useNavigate();
    const [dto, setDto] = useState<FlightUpdateDto>({});

    useEffect(() => {
        if (!id) return;
        flightApi.getFlightById(Number(id)).then(f => setDto(f)).catch(console.error);
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDto({ ...dto, [name]: name.includes("Duration") || name === "ticketPrice" || name === "airCompanyId" ? Number(value) : value });
    };

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        flightApi.updateFlight(Number(id), dto).then(() => nav("/flights"));
    };

    return (
        <div>
            <h2>Edit Flight {id}</h2>
            <form onSubmit={save}>
                {Object.keys(dto).map(k => (
                    <div key={k}>
                        <label>{k}</label>
                        <input name={k} value={dto[k as keyof FlightUpdateDto] ?? ""} onChange={handleChange}/>
                    </div>
                ))}
                <button type="submit">Update</button>
                <button type="button" onClick={() => nav(-1)}>Cancel</button>
            </form>
        </div>
    );
}