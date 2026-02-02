import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
            className="group relative flex flex-col p-5 rounded-[2.2rem] bg-black/20 backdrop-blur-3xl border border-white/20 shadow-2xl transition-all hover:bg-black/30 w-full max-w-[280px] mx-auto"
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-base font-black shadow-lg">
                {u.firstName.charAt(0)}{u.lastName.charAt(0)}
              </div>
              <div className="text-left overflow-hidden">
                <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">
                  {u.firstName} {u.lastName}
                </h3>
                <p className="text-[10px] font-bold text-sky-200/60 truncate">{u.email}</p>
              </div>
            </div>

            <div className="mb-5">
              <label className="text-[9px] uppercase tracking-widest font-black text-white/50 mb-1.5 block ml-1">
                Access Level
              </label>
              <select
                value={u.userRole}
                onChange={(e) => u.id && handleRoleChange(u.id, e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white font-bold outline-none focus:ring-1 ring-white/30 transition-all cursor-pointer"
              >
                <option value="USER" className="bg-slate-900">User</option>
                <option value="MANAGER" className="bg-slate-900">Manager</option>
                <option value="ADMINISTRATOR" className="bg-slate-900">Administrator</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/edit-user/${u.id}`)}
                className="flex-[3] bg-[#00aeef] hover:bg-[#0094cc] text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all shadow-md"
              >
                Manage Profile
              </button>
              <button
                onClick={() => u.id && handleDelete(u.id)}
                className="flex-1 bg-white/10 hover:bg-rose-500/30 text-rose-200 border border-white/5 rounded-xl text-[9px] font-black transition-all"
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