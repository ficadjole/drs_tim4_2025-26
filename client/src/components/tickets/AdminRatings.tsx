import { useEffect, useState } from "react";
import { ticketsApi } from "../../api_services/ticket/TicketAPIService";
import { flightApi } from "../../api_services/flight/FlightApiService";
import type { Ticket } from "../../models/ticket/TicketDto";
import type { Flight } from "../../models/flight/FlightDto";
import { userApi } from "../../api_services/users/UserAPIService";

export default function AdminRatings() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [flightMap, setFlightMap] = useState<Record<number, string>>({});
    const [userMap, setUserMap] = useState<Record<number, string>>({});

    const load = async () => {
        try {
            const [ratings, flights, users] = await Promise.all([
                ticketsApi.getAllRatings(),
                flightApi.getAllFlights(),
                userApi.getAllUsers()
            ]);

            const map: Record<number, string> = {};
            flights.forEach((f: Flight) => {
                map[f.id] = `${f.departureAirport} → ${f.arrivalAirport}`;
            });

            const uMap: Record<number, string> = {};
            users.forEach((u: any) => {
                uMap[u.id] = `${u.firstName} ${u.lastName}`;
            });

            setUserMap(uMap);

            setFlightMap(map);
            setTickets(ratings.filter(t => t.rating != null));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="min-h-screen px-6 py-12">
            <h2 className="text-3xl font-black uppercase text-white mb-8">
                User Ratings
            </h2>

            <div className="rounded-[2.5rem] bg-black/20 border border-white/10 overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-white/5 border-b border-white/10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase text-sky-400">
                                User ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-black uppercase text-sky-400">
                                Flight
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-black uppercase text-sky-400">
                                Rating
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-white/5">
                        {tickets.map(t => (
                            <tr key={t.id} className="hover:bg-white/5">
                                <td className="px-6 py-4 text-white/80">
                                    {userMap[t.userId] || `User #${t.userId}`}
                                </td>

                                <td className="px-6 py-4 text-white">
                                    {flightMap[t.flightId] || `Flight #${t.flightId}`}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {[1, 2, 3, 4, 5].map(n => (
                                        <span
                                            key={n}
                                            className={n <= (t.rating ?? 0)
                                                ? "text-yellow-400"
                                                : "text-white/20"}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
