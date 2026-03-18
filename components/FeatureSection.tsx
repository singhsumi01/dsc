'use client';

import { Shield, Zap, FileText, Users, Clock, CreditCard, Smartphone, Lock } from 'lucide-react';

const features = [
  {
    icon: Smartphone,
    title: 'Video-Based eKYC',
    desc: 'Complete identity verification via live video in under 5 minutes — no physical documents needed, fully compliant with CCA guidelines.',
    color: 'text-[--blue]',
    bg: 'bg-[--blue-light]',
    span: 'lg:col-span-2',
  },
  {
    icon: Zap,
    title: '10-Minute Issuance',
    desc: 'From application submission to certificate in your hands. Our automated pipeline bypasses manual bottlenecks entirely.',
    color: 'text-[--orange]',
    bg: 'bg-orange-50',
    span: '',
  },
  {
    icon: Lock,
    title: 'FIPS 140-2 HSM Security',
    desc: 'Your private keys never leave our Hardware Security Modules. Bank-grade encryption for every certificate issued.',
    color: 'text-[--blue]',
    bg: 'bg-[--blue-light]',
    span: '',
  },
  {
    icon: Shield,
    title: 'CCA Licensed & Compliant',
    desc: 'We are a registered Certifying Authority under the IT Act 2000 — every certificate is legally recognised across all Indian government portals.',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    span: '',
  },
  {
    icon: FileText,
    title: 'All Portal Coverage',
    desc: 'Works on MCA21, Income Tax, GST, EPFO, GeM, DGFT, Tender Portals, and 200+ more government and private platforms.',
    color: 'text-[--green]',
    bg: 'bg-green-50',
    span: '',
  },
  {
    icon: Users,
    title: 'Agent & Partner Portal',
    desc: 'Dedicated dashboard for channel partners. Manage bulk applications, track status, and handle client onboarding effortlessly.',
    color: 'text-[--orange]',
    bg: 'bg-orange-50',
    span: 'lg:col-span-2',
  },
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="section-tag">Why DSCPortal</p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-[--navy] leading-tight mb-4">
            Built for Speed,<br />
            <span className="text-[--blue]">Backed by Trust.</span>
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl">
            We combine cutting-edge technology with regulatory compliance so you can focus on growing your agency — not troubleshooting paperwork.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-auto">
          {features.map(({ icon: Icon, title, desc, color, bg, span }, i) => (
            <div
              key={title}
              className={`card p-8 group flex flex-col gap-4 animate-fade-up ${span}`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-[--navy] mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: '2M+', label: 'Certificates Issued' },
            { num: '15K+', label: 'Active Partners' },
            { num: '200+', label: 'Portals Covered' },
            { num: '99.9%', label: 'System Uptime' },
          ].map(({ num, label }) => (
            <div key={label} className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-display text-3xl font-black text-[--blue] mb-1">{num}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
