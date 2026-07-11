import { useEffect, useState } from 'react';
import { getNotices } from '../services/api';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
      <div className="h-3 bg-gray-100 rounded w-full mb-2" />
      <div className="h-3 bg-gray-100 rounded w-5/6" />
    </div>
  );
}

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotices()
      .then(r => setNotices(r.data.slice(0, 8)))
      .catch(() => setNotices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="notices" className="py-20 bg-accent-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-secondary-800 text-center mb-12">Latest Notices</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : notices.length === 0 ? (
          <p className="text-center text-secondary-400 py-12">No notices yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.map(n => (
              <div key={n.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-primary-600 text-lg mb-1 line-clamp-2">{n.title}</h3>
                <p className="text-secondary-400 text-xs mb-3">
                  {new Date(n.noticeDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-secondary-600 text-sm line-clamp-2 leading-relaxed">{n.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
