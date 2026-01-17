import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await userApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error while loading: ", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await userApi.updateUser(userId, { userRole: newRole });
      alert("Role successfully changed.");
      loadUsers();
    } catch {
      alert("Error while changing the role on server.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-8 text-2xl font-bold tracking-tight">Admin panel</h2>
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name and Surname</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="px-4 py-3">{u.firstName} {u.lastName}</td>
                  <td className="px-4 py-3 text-gray-300">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.userRole}
                      onChange={(e) =>
                        handleRoleChange(u.id, e.target.value)
                      }
                      className="rounded-md bg-gray-800 px-3 py-1 text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="USER">User</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMINISTRATOR">Administrator</option>
                    </select>

                  </td>

                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/edit-user/${u.id}`)}
                        className="rounded-md bg-indigo-500 px-3 py-1 text-sm font-semibold hover:bg-indigo-400"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => u.id && userApi.deleteUser(u.id).then(loadUsers)}
                        className="rounded-md bg-pink-500 px-3 py-1 text-sm font-semibold hover:bg-pink-400 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}