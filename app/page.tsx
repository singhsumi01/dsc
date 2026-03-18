import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import PricingSection from '@/components/PricingSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeatureSection />
      
      {/* Category Section (Dynamic Cards) */}
      <section id="categories" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                DSC Categories for every need
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                From personal use to bulk enterprise solutions, we cover all certificate types.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-8">
            {['Class 3 Individual', 'Class 3 Organization', 'DGFT', 'Document Signer'].map((cat, i) => (
              <div key={cat} className="group relative">
                <div className="relative h-64 w-full overflow-hidden rounded-3xl bg-gray-100 sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center text-indigo-100 italic font-black text-6xl select-none">
                    0{i+1}
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">
                  <a href="#">
                    <span className="absolute inset-0" />
                    {cat}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">Fast processing within 24 hours.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      
      {/* CTA Section */}
      <section className="bg-indigo-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
          <div className="relative z-10 text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mb-6 sm:text-4xl">
                Ready to simplify your registration?
              </h2>
              <p className="text-lg text-indigo-100 mb-10 max-w-xl">
                Join 500+ agents already using our platform to handle thousands of applications daily.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-50 transition-colors">
                  Get Started for Free
                </a>
                <a href="/login" className="bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-800 transition-colors">
                  Agent Login
                </a>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 hidden lg:block">
              {/* Abstract decorative element */}
              <div className="grid grid-cols-2 gap-4">
                <div className="h-40 bg-indigo-500/30 rounded-3xl"></div>
                <div className="h-40 bg-white/10 rounded-3xl backdrop-blur-sm transform translate-y-8"></div>
                <div className="h-40 bg-white/10 rounded-3xl backdrop-blur-sm -translate-y-8"></div>
                <div className="h-40 bg-indigo-500/30 rounded-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
