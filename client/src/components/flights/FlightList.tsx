import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";
import type { Flight } from "../../models/flight/FlightDto";
import Board from "./Board";
import { socket } from "../../web-socket/Socket";

export default function FlightList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [purchasedFlightIds, setPurchasedFlightIds] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [isBoardOpen, setIsBoardOpen] = useState(false);

  const [ratingMap, setRatingMap] = useState<
    Record<number, { avg: number; count: number }>
  >({});


  const role = localStorage.getItem("userRole");
  const userId = Number(localStorage.getItem("userId"));
  const nav = useNavigate();

  const load = async () => {
    try {
      const [allCompanies, ratings] = await Promise.all([airCompanyApi.getAllCompanies(), ticketsApi.getAllRatings()]);
      setCompanies(allCompanies);

      let data: Flight[] = [];
      if (role === "ADMINISTRATOR") data = await flightApi.getAllFlightsAdmin();
      else if (role === "MANAGER") data = await flightApi.getMyFlightsManager();
      else data = await flightApi.getAllFlights();

      setFlights(data);

      if (role === "USER" && userId) {
        const myTickets = await ticketsApi.getTicketsByUser(userId);
        setPurchasedFlightIds(myTickets.filter(t => !t.cancelled).map(t => t.flightId));
      }

      const map: Record<number, { sum: number; count: number }> = {};

      ratings.forEach((t: any) => {
        if (t.rating != null) {
          if (!map[t.flightId]) {
            map[t.flightId] = { sum: 0, count: 0 };
          }
          map[t.flightId].sum += t.rating;
          map[t.flightId].count += 1;
        }
      });

      const finalMap: Record<number, { avg: number; count: number }> = {};
      Object.keys(map).forEach(fid => {
        finalMap[Number(fid)] = {
          avg: Number((map[Number(fid)].sum / map[Number(fid)].count).toFixed(1)),
          count: map[Number(fid)].count
        };
      });

      setRatingMap(finalMap);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { load(); }, [role]);

  useEffect(() => {
    if (role !== "ADMINISTRATOR") return;

    // kad se socket konektuje
    socket.on("connect", () => {
      socket.emit("join_admin");
    });

    // kad flight servis javi novi let
    socket.on("flight_created", (flight: Flight) => {
      if (role !== "ADMINISTRATOR") return;

      setFlights(prev => {
        const exists = prev.some(f => f.id === flight.id);
        if (exists) return prev;

        return [
          { ...flight, approvalStatus: "PENDING" },
          ...prev
        ];
      });
    });


    return () => {
      socket.off("connect");
      socket.off("flight_created");
    };
  }, [role]);


  const handleBuy = async (f: Flight) => {
    if (!userId) { alert("Please log in."); return; }
    if (!window.confirm(`Buy ticket for ${f.name}?`)) return;
    try {
      await ticketsApi.createTicket({
        userId: userId, flightId: f.id,
        ticketDescription: `Ticket for ${f.name}`, ticketPrice: f.ticketPrice,
      });
      alert("Success!"); load();
    } catch { alert("Failed to buy."); }
  };

  const statusColor = (status?: string) => {
    switch (status) {
      case "APPROVED": return "text-green-400";
      case "PENDING": return "text-yellow-400";
      case "REJECTED": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const filteredFlights = flights.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.departureAirport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.arrivalAirport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = selectedCompanyId === "" || f.airCompanyId === Number(selectedCompanyId);
    return matchesSearch && matchesCompany;
  });

  const filterInputStyle = "bg-black/40 border border-white/20 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-sky-500 transition-all backdrop-blur-md placeholder:text-white/30";

  const renderRatingBadge = (flightId: number) => {
    const r = ratingMap[flightId];
    if (!r || r.count === 0) return null;

    return (
      <span className="flex items-center gap-1 text-[11px] font-black text-yellow-400">
        <span>★</span>
        <span>{r.avg}</span>
        <span className="text-white/40 font-bold">
          ({r.count})
        </span>
      </span>
    );
  };


  return (
    <div className="min-h-screen px-6 py-12">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-4xl font-black uppercase text-white tracking-tighter">Flights</h2>
          <button
            onClick={() => setIsBoardOpen(!isBoardOpen)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border ${isBoardOpen ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-500 border-amber-500/40'
              }`}
          >
            {isBoardOpen ? '✕ Close Board' : '● Open Live Board'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <input
            type="text" placeholder="Search destination..." className={filterInputStyle + " w-full md:w-64"}
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className={filterInputStyle} value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <option value="">All Airlines</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>

          {role === "MANAGER" && (
            <button onClick={() => nav("/create-flight")} className="rounded-xl bg-sky-500 px-6 py-3 text-xs font-black uppercase text-white hover:bg-sky-400 transition shadow-lg shadow-sky-500/20">
              New Flight
            </button>
          )}
        </div>
      </div>

      {isBoardOpen && (
        <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
          <Board onClose={() => setIsBoardOpen(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFlights.map(f => {
          const isBought = purchasedFlightIds.includes(f.id);
          const hasStarted = new Date(f.departureTime) <= new Date();

          return (
            <div key={f.id} className="rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-6 shadow-xl flex flex-col justify-between transition hover:border-white/20 hover:bg-black/30">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-black uppercase text-white">
                        {f.name}
                      </h3>
                      {renderRatingBadge(f.id)}
                    </div>

                    <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">
                      {companies.find(c => c.id === f.airCompanyId)?.name || "Airline"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {f.cancelled ? (
                      <span className="text-xs font-black text-red-400/60 text-[10px] uppercase tracking-widest bg-red-500/5 px-2 py-1 rounded-lg">CANCELLED</span>
                    ) : role !== "USER" && (
                      <span className={`text-[10px] font-black uppercase ${statusColor(f.approvalStatus)}`}>
                        {f.approvalStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between"><b>From:</b> <span>{f.departureAirport}</span></div>
                  <div className="flex justify-between"><b>To:</b> <span>{f.arrivalAirport}</span></div>
                  <div className="flex justify-between text-[11px]"><b>Departure:</b> <span>{new Date(f.departureTime).toLocaleString()}</span></div>
                  <div className="flex justify-between text-sky-400"><b>Price:</b> <span className="font-black">€{f.ticketPrice}</span></div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                {role === "MANAGER" && f.approvalStatus === "REJECTED" && (
                  <div className="mt-6 space-y-2">
                    <div className="mb-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-[11px] text-red-200 italic">
                      <b>Reason:</b> {f.rejectionReason}
                    </div>
                    <button
                      onClick={() => nav(`/edit-flight/${f.id}`)}
                      className="w-full rounded-xl bg-sky-500 py-2 text-xs font-black uppercase text-white hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
                    >
                      Edit & Resend
                    </button>
                  </div>
                )}

                {role === "ADMINISTRATOR" && (
                  <div className="flex flex-col gap-2">
                    {f.approvalStatus === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={async () => { await flightApi.approveFlight(f.id); load(); }} className="flex-1 rounded-xl bg-green-500/20 text-green-400 py-2 text-xs font-black uppercase hover:bg-green-500/30 transition">Approve</button>
                        <button onClick={async () => { const r = prompt("Reason?"); if (r) { await flightApi.rejectFlight(f.id, r); load(); } }} className="flex-1 rounded-xl bg-red-500/20 text-red-400 py-2 text-xs font-black uppercase hover:bg-red-500/30 transition">Reject</button>
                      </div>
                    )}
                    {f.approvalStatus === "APPROVED" && !f.cancelled && !hasStarted && (
                      <button
                        onClick={async () => {
                          if (!confirm("Are you sure you want to cancel this flight?")) return;
                          await flightApi.cancelFlight(f.id);
                          load();
                        }}
                        className="w-full rounded-xl bg-orange-500/20 text-orange-400 py-2 text-xs font-black uppercase hover:bg-orange-500/30 transition border border-orange-500/30"
                      >
                        Cancel flight
                      </button>
                    )}
                  </div>
                )}

                {role === "USER" && f.approvalStatus === "APPROVED" && !f.cancelled && (
                  hasStarted ? (
                    <div className="w-full rounded-xl bg-white/5 text-white/20 py-2 text-xs font-black uppercase text-center border border-white/5">Closed</div>
                  ) : isBought ? (
                    <button onClick={() => nav("/my-tickets")} className="w-full rounded-xl bg-emerald-500/20 border border-emerald-500/30 py-2 text-xs font-black uppercase text-emerald-400">✓ Purchased</button>
                  ) : (
                    <button onClick={() => handleBuy(f)} className="w-full rounded-xl bg-sky-500 py-2 text-xs font-black uppercase text-white hover:bg-sky-400 transition shadow-lg shadow-sky-500/20">Buy Ticket</button>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}