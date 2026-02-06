import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";

export default function EditAirCompany() {
    const { id } = useParams();
    const nav = useNavigate();
    const [name, setName] = useState("");

    useEffect(() => {
        if (!id) return;
        airCompanyApi.getCompanyById(Number(id)).then(c => setName(c.name)).catch(console.error);
    }, [id]);

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        airCompanyApi.updateCompany(Number(id), name).then(() => nav("/air-companies"));
    };

    return(
        <div>
            <h2>Edit Airline #{id}</h2>
            <form onSubmit={save}>
                <label>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required/>
                <button type="submit">Update</button>
                <button type="button" onClick={() => nav(-1)}>Cancel</button>
            </form>
        </div>
    );
}