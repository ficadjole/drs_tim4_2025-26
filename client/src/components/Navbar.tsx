import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-[100] flex items-center justify-between bg-[#0f172a]/80 backdrop-blur-xl px-8 py-4 text-white border-b border-white/10 shadow-lg">

      <div className="flex items-center gap-8">
        <span
          onClick={() => navigate("/")}
          className="cursor-pointer text-xl font-black tracking-tighter italic uppercase text-white hover:text-blue-400 transition-colors"
        >
          My<span className="text-blue-500">Application</span>
        </span>

        <div className="flex items-center gap-2">
          {role === "ADMINISTRATOR" && (
            <button
              onClick={() => navigate("/users/getAll")}
              className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              User List
            </button>
          )}

          <button
            onClick={() => navigate(`/profile`)}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            My Profile
          </button>

          <button 
            onClick={() => navigate("/flights")}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            Flights
          </button>

          <button 
            onClick={() => navigate("/my-tickets")} 
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            My Tickets
          </button>

          
          <button 
            onClick={() => navigate("/air-companies")} 
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all"
          >
            Airlines
          </button>
          {localStorage.getItem("userRole") !== "USER" && (
            <>
              <button onClick={() => navigate("/create-airline")} className="rounded-full px-4 py-2 text-sm font-semibold text-gray-300 hover:bg-white/5 hover:text-white transition-all">New Airline</button>
            </>
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-300 active:scale-95 shadow-lg shadow-red-500/5"
      >
        <span>Logout</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </nav>
  );
}