import Link from 'next/link';
import { Shield } from 'lucide-react';

const links = {
  Services: [
    { label: 'Class 3 Individual DSC', href: '/#categories' },
    { label: 'Class 3 Organization DSC', href: '/#categories' },
    { label: 'DGFT DSC', href: '/#categories' },
    { label: 'Document Signer DSC', href: '/#categories' },
  ],
  Partners: [
    { label: 'Become a Partner', href: '/signup' },
    { label: 'Partner Login', href: '/login' },
    { label: 'Pricing Plans', href: '/#pricing' },
    { label: 'Partner FAQs', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Track DSC Status', href: '#' },
    { label: 'Token Drivers', href: '#' },
    { label: 'CCA Guidelines', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'CA License Details', href: '#' },
    { label: 'IT Act Compliance', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer id="contact" className="bg-gray-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">DSC<span className="text-orange-400">Portal</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              India's trusted Certifying Authority for Class 3, DGFT, and Document Signer DSCs. CCA Licensed — IT Act 2000 Compliant.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-800 text-gray-400 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">CCA Licensed</span>
              <span className="bg-gray-800 text-gray-400 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">FIPS 140-2</span>
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="text-white font-semibold text-sm mb-4">{section}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} DSCPortal. All rights reserved. Licensed under the IT Act 2000.
          </p>
          <p className="text-xs text-gray-700">Built with Next.js · Secured by Google Cloud</p>
        </div>
      </div>
    </footer>
  );
}
