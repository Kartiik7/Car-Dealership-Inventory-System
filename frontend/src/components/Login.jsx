import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Login failed');
			}

			login(data.user, data.token);
			navigate('/');
		} catch (submitError) {
			setError(submitError.message);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 className="text-xl font-bold text-slate-900">Login</h2>
			<div className="flex flex-col gap-2">
				<label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(event) => setEmail(event.target.value)}
					className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
				/>
			</div>
			<div className="flex flex-col gap-2">
				<label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
				<input
					id="password"
					type="password"
					value={password}
					onChange={(event) => setPassword(event.target.value)}
					className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-900"
				/>
			</div>
			{error ? <p className="text-sm text-red-600">{error}</p> : null}
			<button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 font-medium text-white transition-colors hover:bg-slate-700">
				Login
			</button>
			<p className="text-center text-sm text-slate-600">
				Don't have an account?{' '}
				<Link to="/register" className="font-medium text-slate-900 underline">
					Register
				</Link>
			</p>
		</form>
	);
}
