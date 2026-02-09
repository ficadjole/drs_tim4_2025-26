import { useEffect, useState } from "react";
import type { Ticket } from "../../models/ticket/TicketDto";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { Flight } from "../../models/flight/FlightDto";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [flightMap, setFlightMap] = useState<Record<number, string>>({}); 
  const userId = Number(localStorage.getItem("userId"));

  const loadData = async () => {
    if (!userId) return;
    try {
        const [ticketsData, flightsData] = await Promise.all([
        ticketsApi.getTicketsByUser(userId),
        flightApi.getAllFlights()
        ]);


        const actualFlights = Array.isArray(flightsData) ? flightsData : (flightsData as any).data || [];

        const map: Record<number, string> = {};
        actualFlights.forEach((f: Flight) => {
        const from = f.departureAirport || "Unknown";
        const to = f.arrivalAirport || "Unknown";
        map[Number(f.id)] = `${from} → ${to}`;
        });
        
        setFlightMap(map);
        setTickets(ticketsData);
    } catch (err) {
        console.error("Greška u loadData:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const remove = (id: number) => {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    ticketsApi.cancelTicket(id).then(loadData);
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          My Tickets
        </h2>
      </div>

      <div className="rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-xl">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-sky-400">Flight</th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-sky-400">Price</th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-sky-400">Date</th>
              <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-sky-400">Status</th>
              <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-sky-400">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-20 text-white/40 italic">
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white uppercase tracking-tight">
                      {flightMap[t.flightId] || `Flight #${t.flightId}`}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm font-medium text-white/80">
                    €{t.ticketPrice}
                  </td>

                  <td className="px-6 py-4 text-sm text-white/60">
                    {new Date(t.ticketDate).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {t.cancelled ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                        Cancelled
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Valid
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {!t.cancelled && (
                      <button
                        onClick={() => remove(t.id)}
                        className="rounded-lg bg-red-500/10 px-4 py-2 text-[10px] font-black uppercase text-red-400 hover:bg-red-500 hover:text-white transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}