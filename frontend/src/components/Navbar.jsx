import { Link } from 'react-router-dom';

export default function Navbar({ isAuthenticated = false, onLogout }) {
	return (
		<nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
			<Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
				Car Dealership Inventory
			</Link>
			<div className="flex items-center gap-4 text-sm font-medium text-slate-700">
				{isAuthenticated ? (
					<button type="button" onClick={onLogout} className="rounded-lg bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-slate-700">
						Logout
					</button>
				) : (
					<Link to="/login" className="rounded-lg bg-slate-900 px-4 py-2 text-white transition-colors hover:bg-slate-700">
						Login
					</Link>
				)}
			</div>
		</nav>
	);
}