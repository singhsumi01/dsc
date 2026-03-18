'use client';

import { useRouter } from 'next/navigation';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    id: 'individual',
    name: 'Individual',
    tagline: 'For solo applicants',
    price: '999',
    description: 'Perfect for individuals needing a single DSC for income tax, MCA, or government portal filings.',
    features: ['1 DSC Registration', 'Class 3 Individual', 'Video eKYC Included', 'Email Support', '1-Year Validity'],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'agent-pro',
    name: 'Agent Pro',
    tagline: 'For growing agencies',
    price: '4,999',
    description: 'Manage unlimited client applications with access to all DSC categories and priority support.',
    features: [
      'Unlimited Clients',
      'All DSC Types (Class 3, DGFT, Doc Signer)',
      'Priority eKYC Processing',
      'Partner Dashboard',
      'Bulk Application Tools',
      'Priority Support',
      'Monthly Reports',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'For large operators',
    price: '19,999',
    description: 'Custom solutions for banks, CA offices, and enterprises managing thousands of DSCs monthly.',
    features: [
      'Everything in Agent Pro',
      'Custom RBAC & Team Roles',
      'API Integration',
      'Dedicated Account Manager',
      'Volume Discounts',
      '99.9% SLA Support',
      'White-Label Option',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  const router = useRouter();

  const handlePlanClick = (planId: string) => {
    if (planId === 'enterprise') {
      window.location.href = 'mailto:enterprise@dscportal.in?subject=Enterprise Plan Inquiry';
    } else {
      router.push(`/signup?plan=${planId}`);
    }
  };

  return (
    <section id="pricing" className="py-24 bg-[#0B1C3D] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-[0.15em] mb-4">
            <span className="w-5 h-0.5 bg-orange-400 rounded-full" />
            Flexible Plans
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Transparent Pricing for<br />
            <span className="text-orange-400">Every Agency Size</span>
          </h2>
          <p className="text-blue-200/80 text-lg leading-relaxed">
            No hidden fees. No per-transaction charges. One simple annual license.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl p-7 border backdrop-blur-sm transition-transform hover:scale-[1.015] duration-300 ${
                plan.popular
                  ? 'bg-white/10 border-orange-400/40 shadow-2xl shadow-orange-500/10 scale-[1.03]'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest px-5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-orange-500/30">
                  <Zap className="w-3 h-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-7">
                <p className="text-blue-300/70 text-[10px] font-bold uppercase tracking-widest mb-1">{plan.tagline}</p>
                <h3 className="font-display text-2xl font-extrabold text-white mb-2">{plan.name}</h3>
                <p className="text-blue-200/60 text-sm leading-relaxed">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="pb-7 mb-7 border-b border-white/10">
                <div className="flex items-baseline gap-1">
                  <span className="text-blue-300 text-lg font-medium">₹</span>
                  <span className="font-display text-5xl font-black text-white">{plan.price}</span>
                </div>
                <p className="text-[10px] text-blue-300/50 font-semibold uppercase tracking-widest mt-1">per year</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-blue-100/90">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan.id)}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  plan.popular
                    ? 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white shadow-xl shadow-orange-500/25'
                    : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-blue-300/40 text-sm mt-10">
          All plans include a 7-day free trial · No credit card required to start
        </p>
      </div>
    </section>
  );
}
