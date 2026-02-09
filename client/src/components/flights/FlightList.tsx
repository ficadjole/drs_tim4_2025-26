import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { Flight } from "../../models/flight/FlightDto";

export default function FlightList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const role = localStorage.getItem("userRole");
  const nav = useNavigate();

  const load = async () => {
    try {
      if (role === "ADMINISTRATOR") {
        setFlights(await flightApi.getAllFlightsAdmin());
      } else if (role === "MANAGER") {
        setFlights(await flightApi.getMyFlightsManager());
      } else {
        setFlights(await flightApi.getAllFlights());
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load flights");
    }
  };

  useEffect(() => {
    load();
  }, [role]);

  const statusColor = (status?: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-400";
      case "PENDING":
        return "text-yellow-400";
      case "REJECTED":
        return "text-red-400";
      case "CANCELLED":
        return "text-gray-400";
      default:
        return "text-white/60";
    }
  };

  const hasFlightStarted = (departureTime: string) => {
    return new Date(departureTime) <= new Date();
  };

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          Flights
        </h2>

        {role === "MANAGER" && (
          <button
            onClick={() => nav("/create-flight")}
            className="rounded-xl bg-sky-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400 transition"
          >
            New Flight
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {flights.map(f => (
          <div
            key={f.id}
            className="rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-6 shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-black uppercase text-white">
                {f.name}
              </h3>

              {role !== "USER" && (
                <span className={`text-xs font-black ${statusColor(f.approvalStatus)}`}>
                  {f.approvalStatus}
                </span>
              )}
            </div>

            <div className="space-y-2 text-sm text-white/70">
              <div><b>From:</b> {f.departureAirport}</div>
              <div><b>To:</b> {f.arrivalAirport}</div>
              <div><b>Departure:</b> {new Date(f.departureTime).toLocaleString()}</div>
              <div><b>Price:</b> €{f.ticketPrice}</div>
            </div>

            {role === "MANAGER" && f.approvalStatus === "REJECTED" && f.rejectionReason && (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/20 px-4 py-3">
                <div className="text-[11px] font-black uppercase tracking-widest text-red-300 mb-1">
                  Rejection reason
                </div>
                <div className="text-sm font-semibold text-red-200">
                  {f.rejectionReason}
                </div>
              </div>
            )}


            {role === "ADMINISTRATOR" && f.approvalStatus === "PENDING" && (
              <div className="flex gap-2 mt-6">
                <button
                  onClick={async () => {
                    await flightApi.approveFlight(f.id);
                    load();
                  }}
                  className="flex-1 rounded-xl bg-green-500/20 text-green-400 py-2 text-xs font-black uppercase"
                >
                  Approve
                </button>

                <button
                  onClick={async () => {
                    const reason = prompt("Reason for rejection:");
                    if (!reason) return;
                    await flightApi.rejectFlight(f.id, reason);
                    load();
                  }}
                  className="flex-1 rounded-xl bg-red-500/20 text-red-400 py-2 text-xs font-black uppercase"
                >
                  Reject
                </button>
              </div>
            )}

            {role === "MANAGER" && f.approvalStatus === "REJECTED" && (
              <button
                onClick={() => nav(`/edit-flight/${f.id}`)}
                className="mt-6 w-full rounded-xl bg-yellow-500/20 text-yellow-400 py-2 text-xs font-black uppercase"
              >
                Edit & Resend
              </button>
            )}

            {role === "USER" && f.approvalStatus === "APPROVED" && (
              hasFlightStarted(f.departureTime) ? (
                <div className="mt-6 w-full rounded-xl bg-gray-500/20 text-gray-400 py-2 text-xs font-black uppercase text-center cursor-not-allowed">
                  Ticket sales closed
                </div>
              ) : (
                <button
                  onClick={() => nav(`/buy-ticket/${f.id}`)}
                  className="mt-6 w-full rounded-xl bg-sky-500 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400 transition"
                >
                  Buy Ticket
                </button>
              )
            )}

          </div>
        ))}
      </div>
    </div>
  );
}