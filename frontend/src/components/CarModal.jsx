import { useEffect, useState } from 'react';

const createInitialForm = (initialData = {}) => ({
	make: initialData.make || '',
	model: initialData.model || '',
	year: initialData.year || '',
	price: initialData.price || '',
	status: initialData.status || 'available',
	vin: initialData.vin || '',
});

export default function CarModal({ isOpen, onClose, onSubmit, initialData }) {
	const [form, setForm] = useState(() => createInitialForm(initialData));

	useEffect(() => {
		if (isOpen) {
			setForm(createInitialForm(initialData));
		}
	}, [initialData, isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit({ ...form });
	};

	return (
		<div role="dialog" aria-modal="true" className="rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
			<form className="grid gap-4" onSubmit={handleSubmit}>
				<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="make">
					Make
					<input id="make" aria-label="Make" value={form.make} onChange={(event) => setForm({ ...form, make: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" />
				</label>
				<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="model">
					Model
					<input id="model" aria-label="Model" value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" />
				</label>
				<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="year">
					Year
					<input id="year" aria-label="Year" value={form.year} onChange={(event) => setForm({ ...form, year: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" />
				</label>
				<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="price">
					Price
					<input id="price" aria-label="Price" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" />
				</label>
				<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="status">
					Status
					<select id="status" aria-label="Status" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2">
						<option value="available">available</option>
						<option value="reserved">reserved</option>
						<option value="sold">sold</option>
					</select>
				</label>
				<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="vin">
					VIN
					<input id="vin" aria-label="VIN" value={form.vin} onChange={(event) => setForm({ ...form, vin: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" />
				</label>
				<div className="flex gap-3">
					<button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-white">Save</button>
					<button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2">Cancel</button>
				</div>
			</form>
		</div>
	);
}