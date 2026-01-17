import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";
import { format } from "date-fns";

export default function UserDetails() {
  const [user, setUser] = useState<User | null>(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      userApi.getUserById(Number(userId)).then((data) => {
      setUser(data ?? null);
    });
    }
  }, [userId]);
    console.log(user)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-300">
        Profile loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-white">
      <div className="mx-auto max-w-md rounded-lg border border-white/10 bg-white/5 p-6">

        <div className="mb-6 flex items-center gap-3">
          <h2 className="text-2xl font-bold">My Profile</h2>

          {user.userImageUrl ? (
            <img
              alt="User avatar"
              src={user.userImageUrl}
              className="h-20 w-20 shrink-0 rounded-full
                border border-white/10 bg-gray-700 object-cover"
            />
          ) : (
            <span className="text-sm text-gray-400 italic">
              No profile image
            </span>
          )}
        </div>

        <div>
          <p>
            <span className="text-gray-400">Name:</span>{" "}
            <span className="font-medium">{user.firstName}</span>
          </p>

          <p>
            <span className="text-gray-400">Surname:</span>{" "}
            <span className="font-medium">{user.lastName}</span>
          </p>

          <p>
            <span className="text-gray-400">Date of birth:</span>{" "}
            <span className="font-medium">{format(user.dateOfBirth,'dd/MM/yyyy')}</span>
          </p>

          <p>
            <span className="text-gray-400">Gender:</span>{" "}
            <span className="font-medium">{user.gender}</span>
          </p>

          <p>
            <span className="text-gray-400">Email:</span>{" "}
            <span className="font-medium">{user.email}</span>
          </p>

          <p>
            <span className="text-gray-400">State:</span>{" "}
            <span className="font-medium">{user.state}</span>
          </p>

          <p>
            <span className="text-gray-400">Street name:</span>{" "}
            <span className="font-medium">{user.streetName}</span>
          </p>

          <p>
            <span className="text-gray-400">Street number:</span>{" "}
            <span className="font-medium">{user.streetNumber}</span>
          </p>

          <p>
            <span className="text-gray-400">User role:</span>{" "}
            <span className="font-medium">{user.userRole}</span>
          </p>



        </div>
        <button onClick={() => navigate(`/edit-user/${userId}`)}
          className="mt-6 w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-semibold hover:bg-indigo-400">
          Change
        </button>
      </div>
    </div>
  );
}