/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import AdminInventory from '../components/AdminInventory';
import { AuthContext } from '../context/AuthContext';

const cars = [
  {
    _id: '1',
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 22000,
    status: 'available',
    vin: 'VIN1',
  },
];

const renderInventory = (authValue) =>
  render(
    <AuthContext.Provider value={authValue}>
      <AdminInventory cars={cars} />
    </AuthContext.Provider>
  );

beforeEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('AdminInventory', () => {
  it('renders Add New Car only for admin users', () => {
    const adminView = renderInventory({ user: { role: 'admin' }, token: 'admin-token' });
    expect(adminView.getByRole('button', { name: /add new car/i })).toBeInTheDocument();
    adminView.unmount();

    const userView = renderInventory({ user: { role: 'user' }, token: 'user-token' });
    expect(userView.queryByRole('button', { name: /add new car/i })).not.toBeInTheDocument();
  });

  it('opens a modal form with all fields when Add New Car is clicked', () => {
    const { container } = renderInventory({ user: { role: 'admin' }, token: 'admin-token' });
    const view = within(container);

    fireEvent.click(view.getByRole('button', { name: /add new car/i }));

    expect(view.getByRole('dialog')).toBeInTheDocument();
    expect(view.getByLabelText(/make/i)).toBeInTheDocument();
    expect(view.getByLabelText(/model/i)).toBeInTheDocument();
    expect(view.getByLabelText(/year/i)).toBeInTheDocument();
    expect(view.getByLabelText(/price/i)).toBeInTheDocument();
    expect(view.getByLabelText(/status/i)).toBeInTheDocument();
    expect(view.getByLabelText(/vin/i)).toBeInTheDocument();
  });

  it('populates the modal form when Edit is clicked', () => {
    const { container } = renderInventory({ user: { role: 'admin' }, token: 'admin-token' });
    const view = within(container);

    fireEvent.click(view.getByRole('button', { name: /edit/i }));

    expect(view.getByDisplayValue('Honda')).toBeInTheDocument();
    expect(view.getByDisplayValue('Civic')).toBeInTheDocument();
    expect(view.getByDisplayValue('2021')).toBeInTheDocument();
    expect(view.getByDisplayValue('22000')).toBeInTheDocument();
    expect(view.getByDisplayValue('available')).toBeInTheDocument();
    expect(view.getByDisplayValue('VIN1')).toBeInTheDocument();
  });

  it('sends a delete request with a Bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = renderInventory({ user: { role: 'admin' }, token: 'admin-token' });
    const view = within(container);

    fireEvent.click(view.getByRole('button', { name: /delete/i }));

    expect(fetchMock).toHaveBeenCalledWith('/api/cars/1', {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer admin-token',
      },
    });
  });
});
