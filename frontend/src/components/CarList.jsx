import { useState } from 'react';
import CarModal from './CarModal';
import { useAuth } from '../context/AuthContext';
import { useInventoryActions } from '../hooks/useInventoryActions';
import VehicleFilter from './VehicleFilter';
import VehicleCard from './VehicleCard';

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

  const [filters, setFilters] = useState({
    searchQuery: '',
    selectedCategory: '',
    minPrice: '',
    maxPrice: '',
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const {
    errorMessage,
    setErrorMessage,
    handleSubmit,
    handleDelete,
    handlePurchase,
    handleRestock,
  } = useInventoryActions(token, onRefresh, closeModal);

  const openCreateModal = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const openEditModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const filteredInventory = (cars || []).filter((car) => {
    const matchesSearch =
      !filters.searchQuery ||
      car.make?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      car.model?.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      !filters.selectedCategory ||
      car.category?.toLowerCase() === filters.selectedCategory.toLowerCase();

    const matchesMinPrice =
      !filters.minPrice || car.price >= Number(filters.minPrice);

    const matchesMaxPrice =
      !filters.maxPrice || car.price <= Number(filters.maxPrice);

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

      <VehicleFilter filters={filters} onChange={setFilters} />

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
          {filteredInventory.map((car) => (
            <VehicleCard
              key={car._id || `${car.make}-${car.model}-${car.vin}`}
              car={car}
              isAdmin={isAdmin}
              onPurchase={handlePurchase}
              onRestock={handleRestock}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isModalOpen ? (
        <CarModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={(formData) => handleSubmit(formData, selectedCar)}
          initialData={selectedCar || emptyCar}
        />
      ) : null}
    </div>
  );
}