import Link from 'next/link';
import { Check, Shield, Zap, Globe, Lock, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 overflow-hidden hero-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 mb-6">
              Production Ready SaaS
            </span>
            <h1 className="text-6xl lg:text-8xl font-black text-gray-900 mb-8 font-display leading-[1.05] tracking-tighter animate-fade-in-up">
              Scale your DSC <span className="text-indigo-600 block">Registration Agency.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
              The complete platform for Agents and Clients to manage Digital Signature Certificates. 
              Automated workflows, secure document storage, and seamless payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <Link href="/signup" className="btn-primary flex items-center justify-center text-lg px-8 py-5 pulse-glow">
                Start Today Free
                <Zap className="ml-2 h-5 w-5 fill-white" />
              </Link>
              <Link href="/#pricing" className="btn-secondary flex items-center justify-center text-lg px-8 py-5">
                View Pricing
              </Link>
            </div>
            
            <div className="mt-10 flex items-center justify-center lg:justify-start space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                5-min setup
              </div>
            </div>
          </div>
          
          <div className="mt-16 lg:mt-0 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white p-2">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-white rounded-lg w-3/4"></div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-24 bg-indigo-50 rounded-lg border border-indigo-100"></div>
                    <div className="h-24 bg-white rounded-lg border border-gray-100"></div>
                    <div className="h-24 bg-white rounded-lg border border-gray-100"></div>
                  </div>
                  <div className="h-40 bg-white rounded-lg border border-gray-100"></div>
                </div>
              </div>
            </div>
            {/* Abstract shapes */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
