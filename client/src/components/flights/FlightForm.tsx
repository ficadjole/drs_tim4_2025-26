export default function FlightForm({
  dto,
  onChange,
  onSubmit,
  title
}: {
  dto: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
}) {
  const hiddenFields = ["createdBy", "approvalStatus", "rejectionReason", "id"];

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 text-white">
      <div className="w-full max-w-3xl rounded-[3rem] bg-black/20 backdrop-blur-3xl border border-white/10 p-10 shadow-2xl">
        <h3 className="text-2xl font-black uppercase tracking-tight mb-8">
          {title}
        </h3>

        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(dto)
            .filter(([key]) => !hiddenFields.includes(key))
            .map(([key, value]) => (
              <div key={key}>
                <label className="block text-[10px] font-black uppercase text-white/40 tracking-widest ml-1 mb-1">
                  {key}
                </label>
                <input
                  name={key}
                  value={value as any}
                  onChange={onChange}
                  className="w-full rounded-xl bg-black/30 px-4 py-2.5 text-white border border-white/10"
                  required
                />
              </div>
            ))}

          <div className="md:col-span-2 flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 rounded-2xl bg-sky-500 py-4 font-black uppercase tracking-widest hover:bg-sky-400 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
