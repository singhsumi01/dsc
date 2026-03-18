'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Loader2, 
  Shield, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  FileBadge
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import InputField from '@/components/InputField';
import FileUploader from '@/components/FileUploader';

const steps = [
  { id: 1, name: 'Service Type', desc: 'Select DSC category' },
  { id: 2, name: 'Personal Details', desc: 'Enter basic info' },
  { id: 3, name: 'Documents', desc: 'Upload ID proofs' },
  { id: 4, name: 'Review & Pay', desc: 'Finalize processing' }
];

export default function NewApplicationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    dscType: '',
    planTier: '',
    price: 0,
    fullName: '',
    email: '',
    phone: '',
    address: '',
    aadhaarFile: null,
    panFile: null,
    photoFile: null
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [pricing, setPricing] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const router = useRouter();
  const token = useAuthStore(state => state.token);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, priceRes] = await Promise.all([
          apiRequest('categories/list', {}, token),
          apiRequest('pricing/list', {}, token)
        ]);
        setCategories(catRes.data || []);
        setPricing(priceRes.data || []);
      } catch (err) {
        console.error('Failed to fetch categories/pricing', err);
      } finally {
        setLoadingData(false);
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const selectCategory = (type: string) => {
    setFormData({ ...formData, dscType: type });
  };

  const selectPlan = (tier: string) => {
    const selectedPrice = pricing.find(p => p.TierName === tier && p.Category === formData.dscType)?.Price || 0;
    setFormData({ ...formData, planTier: tier, price: selectedPrice });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('application/create', formData, token);
      router.push(`/dashboard/payments/checkout?appId=${res.applicationId}&amount=${formData.price}`);
    } catch (err) {
      alert('Failed to create application. Check network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">New Application</h1>
        <p className="text-gray-500 mt-1 font-medium italic">Complete the wizard to register your Digital Signature Certificate.</p>
      </div>

      {/* Stepper */}
      <nav className="mb-16">
        <ul className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 -z-10"></div>
          {steps.map((step) => (
            <li key={step.id} className="relative flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-gray-50 shadow-sm transition-all ${
                currentStep >= step.id ? 'bg-indigo-600 text-white scale-110' : 'bg-white text-gray-400'
              }`}>
                {currentStep > step.id ? <CheckCircle className="h-6 w-6" /> : <span className="font-black text-lg">{step.id}</span>}
              </div>
              <div className="absolute -bottom-10 whitespace-nowrap text-center">
                <p className={`text-xs font-black uppercase tracking-widest ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {step.name}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-2xl shadow-indigo-50 mt-20 relative overflow-hidden">
        {/* Step 1: DSC Type */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold font-display text-gray-900">Which DSC do you need?</h2>
            {loadingData ? (
              <div className="py-20 text-center animate-pulse text-gray-400 font-bold tracking-widest italic uppercase">Fetching available categories...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map(cat => (
                    <button
                      key={cat.CategoryName}
                      onClick={() => selectCategory(cat.CategoryName)}
                      className={`p-6 text-left rounded-2xl border-2 transition-all group ${
                        formData.dscType === cat.CategoryName ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-50 hover:border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <FileBadge className={`h-8 w-8 mb-4 transition-colors ${formData.dscType === cat.CategoryName ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-400'}`} />
                      <p className="font-bold text-gray-900">{cat.CategoryName}</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{cat.Description}</p>
                    </button>
                  ))}
                </div>
                
                {formData.dscType && (
                  <div className="pt-8 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Choose a Plan</h3>
                    <div className="flex gap-4">
                      {pricing.filter(p => p.Category === formData.dscType).map(plan => (
                        <button
                          key={plan.TierName}
                          onClick={() => selectPlan(plan.TierName)}
                          className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all border-2 ${
                            formData.planTier === plan.TierName ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-gray-50 text-gray-500'
                          }`}
                        >
                          <p>{plan.TierName}</p>
                          <p className="text-[10px] mt-1 text-gray-400 italic">₹{plan.Price}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Personal Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <InputField label="Full Name" type="text" placeholder="Rahul K." value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} icon={User} required />
              <InputField label="Email Address" type="email" placeholder="rahul@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} icon={Mail} required />
              <InputField label="Phone Number" type="tel" placeholder="+91 99999 99999" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} icon={Phone} required />
              <InputField label="Full Address" type="text" placeholder="123 Street, City, State" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} icon={MapPin} required />
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Upload Identity Proofs</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FileUploader label="Aadhaar Card" onUpload={(base64) => setFormData({...formData, aadhaarFile: base64})} />
              <FileUploader label="PAN Card" onUpload={(base64) => setFormData({...formData, panFile: base64})} />
              <FileUploader label="Live Photograph" onUpload={(base64) => setFormData({...formData, photoFile: base64})} />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold text-gray-900">Review Application</h2>
            <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex items-start space-x-4">
              <div className="bg-indigo-600 p-2 rounded-lg"><Shield className="h-5 w-5 text-white" /></div>
              <div>
                <p className="text-sm font-bold text-indigo-900 uppercase tracking-widest leading-none mb-1">Service Type</p>
                <p className="text-xl font-black text-indigo-600">{formData.dscType} • {formData.planTier}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 px-2">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Applicant Name</p>
                <p className="font-bold text-gray-900">{formData.fullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Email</p>
                <p className="font-bold text-gray-900">{formData.email || 'N/A'}</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Checklist</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm font-medium text-gray-600">
                  <CheckCircle className={`h-4 w-4 mr-2 ${formData.aadhaarFile ? 'text-green-500' : 'text-gray-300'}`} />
                  Aadhaar Card Uploaded
                </li>
                <li className="flex items-center text-sm font-medium text-gray-600">
                  <CheckCircle className={`h-4 w-4 mr-2 ${formData.panFile ? 'text-green-500' : 'text-gray-300'}`} />
                  PAN Card Uploaded
                </li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-12 flex items-center justify-between border-t border-gray-50 pt-10">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center text-sm font-black uppercase tracking-widest transition-colors ${
              currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-900 hover:text-indigo-600'
            }`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !formData.dscType}
              className={`bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all group disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-green-600 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center shadow-lg shadow-green-100 hover:bg-green-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : 'Confirm & Proceed to Pay'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
