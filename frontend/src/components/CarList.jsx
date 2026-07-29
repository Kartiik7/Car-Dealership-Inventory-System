export default function CarList({ cars }) {
	if (!cars || cars.length === 0) {
		return <p className="text-sm text-slate-600">No cars in inventory</p>;
	}

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{cars.map((car) => (
				<article key={car._id || `${car.make}-${car.model}-${car.vin}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
					<h3 className="text-lg font-semibold text-slate-900">{car.make}</h3>
					<p className="mt-1 text-sm text-slate-600">{car.model}</p>
					<p className="text-sm text-slate-600">{car.year}</p>
					<p className="text-sm font-medium text-slate-800">{car.price}</p>
				</article>
			))}
		</div>
	);
}