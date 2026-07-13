import { useEffect, useState } from 'react';
import logoUrl from '../assets/logo.jpg';

export default function Loader({ onDone }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 2000);
    const t2 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white transition-opacity duration-600 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="animate-pulse">
        <img src={logoUrl} alt="Noor Premier School" className="h-28 w-auto mb-6" onError={(e) => { e.target.style.display='none'; }} />
      </div>
      <h1 className="text-2xl font-bold text-primary-500 tracking-wide">Noor Premier School</h1>
      <p className="text-secondary-500 text-sm mt-2">Excellence in Islamic Education</p>
      <div className="mt-6 flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  );
}
