import { useState } from "react";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";
import { useNavigate } from "react-router-dom";

export default function CreateAirCompany() {
    const nav = useNavigate();
    const [name, setName] = useState("");

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        airCompanyApi.createCompany({ name }).then(() => nav("/air-companies")); 
    };

    return (
        <div>
            <h2>Create Airline</h2>
            <form onSubmit={save}>
                <label>Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required/>
                <button type="submit">Save</button>
                <button type="button" onClick={() => nav(-1)}>Cancel</button>
            </form>
        </div>
    );
}