import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between bg-white/5 backdrop-blur-2xl px-12 py-5 border-b border-white/5">
      <div className="flex items-center gap-12">
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-black tracking-tighter uppercase text-white hover:opacity-80 transition-opacity"
        >
          Skyline<span className="text-sky-500">.</span>
        </span>

        <div className="flex items-center gap-6">
          <NavLink label="Flights" onClick={() => navigate("/flights")} active={location.pathname === "/flights"}/>
          <NavLink label="Airlines" onClick={() => navigate("/air-companies")} active={location.pathname === "/air-companies"}/>
          {role === "USER" && <NavLink label="My Tickets" onClick={() => navigate("/my-tickets")} active={location.pathname === "/my-tickets"}/>}
          {role === "ADMINISTRATOR" && <NavLink label="Users" onClick={() => navigate("/users/getAll")} active={location.pathname === "/users/getAll"}/>}
          {role === "ADMINISTRATOR" && <NavLink label="Ratings" onClick={() => navigate("admin/ratings")} active={location.pathname === "/admin/ratings"}/>}
          {role === "ADMINISTRATOR" && <NavLink label="New Airline" onClick={() => navigate("/create-airline")} active={location.pathname === "/air_company/create"}/>}
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/profile")}
          className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="bg-white text-black px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-sky-500 hover:text-white transition-all active:scale-95"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const NavLink = ({ label, onClick, active = false }: any) => (
  <button
    onClick={onClick}
    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all
      ${active
        ? "text-sky-400 bg-sky-400/10 px-4 py-2 rounded-full"
        : "text-white/50 hover:text-sky-400"}
    `}
  >
    {label}
  </button>
);
