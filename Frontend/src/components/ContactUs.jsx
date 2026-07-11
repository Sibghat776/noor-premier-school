import { MapPin, Phone, Mail } from 'lucide-react';
import { InstagramIcon, FacebookIcon, LinkedinIcon } from './SocialIcons';

export default function ContactUs() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-secondary-800 text-center mb-12">Contact Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-primary-50 rounded-xl">
            <MapPin size={32} className="text-primary-500 mx-auto mb-3" />
            <h3 className="font-bold text-secondary-800 mb-2">Address</h3>
            <p className="text-secondary-600 text-sm">Noor Premier School<br />Pakistan</p>
          </div>
          <div className="text-center p-6 bg-primary-50 rounded-xl">
            <Phone size={32} className="text-primary-500 mx-auto mb-3" />
            <h3 className="font-bold text-secondary-800 mb-2">Phone / WhatsApp</h3>
            <a href="tel:+923359933339" className="text-primary-600 hover:underline text-sm">+92 335-9933339</a>
          </div>
          <div className="text-center p-6 bg-primary-50 rounded-xl">
            <Mail size={32} className="text-primary-500 mx-auto mb-3" />
            <h3 className="font-bold text-secondary-800 mb-2">Email</h3>
            <p className="text-secondary-600 text-sm">info@noorpremierschool.com</p>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          <a href="https://instagram.com/noorpremierschool" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors">
            <InstagramIcon size={22} /> <span className="text-sm">Instagram</span>
          </a>
          <a href="https://facebook.com/noorpremierschool" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors">
            <FacebookIcon size={22} /> <span className="text-sm">Facebook</span>
          </a>
          <a href="https://linkedin.com/company/noorpremierschool" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors">
            <LinkedinIcon size={22} /> <span className="text-sm">LinkedIn</span>
          </a>
          <a href="https://wa.me/923359933339" target="_blank" rel="noreferrer"
            className="flex items-center gap-2 text-secondary-600 hover:text-primary-500 transition-colors">
            <Phone size={22} /> <span className="text-sm">WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
