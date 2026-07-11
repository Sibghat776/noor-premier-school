import { useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { updateAdmissionStatus, deleteAdmission } from '../../services/api';

function AdmissionModal({ admission, onClose }) {
  const fields = [
    ['Student Name', admission.studentName],
    ['Father Name', admission.fatherName],
    ['CNIC / B-Form', admission.cnicOrBForm],
    ['Class Applying', admission.classApplying],
    ['Contact', admission.contactNumber],
    ['Email', admission.email],
    ['Address', admission.address],
    ['Status', admission.status],
    ['Applied On', new Date(admission.createdAt).toLocaleString()],
  ];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-xl">
        <h3 className="font-bold text-lg text-secondary-800 mb-4">Admission Details</h3>
        <dl className="space-y-2">
          {fields.map(([k, v]) => (
            <div key={k} className="flex gap-2 text-sm">
              <dt className="font-medium text-secondary-600 w-36 flex-shrink-0">{k}:</dt>
              <dd className="text-secondary-800 capitalize">{v}</dd>
            </div>
          ))}
        </dl>
        <button onClick={onClose} className="mt-6 w-full py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600">Close</button>
      </div>
    </div>
  );
}

export default function AdmissionsViewer({ admissions, loading, onRefresh }) {
  const [modal, setModal] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this admission?')) return;
    try { await deleteAdmission(id); toast.success('Deleted.'); onRefresh(); }
    catch { toast.error('Failed to delete.'); }
  };

  const handleToggleStatus = async (id, current) => {
    const next = current === 'pending' ? 'reviewed' : 'pending';
    try { await updateAdmissionStatus(id, next); onRefresh(); }
    catch { toast.error('Failed to update status.'); }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-secondary-800 mb-6">Admissions Received</h2>
      {loading ? <p className="text-secondary-400">Loading...</p> : admissions.length === 0 ? (
        <p className="text-secondary-400 text-center py-12">No admissions yet.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-secondary-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Student</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Class</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Contact</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admissions.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-secondary-800">{a.studentName}</td>
                  <td className="px-4 py-3 text-secondary-500 hidden md:table-cell">{a.classApplying}</td>
                  <td className="px-4 py-3 text-secondary-500 hidden lg:table-cell">{a.contactNumber}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'reviewed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.status === 'reviewed' ? <CheckCircle size={12} /> : <Clock size={12} />}
                      {a.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setModal(a)} className="p-1.5 text-primary-500 hover:bg-primary-50 rounded" title="View"><Eye size={15} /></button>
                      <button onClick={() => handleToggleStatus(a.id, a.status)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Toggle Status"><CheckCircle size={15} /></button>
                      <button onClick={() => handleDelete(a.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" title="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {modal && <AdmissionModal admission={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
