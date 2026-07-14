import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoUrl from '../assets/logo.jpg';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Notices', href: '/#notices' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 bg-black transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logoUrl} alt="Noor Premier School" className="h-10 w-auto" onError={(e) => { e.target.style.display='none'; }} />
            <span className="font-bold text-white text-sm hidden sm:block">Noor Premier School</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="text-white hover:text-primary-500 font-medium text-sm transition-colors">{l.label}</a>
            ))}
            <Link to="/admin" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Admin Login
            </Link>
          </div>

          <button className="md:hidden p-2 text-secondary-700" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-100 px-4 pb-4">
          {navLinks.map(l => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-white hover:text-primary-500 font-medium">{l.label}</a>
          ))}
          <Link to="/admin" onClick={() => setOpen(false)} className="block mt-2 bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
            Admin Login
          </Link>
        </div>
      )}
    </nav>
  );
}
