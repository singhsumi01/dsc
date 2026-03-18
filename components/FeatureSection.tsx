'use client';

import { Shield, Zap, FileText, Users, Lock, Smartphone, Globe, Server } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Video-Based eKYC — Fully Paperless',
    desc: 'Complete your identity verification via a 2-minute live video call — no physical token, no branch visit. Fully compliant with CCA guidelines.',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    wide: true,
  },
  {
    icon: Zap,
    title: '10-Minute Certificate Issuance',
    desc: 'Our automated pipeline goes from application submitted to certificate issued in under 10 minutes — no manual bottlenecks.',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    wide: false,
  },
  {
    icon: Lock,
    title: 'FIPS 140-2 HSM Security',
    desc: 'Private keys never leave Hardware Security Modules. Bank-grade encryption for every certificate.',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    wide: false,
  },
  {
    icon: Shield,
    title: 'CCA Licensed & IT Act 2000 Compliant',
    desc: 'We are a registered Certifying Authority under the IT Act 2000. Every DSC is legally valid across all Indian government portals.',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    wide: false,
  },
  {
    icon: Globe,
    title: '200+ Portal Coverage',
    desc: 'Works on Income Tax, MCA21, GST, EPFO, GeM, DGFT, Tender portals, and 195+ more platforms.',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    wide: false,
  },
  {
    icon: Users,
    title: 'Agent & Partner Management Portal',
    desc: 'Dedicated dashboards for channel partners. Bulk applications, client onboarding, real-time tracking — all in one place.',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    wide: true,
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-[0.15em] mb-4">
            <span className="w-5 h-0.5 bg-orange-500 rounded-full" />
            Why DSCPortal
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
            Built for Speed.<br />
            <span className="text-blue-600">Backed by Trust.</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            We combine cutting-edge automation with regulatory compliance so you can grow your DSC agency — not fight paperwork.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, iconBg, iconColor, wide }, i) => (
            <div
              key={title}
              className={`bg-white border border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 hover:-translate-y-1 transition-all duration-300 group anim-fade-up ${wide ? 'lg:col-span-2' : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${iconColor}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Trust strip */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '2M+', label: 'Certificates Issued', color: 'bg-blue-50 text-blue-700' },
            { num: '15K+', label: 'Active Partners', color: 'bg-orange-50 text-orange-600' },
            { num: '200+', label: 'Portals Covered', color: 'bg-green-50 text-green-700' },
            { num: '99.9%', label: 'System Uptime', color: 'bg-purple-50 text-purple-700' },
          ].map(({ num, label, color }) => (
            <div key={label} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-100 transition-colors">
              <p className={`font-display text-3xl font-extrabold mb-1 ${color.split(' ')[1]}`}>{num}</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
