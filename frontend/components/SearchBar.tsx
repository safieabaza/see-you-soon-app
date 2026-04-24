type SearchBarProps = {
  onSearch: (values: { city: string; minPrice: string; maxPrice: string; guests: string }) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <form className="grid gap-4 sm:grid-cols-4" onSubmit={(event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      onSearch({
        city: String(formData.get('city') ?? ''),
        minPrice: String(formData.get('minPrice') ?? ''),
        maxPrice: String(formData.get('maxPrice') ?? ''),
        guests: String(formData.get('guests') ?? '')
      });
    }}>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Location</span>
        <input name="city" placeholder="North Coast, Alexandria" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Min Budget</span>
        <input name="minPrice" type="number" placeholder="100" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Max Budget</span>
        <input name="maxPrice" type="number" placeholder="500" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Guests</span>
        <input name="guests" type="number" placeholder="4" className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
      </label>
      <button type="submit" className="sm:col-span-4 inline-flex items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-white transition hover:bg-brand-700">
        Search Properties
      </button>
    </form>
  );
}
