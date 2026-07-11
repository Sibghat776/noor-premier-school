import { Link } from 'react-router-dom';
import { LogOut, LayoutDashboard } from 'lucide-react';
import logoUrl from '../assets/logo.svg';

export default function AdminNavbar({ onLogout }) {
  return (
    <nav className="bg-secondary-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <img src={logoUrl} alt="Logo" className="h-8 w-auto brightness-0 invert" onError={(e) => { e.target.style.display='none'; }} />
        <span className="font-bold text-sm">Admin Panel — Noor Premier School</span>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-300 hover:text-white text-sm flex items-center gap-1">
          <LayoutDashboard size={16} /> View Site
        </Link>
        <button onClick={onLogout} className="flex items-center gap-1 text-gray-300 hover:text-red-400 text-sm transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
}
