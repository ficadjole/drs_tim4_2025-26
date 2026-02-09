import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";
import AirCompanyForm from "./AirCompanyForm";

export default function CreateAirCompany() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    
    if (name.trim().length === 0) {
      setError("Name cannot be left empty.");
      return;
    }

    try {
      await airCompanyApi.createCompany({ name });
      nav("/air-companies");
    } catch (err) {
      setError("Failed to save. Name might be taken.");
    }
  };

  return (
    <AirCompanyForm
      title="Create Airline"
      name={name}
      onChange={handleChange}
      onSubmit={save}
      error={error}
    />
  );
}