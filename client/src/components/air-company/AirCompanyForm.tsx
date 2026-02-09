interface AirCompanyFormProps {
  title: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
}

export default function AirCompanyForm({ title, name, onChange, onSubmit, error }: AirCompanyFormProps) {
  return (
    <div className="min-h-screen px-6 py-12 flex justify-center items-start">
      <div className="w-full max-w-lg rounded-[2.5rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-10 shadow-xl">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-8">
          {title}
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-white/40 ml-1">
              Company Name
            </label>
            <input
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Enter airline name..."
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white outline-none focus:border-sky-500 transition"
            />
          </div>

          {error && (
            <p className="text-xs font-black uppercase text-red-400 animate-pulse ml-1">
              {error}
            </p>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-sky-500 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-sky-400 transition shadow-lg shadow-sky-500/20"
            >
              Save Company
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}