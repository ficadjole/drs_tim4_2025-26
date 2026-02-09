import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { airCompanyApi } from "../../api_services/air-company/AirCompanyAPIService";
import AirCompanyForm from "./AirCompanyForm";

export default function EditAirCompany() {
  const { id } = useParams();
  const nav = useNavigate();

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    airCompanyApi
      .getCompanyById(Number(id))
      .then((company) => setName(company.name))
      .catch(() => setError("Failed to load airline."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!id) return;

    if (name.trim().length === 0) {
      setError("Name cannot be left empty.");
      return;
    }

    try {
      await airCompanyApi.updateCompany(Number(id), name);
      nav("/air-companies");
    } catch (err: any) {
      setError(err.message || "Failed to update airline.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <AirCompanyForm
      title={`Edit Airline #${id}`}
      name={name}
      onChange={handleChange}
      onSubmit={save}
      error={error}
    />
  );
}
