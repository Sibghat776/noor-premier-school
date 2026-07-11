import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from './SocialIcons';
import logoUrl from '../assets/logo.svg';

const quickLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/#about' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Notices', href: '/#notices' },
  { label: 'Contact', href: '/#contact' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <img src={logoUrl} alt="Noor Premier School" className="h-14 w-auto mb-3 brightness-0 invert" onError={(e) => { e.target.style.display='none'; }} />
            <p className="font-bold text-lg">Noor Premier School</p>
            <p className="text-gray-400 text-sm mt-1">Excellence in Islamic Education</p>
            <p className="text-gray-500 text-xs mt-2">Under The Supervision and with Affiliation of IntellActX</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.label}>
                  <a href={l.href} className="text-gray-400 hover:text-primary-400 text-sm transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Follow Us</h4>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com/noorpremierschool" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                <InstagramIcon size={18} /> @noorpremierschool
              </a>
              <a href="https://facebook.com/noorpremierschool" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                <FacebookIcon size={18} /> /noorpremierschool
              </a>
              <a href="https://linkedin.com/company/noorpremierschool" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                <LinkedinIcon size={18} /> /noorpremierschool
              </a>
              <a href="https://wa.me/923359933339" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-primary-400 transition-colors text-sm">
                <Phone size={18} /> +92 335-9933339
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-700 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Noor Premier School. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
