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
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setForm(createInitialForm(initialData));
			setIsSubmitting(false);
		}
	}, [initialData, isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsSubmitting(true);
		try {
			await onSubmit({ ...form });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
			<div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
				<form className="grid gap-4" onSubmit={handleSubmit}>
					<h3 className="text-lg font-bold text-slate-900">{initialData?._id ? 'Edit Car' : 'Add New Car'}</h3>
					<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="make">
						Make
						<input
							id="make"
							aria-label="Make"
							required
							value={form.make}
							onChange={(event) => setForm({ ...form, make: event.target.value })}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
						/>
					</label>
					<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="model">
						Model
						<input
							id="model"
							aria-label="Model"
							required
							value={form.model}
							onChange={(event) => setForm({ ...form, model: event.target.value })}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
						/>
					</label>
					<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="year">
						Year
						<input
							id="year"
							aria-label="Year"
							type="number"
							required
							value={form.year}
							onChange={(event) => setForm({ ...form, year: event.target.value })}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
						/>
					</label>
					<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="price">
						Price
						<input
							id="price"
							aria-label="Price"
							type="number"
							required
							value={form.price}
							onChange={(event) => setForm({ ...form, price: event.target.value })}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
						/>
					</label>
					<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="status">
						Status
						<select
							id="status"
							aria-label="Status"
							value={form.status}
							onChange={(event) => setForm({ ...form, status: event.target.value })}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
						>
							<option value="available">available</option>
							<option value="reserved">reserved</option>
							<option value="sold">sold</option>
						</select>
					</label>
					<label className="grid gap-1 text-sm font-medium text-slate-700" htmlFor="vin">
						VIN
						<input
							id="vin"
							aria-label="VIN"
							required
							value={form.vin}
							onChange={(event) => setForm({ ...form, vin: event.target.value })}
							className="rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
						/>
					</label>
					<div className="mt-2 flex justify-end gap-3">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition-opacity hover:bg-slate-800 disabled:opacity-50"
						>
							{isSubmitting ? 'Saving...' : 'Save'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}