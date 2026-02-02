import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../../api_services/users/UserAPIService";
import type { User } from "../../models/users/UserDto";
import { UserRole, type UserRoleType } from "../../enums/UserRoles";
import { format } from "date-fns";

export default function EditUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const defaultAvatar = "/user.png"; 

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
      user.dateOfBirth = format(user.dateOfBirth, 'yyyy-MM-dd');
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
      if(user) user.userImageUrl = URL.createObjectURL(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center text-white font-black uppercase tracking-widest">Loading...</div>;

  const inputClass = "w-full rounded-xl bg-black/30 px-4 py-2.5 text-white border border-white/10 focus:border-sky-400 focus:bg-black/40 outline-none transition-all placeholder:text-slate-500 font-medium";

  return (
    <div className="min-h-screen bg-transparent px-4 py-8 text-white font-sans flex items-center justify-center">
      <div className="w-full max-w-5xl rounded-[3rem] border border-white/10 bg-black/20 backdrop-blur-3xl p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
          <h3 className="text-2xl font-black uppercase tracking-tight">
            Edit profile – <span className="text-sky-400">{user.email}</span>
          </h3>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <img
                  src={previewImage || user.userImageUrl || defaultAvatar}
                  alt="Profile"
                  className="h-44 w-44 rounded-[2.5rem] object-cover border-4 border-white/10 bg-white/5 shadow-2xl transition group-hover:scale-[1.02]"
                />
                <label className="absolute -bottom-2 -right-2 bg-sky-500 p-3 rounded-2xl cursor-pointer hover:bg-sky-400 shadow-xl border-4 border-[#1a1c2e] transition-transform active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                  </svg>
                  <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">First name</label>
                  <input value={user.firstName} onChange={(e) => setUser({ ...user, firstName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Last name</label>
                  <input value={user.lastName} onChange={(e) => setUser({ ...user, lastName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Date of birth</label>
                  <input type="date" value={format(user.dateOfBirth, 'yyyy-MM-dd')} onChange={(e) => setUser({ ...user, dateOfBirth: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Gender</label>
                  <select value={user.gender} onChange={(e) => setUser({ ...user, gender: e.target.value })} className={inputClass}>
                    <option value="" className="bg-slate-900">Choose...</option>
                    <option value="MALE" className="bg-slate-900">Male</option>
                    <option value="FEMALE" className="bg-slate-900">Female</option>
                    <option value="OTHER" className="bg-slate-900">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">Street</label>
                  <input value={user.streetName} onChange={(e) => setUser({ ...user, streetName: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">No.</label>
                  <input value={user.streetNumber} onChange={(e) => setUser({ ...user, streetNumber: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1">State</label>
                  <input value={user.state} onChange={(e) => setUser({ ...user, state: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-white/40 ml-1 tracking-widest">Account Balance</label>
                  <div className="w-full rounded-xl bg-white/5 px-4 py-3 text-sky-400 border border-white/5 font-bold opacity-60">€ {user.accountBalance}</div>
                </div>

                {myRole === UserRole.ADMINISTRATOR && (
                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-sky-400 ml-1 tracking-widest">
                    User Role Control
                  </label>
                  <select
                    value={user.userRole}
                    onChange={(e) => {
                      const selectedRole = e.target.value as UserRoleType;
                      setUser({ ...user, userRole: selectedRole });
                    }}
                    className="w-full rounded-xl bg-black/40 px-4 py-2.5 text-white font-black border border-white/10 focus:border-sky-400 outline-none cursor-pointer"
                  >
                    <option value={UserRole.ADMINISTRATOR} className="bg-slate-900">Administrator</option>
                    <option value={UserRole.MANAGER} className="bg-slate-900">Manager</option>
                    <option value={UserRole.USER} className="bg-slate-900">User</option>
                  </select>
                </div>
              )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-10 border-t border-white/5">
            <button type="submit" className="flex-1 rounded-2xl bg-sky-500 py-4 font-black uppercase tracking-widest text-white hover:bg-sky-400 shadow-xl shadow-sky-500/20 transition-all active:scale-[0.98]">
              Save Changes
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}