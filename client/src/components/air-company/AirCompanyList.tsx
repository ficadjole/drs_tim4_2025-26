import { useEffect, useState } from "react";
import type { AirCompany } from "../../models/air-company/AirCompanyDto";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";
import { useNavigate } from "react-router-dom";

export default function AirCompanyList() {
    const [companies, setCompanies] = useState<AirCompany[]>([]);
    const role = localStorage.getItem("userRole");
    const nav = useNavigate();

    const load = () => airCompanyApi.getAllCompanies().then(setCompanies).catch(console.error);

    useEffect(() => {
        load();
    }, []);

    const remove = (id: number) => {
        if (!confirm("Are you sure you want to delete this airline?")) return;
        airCompanyApi.deleteCompany(id).then(load);
    };

    return (
        <div className="min-h-screen px-6 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">
                    Air Companies
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {companies.map(c => (
                    <div
                        key={c.id}
                        className="rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-8 shadow-xl flex flex-col justify-between hover:border-white/20 transition-all group"
                    >
                        <div>
                            <div className="text-xs font-bold text-sky-400 mb-2 uppercase tracking-widest">Airline ID: #{c.id}</div>
                            <h3 className="text-xl font-black uppercase text-white mb-6 group-hover:text-sky-400 transition-colors">
                                {c.name}
                            </h3>
                        </div>

                        {role !== "USER" && (
                            <div className="flex gap-3">
                            <button
                                onClick={() => nav(`/edit-airline/${c.id}`)}
                                className="flex-1 rounded-xl bg-white/5 text-white py-3 text-xs font-black uppercase hover:bg-white/10 transition"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => remove(c.id)}
                                className="flex-1 rounded-xl bg-red-500/10 text-red-400 py-3 text-xs font-black uppercase hover:bg-red-500/20 transition"
                            >
                                Delete
                            </button>
                        </div>
                        )}
                        
                    </div>
                ))}
            </div>
            
            {companies.length === 0 && (
                <div className="text-center py-20 text-white/40 italic">
                    No airlines found. Create your first one!
                </div>
            )}
        </div>
    );
}