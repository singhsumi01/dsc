'use client';

import Link from 'next/link';
import { Shield, Zap, Lock, Globe, CheckCircle, ArrowRight } from 'lucide-react';

const stats = [
  { value: '2M+', label: 'DSCs Issued' },
  { value: '15,000+', label: 'Partner Agents' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<10 min', label: 'Avg. Issuance' },
];

const dscTypes = [
  {
    emoji: '🏛️',
    title: 'Class 3 Individual',
    desc: 'For ITR, MCA21, ROC, EPFO, GeM, and all government sign-in portals.',
    tags: ['Income Tax', 'MCA21', 'EPFO', 'GeM'],
  },
  {
    emoji: '🏢',
    title: 'Class 3 Organization',
    desc: 'For companies and firms signing documents on government & private portals.',
    tags: ['GST', 'Tender', 'ROC', 'GeM'],
  },
  {
    emoji: '🌐',
    title: 'DGFT DSC',
    desc: 'Dedicated for importers & exporters transacting on the DGFT portal.',
    tags: ['DGFT', 'Import', 'Export'],
  },
  {
    emoji: '📄',
    title: 'Document Signer',
    desc: 'Server-side automated bulk document signing with API access.',
    tags: ['Bulk Sign', 'API', 'Automated'],
  },
];

export default function Hero() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen bg-gradient-to-br from-[#0B1C3D] via-[#0F2860] to-[#1251DB] flex items-center overflow-hidden">
        {/* Grid mesh */}
        <div className="absolute inset-0 mesh-grid" />
        {/* Glows */}
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20 w-full">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-9 anim-fade-up">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-semibold text-blue-100 tracking-widest uppercase">
              India's CCA Licensed Certifying Authority
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-[76px] font-extrabold text-white leading-[1.05] tracking-tight mb-6 anim-fade-up delay-1 max-w-4xl">
            Digital Signatures.<br />
            <span className="text-orange-400">Paperless.</span>{' '}
            <span className="text-blue-200">Instant.</span>{' '}
            <span className="text-orange-400">Trusted.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-blue-100/90 max-w-2xl leading-relaxed mb-10 anim-fade-up delay-2">
            Apply for Class 3, DGFT, and Document Signer DSCs in under 10 minutes.
            100% paperless with video-based eKYC — no token required at Apply stage.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-14 anim-fade-up delay-3">
            <Link
              href="/signup"
              className="btn-pulse inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all shadow-2xl shadow-orange-500/30"
            >
              Apply for DSC Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold text-base px-8 py-4 rounded-xl transition-all backdrop-blur-sm"
            >
              Partner Sign In
            </Link>
          </div>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-3 anim-fade-up delay-4">
            {[
              { icon: CheckCircle, text: 'CCA Licensed CA' },
              { icon: Lock, text: 'FIPS 140-2 HSM' },
              { icon: Zap, text: '10-Min Issuance' },
              { icon: Globe, text: 'Pan-India Service' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 bg-white/10 border border-white/15 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Icon className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-semibold text-blue-100">{text}</span>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 border border-white/10 rounded-2xl overflow-hidden anim-fade-up delay-5">
            {stats.map(({ value, label }, i) => (
              <div
                key={label}
                className={`bg-white/5 hover:bg-white/10 transition-colors px-8 py-6 text-center ${i < stats.length - 1 ? 'border-r border-white/10' : ''}`}
              >
                <p className="font-display text-3xl font-extrabold text-white mb-1">{value}</p>
                <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── DSC CATEGORIES ─── */}
      <section id="categories" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-[0.15em] mb-4">
              <span className="w-5 h-0.5 bg-orange-500 rounded-full" />
              Certificate Categories
            </div>
            <h2 className="font-display text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              Pick the Right DSC for Your Needs
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              All certificates issued under IT Act 2000, recognised across all Indian government portals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {dscTypes.map(({ emoji, title, desc, tags }, i) => (
              <div
                key={title}
                className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 hover:-translate-y-1 transition-all duration-300 flex flex-col group anim-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-14 h-14 bg-blue-50 group-hover:bg-blue-600 rounded-xl flex items-center justify-center text-3xl mb-5 transition-all duration-300">
                  {emoji}
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span key={tag} className="bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
