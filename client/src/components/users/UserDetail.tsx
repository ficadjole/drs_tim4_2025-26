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

  const [amount, setAmount] = useState<number | "">("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    try {

      const res = await userApi.addMoney(parseInt(userId!),amount)

      if(res){
        alert(`Money added successfully`)
      }else{
        alert('Money is not successful')
      }

      navigate(-1);
    } catch (err) {
      alert(`Failed to save. Name might be taken.${err}`);
    }

  };


  if (!user) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center text-white font-black uppercase tracking-widest">
        Profile loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent px-6 py-12 flex items-center justify-center">
      
      <div className="w-full max-w-md rounded-[3rem] bg-black/20 backdrop-blur-3xl border border-white/20 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        
        <div className="mb-10 flex flex-col items-center gap-5">
          <div className="relative">
            {user.userImageUrl ? (
              <img
                alt="User avatar"
                src={user.userImageUrl}
                className="h-32 w-32 rounded-[2.5rem] border-4 border-white/10 object-cover shadow-2xl"
              />
            ) : (
              <div className="h-32 w-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 border-4 border-[#1a1c2e] rounded-full shadow-lg"></div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">My Profile</h2>
            <p className="text-sky-300/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Personal Details</p>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-8">
          {[
            { label: "Full Name", value: `${user.firstName} ${user.lastName}` },
            { label: "Birth Date", value: format(new Date(user.dateOfBirth), 'dd/MM/yyyy') },
            { label: "Gender", value: user.gender },
            { label: "Email", value: user.email },
            { label: "Location", value: `${user.state}, ${user.streetName} ${user.streetNumber}` },
            { label: "Account Role", value: user.userRole },
          ].map((item) => (
            <div key={item.label} className="flex justify-between items-center group">
              <span className="text-white/40 font-black uppercase text-[9px] tracking-widest group-hover:text-sky-400 transition-colors">{item.label}</span>
              <span className="text-white text-sm font-bold tracking-wide">{item.value}</span>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate(`/edit-user/${userId}`)}
          className="mt-10 w-full rounded-2xl bg-[#00aeef] py-4 text-xs font-black text-white hover:bg-[#0094cc] transition-all shadow-xl shadow-sky-500/20 active:scale-[0.98] uppercase tracking-[0.15em]"
        >
          Change Profile
        </button>
    <form onSubmit={handleSubmit} className="flex items-center gap-4 mt-5">
      <input
        type="number"
        min="0"
        step="100"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value === "" ? "" : Number(e.target.value))
        }
        placeholder="Amount"
        className="w-40 rounded-2xl bg-black/30 px-4 py-4 text-white border border-white/10 focus:border-sky-400 focus:bg-black/40 outline-none transition-all placeholder:text-slate-500 font-bold text-sm"
      />

      <button
        type="submit"
        className="rounded-2xl bg-[#00aeef] px-10 py-4 text-xs font-black text-white hover:bg-[#0094cc] transition-all shadow-xl shadow-sky-500/20 active:scale-[0.98] uppercase tracking-[0.15em]"
      >
        Add money
      </button>
    </form>


      </div>
    </div>
  );
}