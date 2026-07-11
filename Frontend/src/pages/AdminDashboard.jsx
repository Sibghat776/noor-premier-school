import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AdminNavbar from '../components/AdminNavbar';
import { useAuth } from '../hooks/useAuth';
import { getNotices, getAdmissions } from '../services/api';
import NoticesManager from './admin/NoticesManager';
import AdmissionsViewer from './admin/AdmissionsViewer';
import api from '../services/api';

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error('Passwords do not match.');
    if (form.newPassword.length < 8) return toast.error('New password must be at least 8 characters.');
    setSaving(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      localStorage.setItem('passwordChanged', 'true');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <h3 className="font-bold text-lg text-red-700 mb-1">⚠️ Change Default Password</h3>
        <p className="text-sm text-secondary-500 mb-4">You are using the default password. Change it now before proceeding.</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Current Password</label>
            <input type="password" value={form.currentPassword} onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">New Password</label>
            <input type="password" value={form.newPassword} onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} required minLength={8} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Confirm New Password</label>
            <input type="password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-secondary-600 border border-gray-300 rounded-lg hover:bg-gray-50">Skip for now</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60">{saving ? 'Saving...' : 'Change Password'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [tab, setTab] = useState('notices');
  const [notices, setNotices] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    const changed = localStorage.getItem('passwordChanged');
    if (changed === 'false') setShowPasswordModal(true);
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [n, a] = await Promise.all([getNotices(), getAdmissions()]);
      setNotices(n.data);
      setAdmissions(a.data);
    } catch { toast.error('Failed to load data.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = () => { logout(); navigate('/admin'); };

  return (
    <div className="min-h-screen bg-accent-light">
      <AdminNavbar onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {['notices', 'admissions'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary-500 text-white' : 'bg-white text-secondary-600 hover:bg-primary-50 border border-gray-200'}`}>
              {t === 'notices' ? 'Notices Manager' : 'Admissions Manager'}
            </button>
          ))}
        </div>
        {tab === 'notices' && <NoticesManager notices={notices} loading={loading} onRefresh={fetchAll} />}
        {tab === 'admissions' && <AdmissionsViewer admissions={admissions} loading={loading} onRefresh={fetchAll} />}
      </div>
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => {
          localStorage.setItem('passwordChanged', 'true');
          setShowPasswordModal(false);
        }} />
      )}
    </div>
  );
}
