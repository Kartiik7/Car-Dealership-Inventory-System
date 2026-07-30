import { useState } from 'react';
import CarModal from './CarModal';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const emptyCar = {
	make: '',
	model: '',
	year: '',
	price: '',
	status: 'available',
	vin: '',
};

export default function CarList({ cars, onRefresh, isLoading = false }) {
	const auth = useAuth();
	const isAdmin = auth?.user?.role === 'admin';
	const token = auth?.token || '';
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCar, setSelectedCar] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');

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

	const handleSubmit = async (formData) => {
		setErrorMessage('');
		const payload = {
			...formData,
			year: Number(formData.year),
			price: Number(formData.price),
		};

		try {
			let response;
			if (selectedCar && selectedCar._id) {
				response = await fetch(`${API_BASE}/cars/${selectedCar._id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				});
			} else {
				response = await fetch(`${API_BASE}/cars`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(payload),
				});
			}

			if (!response.ok) {
				const errData = await response.json().catch(() => ({}));
				setErrorMessage(errData.message || response.statusText || 'Failed to save car');
				return;
			}

			if (onRefresh) {
				await onRefresh();
			}
			closeModal();
		} catch (error) {
			console.error('Failed to save car:', error);
			setErrorMessage('Failed to save car. Please try again.');
		}
	};

	const handleDelete = async (carId) => {
		setErrorMessage('');
		try {
			const response = await fetch(`${API_BASE}/cars/${carId}`, {
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (!response.ok) {
				const errData = await response.json().catch(() => ({}));
				setErrorMessage(errData.message || response.statusText || 'Failed to delete car');
				return;
			}
			if (onRefresh) {
				await onRefresh();
			}
		} catch (error) {
			console.error('Failed to delete car:', error);
			setErrorMessage('Failed to delete car. Please try again.');
		}
	};

	return (
		<div className="space-y-6">
			{errorMessage ? (
				<div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					<span>{errorMessage}</span>
					<button
						type="button"
						onClick={() => setErrorMessage('')}
						className="font-bold hover:text-red-900"
						aria-label="Dismiss error"
					>
						✕
					</button>
				</div>
			) : null}

			{isAdmin ? (
				<button type="button" onClick={openCreateModal} className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
					Add New Car
				</button>
			) : null}

			{isLoading ? (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-44 animate-pulse rounded-xl bg-slate-200" />
					))}
				</div>
			) : inventory.length === 0 ? (
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
									<button type="button" onClick={() => openEditModal(car)} className="rounded-lg border border-slate-300 px-3 py-2 hover:bg-slate-50">
										Edit
									</button>
									<button type="button" onClick={() => handleDelete(car._id)} className="rounded-lg border border-red-300 px-3 py-2 text-red-600 hover:bg-red-50">
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