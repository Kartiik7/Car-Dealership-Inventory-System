/** @vitest-environment jsdom */
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CarList from '../components/CarList';
import { AuthContext } from '../context/AuthContext';

const sampleCars = [
  { _id: '1', make: 'Toyota', model: 'Camry', year: 2023, price: 25000, quantity: 2, category: 'Sedan', vin: 'VIN1' },
  { _id: '2', make: 'Ford', model: 'F-150', year: 2024, price: 45000, quantity: 0, category: 'Truck', vin: 'VIN2' },
];

const renderCarListWithAuth = (authValue = { user: { role: 'user' }, token: 'token' }) =>
  render(
    <AuthContext.Provider value={authValue}>
      <CarList cars={sampleCars} />
    </AuthContext.Provider>
  );

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('Search and Purchase UI Integration', () => {
  it('renders search filter inputs for search bar, category, and price range', () => {
    renderCarListWithAuth();

    expect(screen.getByPlaceholderText(/search make or model/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/min price/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/max price/i)).toBeInTheDocument();
  });

  it('disables Purchase button and displays Out of Stock when vehicle quantity is 0', () => {
    renderCarListWithAuth();

    const outOfStockButton = screen.getByRole('button', { name: /out of stock/i });
    expect(outOfStockButton).toBeInTheDocument();
    expect(outOfStockButton).toBeDisabled();
  });

  it('enables Purchase button when vehicle quantity > 0', () => {
    renderCarListWithAuth();

    const purchaseButtons = screen.getAllByRole('button', { name: /^purchase$/i });
    expect(purchaseButtons.length).toBeGreaterThan(0);
    expect(purchaseButtons[0]).not.toBeDisabled();
  });

  it('renders Restock button for admin users', () => {
    renderCarListWithAuth({ user: { role: 'admin' }, token: 'admin-token' });

    const restockButtons = screen.getAllByRole('button', { name: /restock/i });
    expect(restockButtons.length).toBeGreaterThan(0);
  });
});
