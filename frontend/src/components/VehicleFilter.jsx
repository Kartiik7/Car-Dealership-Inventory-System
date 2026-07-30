export default function VehicleFilter({ filters, onChange }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
      <input
        type="text"
        name="searchQuery"
        placeholder="Search make or model..."
        value={filters.searchQuery}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
      />
      <label htmlFor="category-select" className="sr-only">Category</label>
      <select
        id="category-select"
        name="selectedCategory"
        aria-label="Category"
        value={filters.selectedCategory}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
      >
        <option value="">All Categories</option>
        <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
        <option value="Truck">Truck</option>
        <option value="Coupe">Coupe</option>
        <option value="Hatchback">Hatchback</option>
      </select>
      <input
        type="number"
        name="minPrice"
        placeholder="Min price..."
        value={filters.minPrice}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
      />
      <input
        type="number"
        name="maxPrice"
        placeholder="Max price..."
        value={filters.maxPrice}
        onChange={handleChange}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
      />
    </div>
  );
}
