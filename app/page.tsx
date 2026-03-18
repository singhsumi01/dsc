import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeatureSection />
      <PricingSection />

      {/* CTA Banner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl px-8 py-16 md:px-16 text-center relative overflow-hidden">
            {/* Subtle mesh */}
            <div className="absolute inset-0 mesh-grid opacity-20" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
                🚀 Join 15,000+ Partner Agents
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                Start Issuing DSCs Today
              </h2>
              <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                Register as a channel partner and manage client DSC applications through our streamlined portal — zero setup cost.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all shadow-xl shadow-orange-500/30"
                >
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 font-semibold text-base px-8 py-4 rounded-xl transition-all"
                >
                  Login to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
