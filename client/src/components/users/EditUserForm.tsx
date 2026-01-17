import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";
import { UserRole, type UserRoleType } from "../../enums/UserRoles";
import {format} from "date-fns";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const myRole = localStorage.getItem("userRole") as UserRoleType | null;

  useEffect(() => {
    if (id) {
      userApi.getUserById(Number(id)).then((data) => {
        setUser(data ?? null);
      });
    }
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return;

    try {

      user.dateOfBirth = format(user.dateOfBirth,'yyyy-MM-dd');

      await userApi.updateUser(Number(id), user);
      navigate(-1);
    } catch (error) {
      console.error(error);
      alert("Error while saving.");
    }
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];

    if(user)
      user.userImageUrl = URL.createObjectURL(file);

    setPreviewImage(URL.createObjectURL(file));
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
      <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-white/5 p-6">
        <h3 className="mb-6 text-xl font-bold">
          Edit profile – <span className="text-indigo-400">{user.email}</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-8">

          {/* PROFILE IMAGE */}
          <div className="flex items-center gap-6">
            <img
              src={previewImage || user.userImageUrl || "/avatar-placeholder.png"}
              alt="Profile"
              className="h-28 w-28 rounded-full object-cover border-2 border-indigo-500/40 bg-gray-800"
            />

            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg
              bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white
              hover:bg-indigo-500 transition">
              Upload image
              <input type="file" accept="image/*" hidden onChange={handleImageChange} />
            </label>
          </div>


          {/* PERSONAL INFO */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-indigo-400">
              Personal information
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="mb-1 block text-sm text-gray-300">First name</label>
                <input
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  className="w-full rounded-lg bg-gray-900/80 px-4 py-2.5 text-white
                    border border-gray-700
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                    transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Last name</label>
                <input
                  value={user.lastName}
                  onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  className="w-full rounded-lg bg-gray-900/80 px-4 py-2.5 text-white
                    border border-gray-700
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                    transition"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Date of birth</label>
                <input
                  type="date"
                  value={format(user.dateOfBirth,'yyyy-MM-dd')}
                  onChange={(e) =>
                    setUser({ ...user, dateOfBirth: e.target.value })
                  }
                  className="w-full rounded-lg bg-gray-900/80 px-4 py-2.5 text-white
                    border border-gray-700
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-300">Gender</label>
                <select
                  value={user.gender}
                  onChange={(e) => setUser({ ...user, gender: e.target.value })}
                  className="w-full rounded-lg bg-gray-900/80 px-4 py-2.5 text-white
                    border border-gray-700 cursor-pointer
                    focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                >
                  <option value="">Choose gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
        </div>


          {/* ADDRESS */}
          <div>
              <h4 className="mb-4 text-lg font-semibold text-indigo-400">Address</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { label: "Street name", value: user.streetName, key: "streetName" },
                  { label: "Street number", value: user.streetNumber, key: "streetNumber" },
                  { label: "State", value: user.state, key: "state" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-sm text-gray-300">{field.label}</label>
                    <input
                      value={field.value}
                      onChange={(e) =>
                        setUser({ ...user, [field.key]: e.target.value })
                      }
                      className="w-full rounded-lg bg-gray-900/80 px-4 py-2.5 text-white
                        border border-gray-700
                        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                ))}
              </div>
            </div>

          {/* ACCOUNT */}
          <div>
              <h4 className="mb-4 text-lg font-semibold text-indigo-400">Account</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1 block text-sm text-gray-300">Account balance</label>
                  <input
                    disabled
                    value={`€ ${user.accountBalance}`}
                    className="w-full rounded-lg bg-gray-900/60 px-4 py-2.5 text-white
                      border border-gray-700 opacity-60 cursor-not-allowed"
                  />
                </div>

                {myRole === UserRole.ADMINISTRATOR && (
                  <div>
                    <label className="mb-1 block text-sm text-gray-300">User role</label>
                    <select
                      value={user.userRole}
                      onChange={(e) =>
                        setUser({
                          ...user,
                          userRole: e.target.value as "USER" | "MANAGER" | "ADMINISTRATOR",
                        })
                      }
                      className="w-full rounded-lg bg-gray-900/80 px-4 py-2.5 text-white
                        border border-gray-700 cursor-pointer
                        focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value={UserRole.ADMINISTRATOR}>Administrator</option>
                      <option value={UserRole.MANAGER}>Manager</option>
                      <option value={UserRole.USER}>User</option>
                    </select>
                  </div>
                )}
              </div>
          </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold
              hover:bg-indigo-500 transition"
          >
            Save changes
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 rounded-lg border border-gray-700 py-2.5 text-sm
              hover:bg-white/10 transition"
          >
            Cancel
          </button>
        </div>

        </form>
      </div>
    </div>
  );
}
