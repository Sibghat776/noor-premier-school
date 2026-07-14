import logoUrl from '../assets/logo.jpg';

export default function About() {
  return (
    <section id="about" className="py-20 bg-accent-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-shrink-0">
            <img src={logoUrl} alt="Noor Premier School Logo" className="h-36 w-auto" onError={(e) => { e.target.style.display='none'; }} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-secondary-800 mb-4">About Noor Premier School</h2>
            <p className="text-secondary-600 mb-3 leading-relaxed">
              Noor Premier School is dedicated to providing a holistic education that blends Islamic values with modern academic excellence. We nurture students to become confident, compassionate, and knowledgeable individuals ready to contribute positively to society.
            </p>
            <p className="text-secondary-600 mb-3 leading-relaxed">
              Our curriculum integrates Quranic teachings, moral development, and contemporary subjects to ensure every student achieves their full potential in both spiritual and academic dimensions.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              We believe in creating a safe, inclusive, and inspiring environment where every child is valued and encouraged to excel.
            </p>
            <div className="mt-4 inline-block bg-primary-50 border border-primary-200 rounded-lg px-4 py-2">
              <p className="text-primary-700 text-sm font-medium">Under The Supervision and with Affiliation of IntellActX</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
