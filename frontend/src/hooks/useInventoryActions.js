import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function useInventoryActions(token, onRefresh, closeModal) {
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (formData, selectedCar) => {
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

      if (onRefresh) await onRefresh();
      if (closeModal) closeModal();
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
      if (onRefresh) await onRefresh();
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

      if (onRefresh) await onRefresh();
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

      if (onRefresh) await onRefresh();
    } catch (error) {
      console.error('Restock failed:', error);
      setErrorMessage('Failed to restock vehicle.');
    }
  };

  return {
    errorMessage,
    setErrorMessage,
    handleSubmit,
    handleDelete,
    handlePurchase,
    handleRestock,
  };
}
