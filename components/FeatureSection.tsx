import { Shield, Zap, Globe, Lock, Clock, Users } from 'lucide-react';

const features = [
  {
    name: 'RBAC Security',
    description: 'Grant precise access with role-based controls for Admins, Agents, and Clients.',
    icon: Shield,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    name: 'Rapid Applications',
    description: 'Streamlined workflow from application creation to document verification.',
    icon: Zap,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    name: 'Multi-Role Dashboard',
    description: 'Customized views and statistics for every user level in the system.',
    icon: Users,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
  },
  {
    name: 'Secure Storage',
    description: 'All documents are stored securely in Google Drive with encrypted links.',
    icon: Lock,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  },
  {
    name: 'Payment Integration',
    description: 'Supports Razorpay and PayU with automated webhook verification.',
    icon: Globe,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    name: 'Real-time Tracking',
    description: 'Monitor application status at every stage of the lifecycle.',
    icon: Clock,
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  }
];

export default function FeatureSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-indigo-600 font-semibold tracking-wide uppercase text-sm mb-3">Enterprise Grade</h2>
          <p className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Everything you need to manage DSC</p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our platform simplifies the complex process of DSC registration, allowing you to focus on your clients.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={feature.name} 
              className="card-premium p-8 group stagger-item"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className={`${feature.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform group-hover:rotate-3 shadow-sm`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{feature.name}</h3>
              <p className="text-gray-500 font-medium italic leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
