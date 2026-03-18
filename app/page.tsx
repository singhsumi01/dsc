import Hero from '@/components/Hero';
import FeatureSection from '@/components/FeatureSection';
import PricingSection from '@/components/PricingSection';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'DSCPortal — Digital Signature Certificates Paperless & Instant | CCA Licensed CA',
  description: 'Apply for Class 3, DGFT, and Document Signer DSCs in under 10 minutes. 100% paperless video-based eKYC. CCA Licensed Certifying Authority under IT Act 2000.',
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <FeatureSection />
      <PricingSection />

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="bg-gradient-to-br from-[--blue] to-[--blue-dark] rounded-3xl px-8 py-16 md:px-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30" />
            <div className="relative z-10">
              <span className="badge badge-orange mb-6 mx-auto">
                🚀 Join 15,000+ Partner Agents
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Start Issuing DSCs Today
              </h2>
              <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10">
                Register as a channel partner and start managing client DSC applications through our streamlined portal — zero setup cost.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="btn btn-accent !py-4 !px-8 text-base shadow-xl shadow-orange-500/30">
                  Become a Partner
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/login" className="btn !bg-white/15 !text-white !border-white/20 border hover:!bg-white/25 !py-4 !px-8 text-base">
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
