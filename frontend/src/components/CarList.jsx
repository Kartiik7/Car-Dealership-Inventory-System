import { useEffect, useState } from 'react';

export default function CarList() {
	const [cars, setCars] = useState([]);

	useEffect(() => {
		const loadCars = async () => {
			try {
				const response = await fetch('/api/cars');
				const data = await response.json();
				setCars(Array.isArray(data) ? data : []);
			} catch (error) {
				setCars([]);
			}
		};

		loadCars();
	}, []);

	return (
		<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{cars.map((car) => (
				<article key={car._id || `${car.make}-${car.model}-${car.vin}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
					<h3 className="text-lg font-semibold text-slate-900">
						{car.make} {car.model}
					</h3>
					<p className="mt-2 text-sm text-slate-600">Year: {car.year}</p>
					<p className="text-sm font-medium text-slate-800">Price: ${car.price}</p>
				</article>
			))}
		</div>
	);
}