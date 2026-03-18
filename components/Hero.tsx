'use client';

import Link from 'next/link';
import { Shield, Zap, Lock, FileCheck, Globe, ArrowRight, CheckCircle } from 'lucide-react';

const stats = [
  { value: '2M+', label: 'DSCs Issued' },
  { value: '15,000+', label: 'Partner Agents' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '<10 min', label: 'Avg. Issuance' },
];

const dscTypes = [
  {
    icon: '🏛️',
    title: 'Class 3 Individual',
    desc: 'For individuals signing documents, ITR, ROC, EPFO, and government portals.',
    tags: ['Income Tax', 'MCA21', 'EPFO'],
  },
  {
    icon: '🏢',
    title: 'Class 3 Organization',
    desc: 'For companies, firms, and organizations filing on government portals.',
    tags: ['GST', 'Tender', 'ROC'],
  },
  {
    icon: '🌐',
    title: 'DGFT DSC',
    desc: 'Exclusively for importers & exporters on the DGFT portal.',
    tags: ['DGFT', 'Import', 'Export'],
  },
  {
    icon: '📄',
    title: 'Document Signer',
    desc: 'For bulk document signing with automated server-side signing capabilities.',
    tags: ['Bulk', 'API', 'Automated'],
  },
];

export default function Hero() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-bg min-h-[92vh] flex items-center relative">
        <div className="hero-mesh" />

        {/* Orb decorations */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="container relative z-10 pt-24 pb-16">
          <div className="max-w-4xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-[--orange] animate-pulse" />
              <span className="text-xs font-semibold text-blue-100 tracking-wide uppercase">
                India's CCA Licensed Digital Signature Authority
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6 animate-fade-up animate-delay-100">
              Digital Signatures<br />
              <span className="text-gradient">Paperless.</span>{' '}
              <span className="text-white/80">Instant.</span>{' '}
              <span className="text-gradient">Trusted.</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl leading-relaxed mb-10 animate-fade-up animate-delay-200">
              Apply for Class 3, DGFT, and Document Signer DSCs in under 10 minutes. 
              100% paperless process with video-based eKYC — no token required.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-up animate-delay-300">
              <Link href="/signup" className="btn btn-accent btn-pulse !py-4 !px-8 text-base shadow-2xl shadow-orange-500/30">
                Apply for DSC Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="btn !bg-white/10 !border-white/20 !text-white border hover:!bg-white/20 !py-4 !px-8 text-base backdrop-blur-sm">
                Partner Sign In
              </Link>
            </div>

            {/* Trust chips */}
            <div className="mt-12 flex flex-wrap items-center gap-4 animate-fade-up animate-delay-400">
              {[
                { icon: CheckCircle, text: 'CCA Licensed' },
                { icon: Lock, text: 'FIPS 140-2 HSM' },
                { icon: Zap, text: '10-Min Issuance' },
                { icon: Globe, text: 'Pan-India Service' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-1.5 backdrop-blur-sm">
                  <Icon className="w-3.5 h-3.5 text-[--orange]" />
                  <span className="text-xs font-semibold text-blue-100">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 animate-fade-up animate-delay-500">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white/5 backdrop-blur-sm px-8 py-6 text-center hover:bg-white/10 transition-colors">
                <p className="font-display text-3xl font-black text-white mb-1">{value}</p>
                <p className="text-xs font-medium text-blue-200 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DSC TYPES ── */}
      <section id="categories" className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="section-tag justify-center">Certificate Categories</p>
            <h2 className="font-display text-4xl font-black text-[--navy] mb-4 leading-tight">
              Pick the Right DSC for Your Needs
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              All our certificates are issued under the IT Act 2000, recognised across all government portals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {dscTypes.map(({ icon, title, desc, tags }, i) => (
              <div
                key={title}
                className="card p-6 group flex flex-col animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-14 h-14 rounded-xl bg-[--blue-light] flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {icon}
                </div>
                <h3 className="font-display text-lg font-bold text-[--navy] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4">{desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map(tag => (
                    <span key={tag} className="badge badge-blue text-[10px]">{tag}</span>
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
