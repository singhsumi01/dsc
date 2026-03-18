'use client';

import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Individual',
    price: '999',
    description: 'Perfect for single DSC registration.',
    features: ['1 User License', 'Basic Categories', 'Document Verification', '7-day History']
  },
  {
    name: 'Agent Pro',
    price: '4999',
    description: 'Ideal for small agencies handling multiple clients.',
    features: ['Unlimited Clients', 'All DSC Categories', 'Priority Support', 'Full Payment History', 'Drive Sync'],
    popular: true
  },
  {
    name: 'Enterprise',
    price: '19999',
    description: 'Custom solutions for large scale operations.',
    features: ['Custom RBAC', 'API Access', 'Dedicated Manager', 'Volume Discounts', 'SLA Support']
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-600 font-semibold text-sm uppercase tracking-wider mb-2">Transparent Pricing</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Simple plans for everyone</p>
          <p className="text-lg text-gray-600">Choose the license that best fits your business needs.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative p-8 rounded-3xl bg-white border ${plan.popular ? 'border-indigo-600 ring-4 ring-indigo-50' : 'border-gray-100'} shadow-sm flex flex-col`}>
              {plan.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">₹{plan.price}</span>
                  <span className="ml-1 text-gray-500">/year</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center text-gray-600 text-sm">
                    <Check className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}>
                {plan.popular ? 'Start Pro Trial' : 'Choose Plan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
