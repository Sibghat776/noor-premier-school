import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-accent-light text-center px-4">
      <h1 className="text-8xl font-bold text-primary-500 mb-4">404</h1>
      <p className="text-xl text-secondary-700 mb-6">Page not found.</p>
      <Link to="/" className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Go Home
      </Link>
    </div>
  );
}
