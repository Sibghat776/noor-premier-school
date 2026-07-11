import { Heart, BookOpen, Users, Sparkles } from 'lucide-react';

const cards = [
  { icon: Heart, title: 'Islamic Values', desc: 'Rooted in Quranic principles and moral excellence.' },
  { icon: BookOpen, title: 'Modern Education', desc: 'Contemporary curriculum aligned with global standards.' },
  { icon: Users, title: 'Experienced Faculty', desc: 'Dedicated teachers committed to student success.' },
  { icon: Sparkles, title: 'Holistic Development', desc: 'Nurturing mind, body, and spirit in every student.' },
];

export default function Highlights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-secondary-800 text-center mb-12">Why Choose Noor Premier School?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-accent-light rounded-xl p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-100 rounded-full mb-4">
                <Icon size={28} className="text-primary-500" />
              </div>
              <h3 className="font-bold text-secondary-800 text-lg mb-2">{title}</h3>
              <p className="text-secondary-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
