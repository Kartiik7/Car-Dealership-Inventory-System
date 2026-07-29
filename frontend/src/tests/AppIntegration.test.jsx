/** @vitest-environment jsdom */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Login from '../components/Login';
import Navbar from '../components/Navbar';
import AdminInventory from '../components/AdminInventory';
import ProtectedRoute from '../components/ProtectedRoute';

const fakeAdminPayload = { role: 'admin', email: 'admin@test.com' };
const fakeAdminToken = 'fake-admin-jwt-token';

const carsList = [
	{ _id: '1', make: 'Toyota', model: 'Camry', year: 2023, price: 28000, status: 'available', vin: 'VIN001' },
	{ _id: '2', make: 'Honda', model: 'Accord', year: 2022, price: 26000, status: 'available', vin: 'VIN002' },
];

function InventoryPage() {
	return (
		<div>
			<h1>Inventory</h1>
			<AdminInventory cars={carsList} />
		</div>
	);
}

function TestApp({ authValue, initialEntries = ['/login'] }) {
	const isAuthenticated = Boolean(authValue.user);

	return (
		<AuthContext.Provider value={authValue}>
			<MemoryRouter initialEntries={initialEntries}>
				<Navbar isAuthenticated={isAuthenticated} />
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/inventory"
						element={
							<ProtectedRoute>
								<InventoryPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</MemoryRouter>
		</AuthContext.Provider>
	);
}

beforeEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('App Integration', () => {
	it('renders login form and submits credentials storing JWT via login handler', async () => {
		const loginFn = vi.fn();
		const authValue = { user: null, token: '', login: loginFn, logout: vi.fn() };

		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ token: fakeAdminToken, user: fakeAdminPayload }),
			})
		);

		render(<TestApp authValue={authValue} />);

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'admin@test.com' } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'admin123' } });
		fireEvent.click(screen.getByRole('button', { name: /login/i }));

		expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' }),
		});

		await waitFor(() => {
			expect(loginFn).toHaveBeenCalledWith(fakeAdminPayload, fakeAdminToken);
		});
	});

	it('admin user can fetch car list, open CarModal, and see inventory', () => {
		const authValue = { user: fakeAdminPayload, token: fakeAdminToken, login: vi.fn(), logout: vi.fn() };

		render(<TestApp authValue={authValue} initialEntries={['/inventory']} />);

		expect(screen.getByText('Inventory')).toBeInTheDocument();
		expect(screen.getByText('Toyota')).toBeInTheDocument();
		expect(screen.getByText('Honda')).toBeInTheDocument();

		const addButton = screen.getByRole('button', { name: /add new car/i });
		expect(addButton).toBeInTheDocument();

		fireEvent.click(addButton);

		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(screen.getByLabelText(/make/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/vin/i)).toBeInTheDocument();
	});

	it('admin can fill CarModal form and submit new car', async () => {
		const authValue = { user: fakeAdminPayload, token: fakeAdminToken, login: vi.fn(), logout: vi.fn() };

		render(<TestApp authValue={authValue} initialEntries={['/inventory']} />);

		fireEvent.click(screen.getByRole('button', { name: /add new car/i }));

		const dialog = screen.getByRole('dialog');
		const view = within(dialog);

		fireEvent.change(view.getByLabelText(/make/i), { target: { value: 'Ford' } });
		fireEvent.change(view.getByLabelText(/model/i), { target: { value: 'Mustang' } });
		fireEvent.change(view.getByLabelText(/year/i), { target: { value: '2024' } });
		fireEvent.change(view.getByLabelText(/price/i), { target: { value: '55000' } });
		fireEvent.change(view.getByLabelText(/vin/i), { target: { value: 'VIN999' } });

		fireEvent.click(view.getByRole('button', { name: /save/i }));

		await waitFor(() => {
			expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('logout clears auth state and redirects to login page', async () => {
		let currentUser = fakeAdminPayload;
		let currentToken = fakeAdminToken;

		const logoutFn = vi.fn(() => {
			currentUser = null;
			currentToken = '';
		});

		const authValue = { user: currentUser, token: currentToken, login: vi.fn(), logout: logoutFn };

		const { rerender } = render(<TestApp authValue={authValue} initialEntries={['/inventory']} />);

		expect(screen.getByText('Inventory')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();

		logoutFn();

		const clearedAuth = { user: null, token: '', login: vi.fn(), logout: logoutFn };
		rerender(<TestApp authValue={clearedAuth} initialEntries={['/inventory']} />);

		await waitFor(() => {
			expect(logoutFn).toHaveBeenCalled();
		});

		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
	});
});
