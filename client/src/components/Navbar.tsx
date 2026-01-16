import { useNavigate } from "react-router-dom";
import { UserRole } from "../enums/UserRoles";

export default function Navbar() {
  const navigate = useNavigate();
  const role = Number(localStorage.getItem("userRole"));
  const userId = localStorage.getItem("userId");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    
    window.location.href = "/"; 
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 px-6 py-4 text-white border-b border-white/10">
      <div className="flex items-center gap-6">
        <span className="cursor-pointer text-lg font-bold tracking-tight text-indigo-400 hover:text-indigo-300">My Application</span>
        {role === UserRole.ADMINISTRATOR ? (
          <button onClick={() => navigate("/users")} className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/10">User List</button>
        ) : (
          <button onClick={() => navigate(`/edit-user/${userId}`)} className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/10">My Profile</button>
        )}
      </div>

      <button 
        onClick={handleLogout} 
        className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-white/10"
      >
        Logout
      </button>
    </nav>
  );
}