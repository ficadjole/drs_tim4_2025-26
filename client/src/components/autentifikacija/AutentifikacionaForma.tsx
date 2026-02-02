import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { userApi } from "../../api_services/users/UserAPIService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

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

    if (jeRegistracija) {

      const registerPodaci = { email, lozinka, firstName, lastName, dateOfBirth, gender, state, streetName, streetNumber };

      try {

        const odgovor = await authApi.register(registerPodaci.email, registerPodaci.lozinka, registerPodaci.firstName, registerPodaci.lastName, registerPodaci.dateOfBirth, registerPodaci.gender, registerPodaci.state, registerPodaci.streetName, registerPodaci.streetNumber);

        if (odgovor.accessToken) {
          localStorage.setItem("token", odgovor.accessToken);

          const sviKorisnici = await userApi.getAllUsers();
          const ja = sviKorisnici.find((u: User) => u.email === registerPodaci.email);

          if (ja && ja.id) {
            const uloga = (ja as any).role || (ja as any).userRole;
            console.log("Moja uloga sa servera je:", uloga);

            localStorage.setItem("userRole", uloga);
            localStorage.setItem("userId", ja.id.toString());

            onLoginSuccess();

            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Greška pri registraciji:", error);
        setGreska("Pogrešan email ili lozinka");
      }

    } else {

      try {
        const odgovor = await authApi.login(email, lozinka);

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
  }

  return (
  <div className="relative min-h-screen w-full flex items-center justify-end overflow-hidden bg-slate-900">
    
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: "url('/pozadina.jpg')", 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
    </div>

    <div className="relative z-10 w-full max-w-xl px-6 md:px-16 lg:mr-24">
      <div className="bg-blue-950/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
        
        <h2 className="text-3xl font-bold text-white mb-2">
          {jeRegistracija ? "Create account" : "Sign in"}
        </h2>
        <p className="text-slate-400 mb-6 text-sm italic">
          {jeRegistracija ? "Please fill in your details below." : "Enter your credentials to access your profile."}
        </p>


        <form onSubmit={podnesiFormu} className="space-y-4 max-h-[65vh] overflow-y-auto pr-4 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">Email address</label>
              <input
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">Password</label>
              <input
                type="password"
                value={lozinka}
                placeholder="Password"
                onChange={(e) => setLozinka(e.target.value)}
                required
                className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
            </div>

            {jeRegistracija && (
              <>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">First name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                    className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">Last name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                    className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">Date of birth</label>
                  <Flatpickr
                    value={dateOfBirth}
                    onChange={(dates: Date[]) => {
                      if (dates.length > 0) setDateOfBirth(dates[0].toISOString().split("T")[0]);
                    }}
                    options={{ dateFormat: "Y-m-d", maxDate: "today" }}
                    className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Select date"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    required
                    className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 flex gap-3">
                  <div className="flex-grow">
                    <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">Street</label>
                    <input
                      type="text"
                      value={streetName}
                      onChange={(e) => setStreetName(e.target.value)}
                      placeholder="Street name"
                      required
                      className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-slate-300 mb-1 ml-1 uppercase">No.</label>
                    <input
                      type="text"
                      value={streetNumber}
                      onChange={(e) => setStreetNumber(e.target.value)}
                      placeholder="12"
                      required
                      className="w-full rounded-lg bg-slate-900/50 border border-slate-700 px-4 py-2.5 text-white outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {greska && <p className="text-center text-sm text-red-400 mt-2 font-medium">{greska}</p>}

          <button
            type="submit"
            className="w-full justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
          >
            {jeRegistracija ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {jeRegistracija ? "Already have an account?" : "Not a member yet?"}{" "}
          <button
            onClick={() => setJeRegistracija(!jeRegistracija)}
            className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            {jeRegistracija ? "Sign in" : "Create an account"}
          </button>
        </p>
      </div>
    </div>

    <style>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: 5px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #6366f1;
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #818cf8;
      }
    `}</style>
  </div>
);
}
