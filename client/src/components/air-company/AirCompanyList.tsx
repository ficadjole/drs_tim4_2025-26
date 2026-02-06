import { useEffect, useState } from "react";
import type { AirCompany } from "../../models/air-company/AirCompanyDto";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";
import { useNavigate } from "react-router-dom";

export default function AirCompanyList() {
    const [companies, setCompanies] = useState<AirCompany[]>([]);
    const nav = useNavigate();

    const load = () => airCompanyApi.getAllCompanies().then(setCompanies).catch(console.error);

    useEffect(() => {
        load();
    }, []);

    const remove = (id: number) => {
        if (!confirm("Delete airline?")) return;
        airCompanyApi.deleteCompany(id).then(load);
    };

    return (
        <div>
            <h2>Air Companies</h2>
            <button  onClick={() => nav("/create-airline")}>Create new</button>
            <table cellPadding={6} border={1}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.name}</td>
                            <td>
                                <button onClick={() => nav(`/edit-airline/${c.id}`)}>Edit</button>
                                <button onClick={() => remove(c.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}