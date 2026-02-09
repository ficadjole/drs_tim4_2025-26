import { useState } from "react";
import type { AuthFormProps } from "../../types/props/auth_form_props/AuthFormProps";
import { userApi } from "../../api_services/users/UserAPIService";
import { useNavigate } from "react-router-dom";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { validateUserCreate } from "../../helpers/UserValidation";
import type { UserCreateDto } from "../../models/users/UserCreateDto";

export default function AutentifikacionaForma({ authApi, onLoginSuccess }: AuthFormProps) {
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
      const registerPodaci: UserCreateDto = { 
        email, password: lozinka, firstName, lastName, 
        dateOfBirth, gender, state, streetName, streetNumber,
        accountBalance: 0 
      };

      const validationErrors = validateUserCreate(registerPodaci);
      if (validationErrors.length > 0) {
        setGreska(validationErrors[0]);
        return;
      }

      try {
        const odgovor = await authApi.register(
            registerPodaci.email, registerPodaci.password, registerPodaci.firstName, 
            registerPodaci.lastName, registerPodaci.dateOfBirth, registerPodaci.gender, 
            registerPodaci.state, registerPodaci.streetName, registerPodaci.streetNumber
        );

        if (odgovor.accessToken) {
          localStorage.setItem("token", odgovor.accessToken);
          const sviKorisnici = await userApi.getAllUsers();
          const ja = sviKorisnici.find((u: User) => u.email === registerPodaci.email);

          if (ja && ja.id) {
            const uloga = (ja as any).role || (ja as any).userRole;
            localStorage.setItem("userRole", uloga);
            localStorage.setItem("userId", ja.id.toString());
            onLoginSuccess();
            navigate("/profile");
          }
        }
      } catch (error) {
        console.error("Greška pri registraciji:", error);
        setGreska("Greška pri kreiranju naloga.");
      }
    } else {
      if(!email.includes("@")) { setGreska("Invalid email address."); return; }
      if(lozinka.length < 1) { setGreska("Password required."); return; }
      
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
      } catch { setGreska("Invalid email or password"); }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img 
          src="/pozadina.png" 
          alt="Aviation background" 
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

     <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md flex flex-col h-full max-h-[90vh]">
          
          <div className="mb-8">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
              {jeRegistracija ? "Register" : "Sign In"}
            </h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
              Skyline Systems
            </p>
          </div>

          <form onSubmit={podnesiFormu} className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
            
            <div className="space-y-4">
              {/* Email & Password - Uvek tu */}
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-sky-600 ml-1 transition-colors group-focus-within:text-sky-400">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full border-b-2 border-slate-100 focus:border-sky-500 py-2 px-1 outline-none transition-all text-slate-800"
                  required
                />
              </div>

              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-sky-600 ml-1">Password</label>
                <input
                  type="password"
                  value={lozinka}
                  onChange={(e) => setLozinka(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b-2 border-slate-100 focus:border-sky-500 py-2 px-1 outline-none transition-all text-slate-800"
                  required
                />
              </div>

              {jeRegistracija && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">First Name</label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Last Name</label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none" required />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Date of Birth</label>
                    <Flatpickr
                      value={dateOfBirth}
                      onChange={(dates) => dates.length > 0 && setDateOfBirth(dates[0].toISOString().split("T")[0])}
                      className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none bg-transparent"
                      placeholder="YYYY-MM-DD"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value)} className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none bg-white">
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">State</label>
                      <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Street Name</label>
                      <input type="text" value={streetName} onChange={(e) => setStreetName(e.target.value)} className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">No.</label>
                      <input type="text" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} className="w-full border-b border-slate-200 focus:border-sky-500 py-2 outline-none" required />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {greska && (
              <p className="bg-red-50 text-red-500 text-[11px] font-bold p-3 rounded-lg border border-red-100 italic">
                {greska}
              </p>
            )}


            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-xl shadow-sky-200 transition-all active:scale-95"
            >
              {jeRegistracija ? "Create Account" : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
            {jeRegistracija ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setJeRegistracija(!jeRegistracija)}
              className="text-sky-600 hover:text-sky-800 underline underline-offset-4 ml-1"
            >
              {jeRegistracija ? "Sign In" : "Register"}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }
      `}</style>
    </div>
  );
}