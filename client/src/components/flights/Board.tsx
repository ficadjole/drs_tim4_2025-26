import { useState, useEffect } from "react";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { Flight } from "../../models/flight/FlightDto";

interface BoardProps {
  onClose: () => void;
}

function FlightTimer({ departureTime, duration }: { departureTime: string; duration: number }) {
  const [timeLeft, setTimeLeft] = useState("");


  useEffect(() => {
    const calculate = () => {
      const startTime = new Date(departureTime).getTime();
      const endTime = startTime + duration * 60 * 1000;
      const now = new Date().getTime();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("LANDING...");
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        // Format MM:SS
        setTimeLeft(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
      }
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [departureTime, duration]);

  return (
    <div className="mt-2 flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 py-1 px-3 rounded-lg w-fit">
      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
      <span className="text-amber-400 text-[11px] font-black font-mono tracking-widest">
        ETA: {timeLeft}
      </span>
    </div>
  );
}

export default function Board({ onClose }: BoardProps) {
  const [upcoming, setUpcoming] = useState<Flight[]>([]);
  const [live, setLive] = useState<Flight[]>([]);
  const [archive, setArchive] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportTab, setReportTab] = useState("NOT_STARTED");

  const loadAllStatuses = async () => {
    try {
      const [dataNotStarted, dataInProgress, dataFinished, dataCancelled] = await Promise.all([
        flightApi.getFlightsByStatus('NOT_STARTED'),
        flightApi.getFlightsByStatus('IN_PROGRESS'),
        flightApi.getFlightsByStatus('FINISHED'),
        flightApi.getFlightsByStatus('CANCELLED')
      ]);

      setUpcoming(dataNotStarted);
      setLive(dataInProgress);
      setArchive([...dataFinished, ...dataCancelled]);
    } catch (err) {
      console.error("Board loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllStatuses();
    const interval = setInterval(loadAllStatuses, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-sky-900/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500">

      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            Live Terminal Board
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sky-300/60 text-[10px] font-bold uppercase tracking-widest">
              System Live & Synchronized
            </span>
          </div>
        </div>

        {/* REPORT PANEL - Samo za Admina */}
        {localStorage.getItem("userRole") === "ADMINISTRATOR" && (
          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/10">
            <select
              value={reportTab}
              onChange={(e) => setReportTab(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-sky-500"
            >
              <option value="NOT_STARTED">Upcoming (Not Started)</option>
              <option value="IN_PROGRESS">Live (In Progress)</option>
              <option value="FINISHED">History (Finished)</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              onClick={async () => {
                try {
                  await flightApi.generateReport(reportTab);
                  alert(`Report for ${reportTab} sent to server!`);
                } catch (err: any) {
                  alert(err.message);
                }
              }}
              className="bg-sky-500 hover:bg-sky-400 px-4 py-1.5 rounded-xl text-white text-[10px] font-black uppercase transition-all shadow-lg shadow-sky-500/20"
            >
              Send Report
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 border border-white/10 px-5 py-2 rounded-xl text-white text-[10px] font-black uppercase transition-all active:scale-95"
        >
          Close Board ×
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BoardColumn title="Upcoming" flights={upcoming} bgColor="bg-sky-500/5" borderColor="border-sky-500/20" />
        <BoardColumn title="In Flight" flights={live} bgColor="bg-amber-500/5" borderColor="border-amber-500/20" isLive />
        <BoardColumn title="Archive & Cancelled" flights={archive} bgColor="bg-white/5" borderColor="border-white/10" />
      </div>
    </div>
  );
}

function BoardColumn({ title, flights, bgColor, borderColor, isLive }: any) {
  return (
      <div className={`flex flex-col ${bgColor} border ${borderColor} rounded-3xl p-5 min-h-[400px]`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white/40 font-black uppercase text-[10px] tracking-[0.2em]">
          {title}
        </h3>
        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-white/40 font-bold">
          {flights.length}
        </span>
      </div>

      <div className="space-y-3">
        {flights.length > 0 ? flights.map((f: any) => (
          <div key={f.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition group">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sky-400 font-mono text-[11px] font-black group-hover:text-sky-300 transition">
                {f.name}
              </span>
              <span className="text-white/30 font-mono text-[10px]">
                {new Date(f.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="text-white font-bold text-sm uppercase leading-tight tracking-tight">
              {f.departureAirport} <span className="text-white/20 mx-1">→</span> {f.arrivalAirport}
            </div>

            {isLive && (
              <FlightTimer
                departureTime={f.departureTime}
                duration={f.flightDuration}
              />
            )}

            {f.cancelled && (
              <div className="mt-2 text-red-500 text-[9px] font-black uppercase tracking-tighter bg-red-500/10 w-fit px-2 py-0.5 rounded border border-red-500/20">
                Flight Cancelled
              </div>
            )}
          </div>
        )) : (
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
            <span className="text-[10px] text-white/10 uppercase font-black tracking-widest">
              No Activity
            </span>
          </div>
        )}
      </div>
    </div>
  );
}