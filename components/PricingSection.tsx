'use client';

import { useRouter } from 'next/navigation';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    tagline: 'Perfect for solo applicants',
    price: '999',
    period: 'per year',
    description: 'Ideal for individuals needing a single DSC for government portals, income tax, or MCA filings.',
    features: [
      '1 DSC Registration',
      'Class 3 Individual',
      'Video eKYC Included',
      'Basic Support',
      '1-Year Validity',
    ],
    cta: 'Get Started',
    popular: false,
    color: 'border-gray-200',
  },
  {
    id: 'agent-pro',
    name: 'Agent Pro',
    tagline: 'For growing DSC agencies',
    price: '4,999',
    period: 'per year',
    description: 'Manage unlimited client applications with full access to all DSC categories and priority support.',
    features: [
      'Unlimited Client Applications',
      'All DSC Categories (Class 3, DGFT, Doc Signer)',
      'Priority eKYC Processing',
      'Dedicated Partner Dashboard',
      'Bulk Application Tools',
      'Priority Phone & Chat Support',
      'Monthly Statement Reports',
    ],
    cta: 'Start Free Trial',
    popular: true,
    color: 'border-[--blue]',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large-scale operations',
    price: '19,999',
    period: 'per year',
    description: 'Custom solutions for banks, enterprises, and large CA offices managing thousands of DSCs monthly.',
    features: [
      'Everything in Agent Pro',
      'Custom RBAC & Team Roles',
      'API Integration Access',
      'Dedicated Account Manager',
      'Volume-Based Discounts',
      'SLA-Backed Support (99.9%)',
      'White-Label Options',
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'border-gray-200',
  },
];

export default function PricingSection() {
  const router = useRouter();

  const handlePlanClick = (planId: string) => {
    if (planId === 'enterprise') {
      // Scroll to contact or open email
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = 'mailto:enterprise@dscportal.in';
      }
    } else {
      router.push(`/signup?plan=${planId}`);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[--navy] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[--navy] via-[#0D2550] to-[--navy]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />

      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-tag justify-center !text-blue-300">
            Flexible Plans
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Transparent Pricing for<br />
            <span className="text-gradient">Every Agency Size</span>
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            No hidden fees. No per-transaction charges. Just a simple annual license that grows with your business.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white/5 border ${
                plan.popular
                  ? 'border-[--orange] bg-white/10 scale-105 shadow-2xl shadow-orange-500/20'
                  : 'border-white/10'
              } rounded-2xl p-8 backdrop-blur-sm flex flex-col transition-transform hover:scale-[1.02] duration-300`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[--orange] text-white text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <p className="text-blue-300 text-xs font-bold uppercase tracking-widest mb-1">{plan.tagline}</p>
                <h3 className="font-display text-2xl font-black text-white mb-1">{plan.name}</h3>
                <p className="text-blue-200/70 text-sm leading-relaxed h-16">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8 pb-8 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-blue-300 text-lg font-medium">₹</span>
                  <span className="font-display text-5xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-blue-300/60 text-xs font-medium uppercase tracking-wider mt-1">{plan.period}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-blue-100">
                    <Check className="w-4 h-4 text-[--green] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => handlePlanClick(plan.id)}
                className={`btn w-full justify-center text-sm font-bold ${
                  plan.popular
                    ? 'btn-accent shadow-xl shadow-orange-500/30'
                    : 'btn !bg-white/10 !text-white !border-white/20 border hover:!bg-white/20'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-blue-300/60 text-sm mt-10">
          All plans include a 7-day free trial · No credit card required to start
        </p>
      </div>
    </section>
  );
}
