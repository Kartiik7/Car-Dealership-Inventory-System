import { useState } from 'react';
import CarModal from './CarModal';
import { useAuth } from '../context/AuthContext';

const emptyCar = {
	make: '',
	model: '',
	year: '',
	price: '',
	status: 'available',
	vin: '',
};

export default function CarList({ cars }) {
	const auth = useAuth();
	const isAdmin = auth?.user?.role === 'admin';
	const token = auth?.token || '';
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCar, setSelectedCar] = useState(null);

	const inventory = cars || [];

	const openCreateModal = () => {
		setSelectedCar(null);
		setIsModalOpen(true);
	};

	const openEditModal = (car) => {
		setSelectedCar(car);
		setIsModalOpen(true);
	};

	const closeModal = () => {
		setIsModalOpen(false);
		setSelectedCar(null);
	};

	const handleSubmit = () => {
		closeModal();
	};

	const handleDelete = async (carId) => {
		await fetch(`/api/cars/${carId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	};

	return (
		<div className="space-y-6">
			{isAdmin ? (
				<button type="button" onClick={openCreateModal} className="rounded-lg bg-slate-900 px-4 py-2 text-white">
					Add New Car
				</button>
			) : null}

			{inventory.length === 0 ? (
				<p className="text-sm text-slate-600">No cars in inventory</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{inventory.map((car) => (
						<article key={car._id || `${car.make}-${car.model}-${car.vin}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
							<h3 className="text-lg font-semibold text-slate-900">{car.make}</h3>
							<p className="mt-1 text-sm text-slate-600">{car.model}</p>
							<p className="text-sm text-slate-600">{car.year}</p>
							<p className="text-sm font-medium text-slate-800">{car.price}</p>
							{isAdmin ? (
								<div className="mt-4 flex gap-2">
									<button type="button" onClick={() => openEditModal(car)} className="rounded-lg border border-slate-300 px-3 py-2">
										Edit
									</button>
									<button type="button" onClick={() => handleDelete(car._id)} className="rounded-lg border border-red-300 px-3 py-2 text-red-600">
										Delete
									</button>
								</div>
							) : null}
						</article>
					))}
				</div>
			)}

			{isModalOpen ? (
				<CarModal
					isOpen={isModalOpen}
					onClose={closeModal}
					onSubmit={handleSubmit}
					initialData={selectedCar || emptyCar}
				/>
			) : null}
		</div>
	);
}