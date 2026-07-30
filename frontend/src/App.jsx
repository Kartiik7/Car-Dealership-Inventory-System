import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import CarList from './components/CarList';
import CarModal from './components/CarModal';
import { getCars, addCar, updateCar } from './services/api';

function ConnectedNavbar() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	return <Navbar isAuthenticated={Boolean(user)} onLogout={handleLogout} />;
}

function InventoryPage() {
	const [cars, setCars] = useState([]);

	const fetchCars = () => {
		getCars()
			.then((response) => setCars(response.data))
			.catch(() => setCars([]));
	};

	useEffect(() => {
		fetchCars();
	}, []);

	return (
		<div className="mx-auto max-w-6xl px-6 py-8">
			<h1 className="mb-6 text-2xl font-bold text-slate-900">Inventory</h1>
			<CarList cars={cars} onRefresh={fetchCars} />
		</div>
	);
}

function AppRoutes() {
	return (
		<>
			<ConnectedNavbar />
			<Routes>
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<InventoryPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</AuthProvider>
	);
}
