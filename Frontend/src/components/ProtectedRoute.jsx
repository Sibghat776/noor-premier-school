import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');
  if (!token) return <Navigate to="/admin" replace />;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('adminToken');
      return <Navigate to="/admin" replace />;
    }
  } catch {
    return <Navigate to="/admin" replace />;
  }
  return children;
}
