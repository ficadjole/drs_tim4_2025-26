import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";
import { UserRole } from "../../enums/UserRoles"; 
import type { UserRoleType } from "../../enums/UserRoles";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const myRole = Number(localStorage.getItem("userRole")); 

  useEffect(() => {
    if (id) {
      userApi.getUserById(Number(id)).then((data) => {
      setUser(data ?? null); 
    });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (user && id) {
    try {
      await userApi.updateUser(Number(id), user);
      navigate(-1);
      window.location.href = document.referrer; 

    } catch (error) {
      console.error("Error:", error);
      alert("Error while saving.");
    }
  }

  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-300">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="mb-6 text-xl font-bold">
          Profile: <span className="text-indigo-400">{user.email}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300">Name:</label>
            <input value={user.firstName} onChange={e => setUser({...user, firstName: e.target.value})} 
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Surname:</label>
            <input value={user.lastName} onChange={e => setUser({...user, lastName: e.target.value})} 
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-indigo-500"/>
          </div>

          <div>
            <label className="block text-sm text-gray-300">State:</label>
            <input value={user.state || ""} onChange={e => setUser({...user, state: e.target.value})} 
              className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-indigo-500"/>
          </div>


          {myRole === UserRole.ADMINISTRATOR && (
            <div>
              <label className="block text-sm text-gray-300">User role:</label>
              <select 
                value={user.userRole} 
                onChange={e => setUser({...user, userRole: Number(e.target.value) as UserRoleType})}
                className="mt-1 w-full rounded-md bg-white/5 px-3 py-2 text-white outline outline-1 outline-white/10 focus:outline-indigo-500">
                <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                <option value={UserRole.MANAGER}>Manager</option>
                <option value={UserRole.USER}>User</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">Save</button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}