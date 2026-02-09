import { useEffect, useState } from "react";
import type { FlightUpdateDto } from "../../models/flight/FlightUpdateDto";
import axios from "axios";

const inputClass =
  "w-full rounded-xl bg-black/30 px-4 py-2.5 text-white border border-white/10 focus:border-sky-400 outline-none";

interface AirCompany {
  id: number;
  name: string;
}

export default function FlightForm({
  dto,
  onChange,
  onSubmit,
  title
}: {
  dto: FlightUpdateDto;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
}) {
  const [companies, setCompanies] = useState<AirCompany[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_GATEWAY_URL}gateway/air_company/getAll`)
      .then(res => setCompanies(res.data));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 text-white">
      <div className="w-full max-w-3xl rounded-[3rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-10">
        <h3 className="text-2xl font-black uppercase mb-8">{title}</h3>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Flight name
            </label>
            <input
              name="name"
              value={dto.name ?? ""}
              onChange={onChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Air company
            </label>
            <select
              name="airCompanyId"
              value={dto.airCompanyId ?? ""}
              onChange={onChange}
              className={inputClass}
              required
            >
              <option value="">Select air company</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="flightDuration"
              value={dto.flightDuration ?? 0}
              onChange={onChange}
              className={inputClass}
              min={1}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Flight distance (km)
            </label>
            <input
              type="number"
              name="currentFlightDuration"
              value={dto.currentFlightDuration ?? 0}
              onChange={onChange}
              placeholder="Current duration"
              className={inputClass}
              min={0}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Departure time
            </label>
            <input
              type="datetime-local"
              name="departureTime"
              value={dto.departureTime ?? ""}
              onChange={onChange}
              className={inputClass}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Departure airport
            </label>
            <input
              name="departureAirport"
              value={dto.departureAirport ?? ""}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Arrival airport
            </label>
            <input
              name="arrivalAirport"
              value={dto.arrivalAirport ?? ""}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
              Ticket price
            </label>
            <div className="relative">
              <input
                type="number"
                name="ticketPrice"
                value={dto.ticketPrice ?? 0}
                onChange={onChange}
                placeholder="Ticket price"
                className={inputClass}
                min={0}
              />
              <span className="absolute right-4 top-3 text-white/60">€</span>
            </div>
          </div>

          <div className="md:col-span-2 mt-6">
            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-500 py-4 font-black uppercase hover:bg-sky-400"
            >
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
