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
	quantity: 1,
	category: 'Sedan',
};

export default function CarList({ cars, onRefresh, isLoading = false }) {
	const auth = useAuth();
	const isAdmin = auth?.user?.role === 'admin';
	const token = auth?.token || '';
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedCar, setSelectedCar] = useState(null);
	const [errorMessage, setErrorMessage] = useState('');

	// Search & Filter state
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [minPrice, setMinPrice] = useState('');
	const [maxPrice, setMaxPrice] = useState('');

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
			quantity: Number(formData.quantity) || 1,
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

	const handlePurchase = async (carId) => {
		setErrorMessage('');
		try {
			const response = await fetch(`${API_BASE}/vehicles/${carId}/purchase`, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				const errData = await response.json().catch(() => ({}));
				setErrorMessage(errData.message || 'Vehicle is out of stock');
				return;
			}

			if (onRefresh) {
				await onRefresh();
			}
		} catch (error) {
			console.error('Purchase failed:', error);
			setErrorMessage('Failed to purchase vehicle.');
		}
	};

	const handleRestock = async (carId) => {
		setErrorMessage('');
		try {
			const response = await fetch(`${API_BASE}/vehicles/${carId}/restock`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ amount: 1 }),
			});

			if (!response.ok) {
				const errData = await response.json().catch(() => ({}));
				setErrorMessage(errData.message || 'Failed to restock vehicle');
				return;
			}

			if (onRefresh) {
				await onRefresh();
			}
		} catch (error) {
			console.error('Restock failed:', error);
			setErrorMessage('Failed to restock vehicle.');
		}
	};

	// Filter vehicles based on query inputs
	const filteredInventory = (cars || []).filter((car) => {
		const matchesSearch =
			!searchQuery ||
			car.make?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			car.model?.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			!selectedCategory ||
			car.category?.toLowerCase() === selectedCategory.toLowerCase();

		const matchesMinPrice =
			!minPrice || car.price >= Number(minPrice);

		const matchesMaxPrice =
			!maxPrice || car.price <= Number(maxPrice);

		return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
	});

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

			{/* Search & Filter Bar */}
			<div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
				<input
					type="text"
					placeholder="Search make or model..."
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
				/>
				<label htmlFor="category-select" className="sr-only">Category</label>
				<select
					id="category-select"
					aria-label="Category"
					value={selectedCategory}
					onChange={(e) => setSelectedCategory(e.target.value)}
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
					placeholder="Min price..."
					value={minPrice}
					onChange={(e) => setMinPrice(e.target.value)}
					className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
				/>
				<input
					type="number"
					placeholder="Max price..."
					value={maxPrice}
					onChange={(e) => setMaxPrice(e.target.value)}
					className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-slate-900"
				/>
			</div>

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
			) : filteredInventory.length === 0 ? (
				<p className="text-sm text-slate-600">No cars in inventory</p>
			) : (
				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filteredInventory.map((car) => {
						const isOutOfStock = (car.quantity ?? 1) === 0;

						return (
							<article key={car._id || `${car.make}-${car.model}-${car.vin}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
								<div className="flex items-start justify-between">
									<div>
										<h3 className="text-lg font-semibold text-slate-900">{car.make}</h3>
										<p className="mt-1 text-sm text-slate-600">{car.model}</p>
									</div>
									<span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
										{isOutOfStock ? 'Out of Stock' : `Qty: ${car.quantity ?? 1}`}
									</span>
								</div>
								<p className="mt-2 text-sm text-slate-600">{car.year}</p>
								<p className="text-xs text-slate-500">{car.category || 'Sedan'}</p>
								<p className="text-sm font-medium text-slate-800">{car.price}</p>
								
								<div className="mt-4 flex flex-wrap gap-2">
									{/* Purchase Action */}
									<button
										type="button"
										disabled={isOutOfStock}
										onClick={() => handlePurchase(car._id)}
										className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white transition ${
											isOutOfStock
												? 'cursor-not-allowed bg-slate-300 text-slate-500'
												: 'bg-emerald-600 hover:bg-emerald-700'
										}`}
									>
										{isOutOfStock ? 'Out of Stock' : 'Purchase'}
									</button>

									{/* Admin Actions */}
									{isAdmin ? (
										<>
											<button
												type="button"
												onClick={() => handleRestock(car._id)}
												className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
											>
												Restock
											</button>
											<button
												type="button"
												onClick={() => openEditModal(car)}
												className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
											>
												Edit
											</button>
											<button
												type="button"
												onClick={() => handleDelete(car._id)}
												className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
											>
												Delete
											</button>
										</>
									) : null}
								</div>
							</article>
						);
					})}
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