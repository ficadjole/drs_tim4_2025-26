import React, { useState } from "react";
import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import { flightApi } from "../../api_services/flight/FlightApiService";
import { useNavigate } from "react-router-dom";

const empty: FlightCreateDto = {
    name: "",
    airCompanyId: 0,
    flightDuration: 0,
    currentFlightDuration: 0,
    departureTime: "",
    departureAirport: "",
    arrivalAirport: "",
    ticketPrice: 0,
    createdBy: Number(localStorage.getItem("userId") || 0)
};

export default function CreateFlight() {
    const nav = useNavigate();
    const [dto, setDto] = useState<FlightCreateDto>(empty);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setDto({...dto, [name]: name.includes("Duration") || name === "ticketPrice" || name === "airCompanyId" ? Number(value) : value});
    }

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        flightApi.createFlight(dto).then(() => nav("/flights"));
    };

    return (
        <div>
            <h2>Create Flight</h2>
            <form onSubmit={save}>
                {Object.keys(empty).map(k => (
                    <div key={k}>
                        <label>{k}</label>
                        <input name={k} value={dto[k as keyof FlightCreateDto]} onChange={handleChange} required/>
                    </div>
                ))}
                <button type="submit">Save</button>
                <button type="button" onClick={() => nav(-1)}>Cancel</button>
            </form>
        </div>
    );
}