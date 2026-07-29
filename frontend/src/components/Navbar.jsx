import { Link } from 'react-router-dom';

export default function Navbar() {
	return (
		<nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
			<Link to="/" className="text-xl font-bold tracking-tight text-slate-900">
				CarDeal
			</Link>
			<div className="flex items-center gap-6 text-sm font-medium text-slate-700">
				<Link to="/inventory" className="transition-colors hover:text-slate-900">
					Inventory
				</Link>
				<Link to="/login" className="transition-colors hover:text-slate-900">
					Login
				</Link>
				<Link to="/register" className="transition-colors hover:text-slate-900">
					Register
				</Link>
			</div>
		</nav>
	);
}