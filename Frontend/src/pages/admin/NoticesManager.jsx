import { useState } from 'react';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { createNotice, updateNotice, deleteNotice } from '../../services/api';

function NoticeModal({ notice, onClose, onSave }) {
  const [form, setForm] = useState({
    title: notice?.title || '',
    description: notice?.description || '',
    noticeDate: notice?.noticeDate ? notice.noticeDate.split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (notice) await updateNotice(notice.id, form);
      else await createNotice(form);
      toast.success(notice ? 'Notice updated!' : 'Notice created!');
      onSave();
    } catch { toast.error('Failed to save notice.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        <h3 className="font-bold text-lg text-secondary-800 mb-4">{notice ? 'Edit Notice' : 'Add Notice'}</h3>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Title</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Date</label>
            <input type="date" value={form.noticeDate} onChange={e => setForm(f => ({ ...f, noticeDate: e.target.value }))} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={4} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-secondary-600 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NoticesManager({ notices, loading, onRefresh }) {
  const [modal, setModal] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this notice?')) return;
    try { await deleteNotice(id); toast.success('Deleted.'); onRefresh(); }
    catch { toast.error('Failed to delete.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-secondary-800">Manage Notices</h2>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Notice
        </button>
      </div>
      {loading ? <p className="text-secondary-400">Loading...</p> : notices.length === 0 ? (
        <p className="text-secondary-400 text-center py-12">No notices yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-secondary-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Description</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notices.map(n => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-secondary-800 max-w-xs truncate">{n.title}</td>
                  <td className="px-4 py-3 text-secondary-500 hidden md:table-cell">{new Date(n.noticeDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-secondary-500 hidden lg:table-cell max-w-xs truncate">{n.description}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setModal(n)} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded"><Pencil size={15} /></button>
                      <button onClick={() => handleDelete(n.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && (
        <NoticeModal
          notice={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); onRefresh(); }}
        />
      )}
    </div>
  );
}
