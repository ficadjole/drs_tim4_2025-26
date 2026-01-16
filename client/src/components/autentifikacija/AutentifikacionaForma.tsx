import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { userApi } from "../../api_services/users/UserAPIService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles";

export default function AutentifikacionaForma({
  authApi,
  onLoginSuccess,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [lozinka, setLozinka] = useState("");
  const [greska, setGreska] = useState("");
  const [jeRegistracija, setJeRegistracija] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("MALE");
  const [state, setState] = useState("");
  const [streetName, setStreetName] = useState("");
  const [streetNumber, setStreetNumber] = useState("");

  const navigate = useNavigate();

  const podnesiFormu = async (e: React.FormEvent) => {
    e.preventDefault();
    setGreska("");

    try {
      const odgovor = await authApi.prijava(email, lozinka);

      if (odgovor.accessToken) {
        localStorage.setItem("token", odgovor.accessToken);

        const sviKorisnici = await userApi.getAllUsers();
        const ja = sviKorisnici.find((u: User) => u.email === email);

        if (ja && ja.id) {
          const uloga = (ja as any).role || (ja as any).userRole;

          localStorage.setItem("userRole", uloga);
          localStorage.setItem("userId", ja.id.toString());

          onLoginSuccess();

          if (uloga === UserRole.ADMINISTRATOR) {
            navigate("/users/getAll");
          } else {
            navigate("/profile");
          }
        }
      }
    } catch {
      setGreska("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-900 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">

        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-white">
          {jeRegistracija ? "Create your account" : "Sign in"}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={podnesiFormu} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-100">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-100">
              Password
            </label>
            <div className="mt-2">
              <input
                type="password"
                value={lozinka}
                placeholder="Password"
                onChange={(e) => setLozinka(e.target.value)}
                required
                className="block w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-2 focus:outline-indigo-500"
              />
            </div>
          </div>

          {jeRegistracija && (
            <>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-1/2 rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
                  required
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-1/2 rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
                  required
                />
              </div>

              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
                required
              />

              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>

              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
                required
              />

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Street"
                  value={streetName}
                  onChange={(e) => setStreetName(e.target.value)}
                  className="w-2/3 rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
                  required
                />
                <input
                  type="text"
                  placeholder="No."
                  value={streetNumber}
                  onChange={(e) => setStreetNumber(e.target.value)}
                  className="w-1/3 rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10"
                  required
                />
              </div>
            </>
          )}

          {greska && (
            <p className="text-center text-sm text-red-400">{greska}</p>
          )}

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            {jeRegistracija ? "Register" : "Sign in"}
          </button>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          {jeRegistracija ? "Already have an account?" : "Not a member?"}{" "}
          <button
            onClick={() => setJeRegistracija(!jeRegistracija)}
            className="font-semibold text-indigo-400 hover:text-indigo-300"
          >
            {jeRegistracija ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
