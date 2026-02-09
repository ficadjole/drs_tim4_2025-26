import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const mojId = localStorage.getItem("userId");

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) return;

    const updatedUser = { 
      ...userToUpdate, 
      userRole: newRole as User["userRole"] 
    };

    try {
      await userApi.updateUser(userId, updatedUser);
      
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === userId ? updatedUser : u))
      );
    } catch {
      alert("Error while changing the role.");
    }
  };

  const handleDelete = async (id: number) => {
    if (id.toString() === mojId) {
      alert("You cannot delete your account");
      return;
    }
    if (window.confirm("Are you sure?")) {
      try {
        await userApi.deleteUser(id);
        loadUsers();
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-transparent px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((u) => (
          <div
            key={u.id}
            className="group relative flex flex-col p-5 rounded-[2.2rem] bg-black/40 backdrop-blur-3xl border border-white/20 shadow-2xl transition-all w-full max-w-[280px] mx-auto"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-base font-black">
                {u.firstName.charAt(0)}{u.lastName.charAt(0)}
              </div>
              <div className="text-left overflow-hidden">
                <h3 className="text-sm font-black text-white truncate uppercase">
                  {u.firstName} {u.lastName}
                </h3>
                <p className="text-[10px] font-bold text-sky-200/60 truncate">{u.email}</p>
              </div>
            </div>

            <div className="mb-5 text-left">
              <label className="text-[9px] uppercase tracking-widest font-black text-white/50 mb-1.5 block ml-1">
                Access Level
              </label>
              
              <select
                value={u.userRole}
                onChange={(e) => u.id && handleRoleChange(u.id, e.target.value)}
                className="w-full bg-slate-800 text-white border border-white/10 rounded-xl px-3 py-2 text-[11px] font-bold outline-none focus:ring-1 ring-blue-500 cursor-pointer"
              >
                <option value="USER" style={{ backgroundColor: '#1e293b' }}>User</option>
                <option value="MANAGER" style={{ backgroundColor: '#1e293b' }}>Manager</option>
                <option value="ADMINISTRATOR" style={{ backgroundColor: '#1e293b' }}>Administrator</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit-user/${u.id}`)}
                className="flex-[3] bg-[#00aeef] hover:bg-[#0094cc] text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all"
              >
                Manage Profile
              </button>
              <button
                onClick={() => u.id && handleDelete(u.id)}
                className={`flex-1 rounded-xl text-[9px] font-black transition-all ${
                  u.id?.toString() === mojId 
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed" 
                  : "bg-white/10 hover:bg-rose-500 text-rose-200 hover:text-white"
                }`}
              >
                DEL
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}