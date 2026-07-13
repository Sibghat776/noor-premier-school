import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

// Images ko directly import karein (Apne actual paths ke hisaab se adjust kar lein agar zaroorat ho)
import img1 from '../assets/images/Image 1.jpeg';
import img2 from '../assets/images/Image 2.jpeg';
import img3 from '../assets/images/Image 3.jpeg';
import img4 from '../assets/images/Image 4.jpeg';
import img5 from '../assets/images/Image 5.jpeg';

const slides = [
  { img: img1, label: 'Nurturing Young Minds' },
  { img: img2, label: 'Excellence in Education' },
  { img: img3, label: 'Islamic Values & Modern Learning' },
  { img: img4, label: 'Building Future Leaders' },
  { img: img5, label: 'A Community of Learners' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {slides.map((s, i) => (
        <img
          key={i}
          src={s.img}
          alt={`School Slide ${i + 1}`}
          // w-full h-full aur object-cover images ko screen par properly fit karenge
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${i === current ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
        />
      ))}

      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-primary-300 text-sm font-medium tracking-widest uppercase mb-4">
          Under The Supervision and with Affiliation of IntellActX
        </p>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          Noor Premier School
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-2 font-light">
          {slides[current].label}
        </p>
        <p className="text-gray-300 mb-10 text-lg">Excellence in Islamic Education</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/admissions" className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg">
            Apply for Admission
          </Link>
          <a href="#about" className="bg-white hover:bg-gray-100 text-primary-600 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:scale-105 shadow-lg">
            Learn More
          </a>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-primary-400 w-6' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce z-10">
        <ChevronDown size={32} />
      </a>
    </section>
  );
}