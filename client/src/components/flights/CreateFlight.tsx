import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { FlightCreateDto } from "../../models/flight/FlightCreateDto";
import FlightForm from "./FlightForm";

const empty: FlightCreateDto = {
  name: "",
  airCompanyId: 0,
  flightDuration: 0,
  currentFlightDuration: 0,
  departureTime: "",
  departureAirport: "",
  arrivalAirport: "",
  ticketPrice: 0,
};

export default function CreateFlight() {
  const [dto, setDto] = useState<FlightCreateDto>(empty);
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setDto({ ...dto, [name]: value });
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...dto,
      airCompanyId: Number(dto.airCompanyId),
      flightDuration: Number(dto.flightDuration),
      currentFlightDuration: Number(dto.currentFlightDuration),
      ticketPrice: Number(dto.ticketPrice),
    };

    try {
      await flightApi.createFlight(payload);
      nav("/flights");
    } catch (error) {
      console.error("Greška pri kreiranju:", error);

    }
  };

  return (
    <FlightForm
      title="Create Flight"
      dto={dto}
      onChange={handleChange}
      onSubmit={save}
    />
  );
}