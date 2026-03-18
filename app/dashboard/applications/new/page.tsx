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
  FileBadge,
  Check,
  Zap,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { apiRequest } from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';
import InputField from '@/components/InputField';
import FileUploader from '@/components/FileUploader';
import Skeleton from '@/components/Skeleton';
import Toast from '@/components/Toast';

const steps = [
  { id: 1, name: 'Service', desc: 'Category Selection' },
  { id: 2, name: 'Details', desc: 'Personal Profile' },
  { id: 3, name: 'Documents', desc: 'Identity Verification' },
  { id: 4, name: 'Review', desc: 'Secure Checkout' }
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
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

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
        setToast({ message: 'Failed to fetch catalog data', type: 'error' });
      } finally {
        setTimeout(() => setLoadingData(false), 800);
      }
    }
    if (token) fetchData();
  }, [token]);

  const handleNext = () => {
    if (currentStep === 1 && (!formData.dscType || !formData.planTier)) {
      setToast({ message: 'Please select a service and plan first', type: 'info' });
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectCategory = (type: string) => {
    setFormData({ ...formData, dscType: type, planTier: '', price: 0 });
  };

  const selectPlan = (tier: string) => {
    const selectedPrice = pricing.find(p => p.TierName === tier && p.Category === formData.dscType)?.Price || 0;
    setFormData({ ...formData, planTier: tier, price: selectedPrice });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('application/create', formData, token);
      setToast({ message: 'Application secured! Redirecting to payment...', type: 'success' });
      setTimeout(() => {
        router.push(`/dashboard/payments/checkout?appId=${res.applicationId}&amount=${formData.price}`);
      }, 1000);
    } catch (err) {
      setToast({ message: 'Submission failed. Please check your data.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 lg:px-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div className="animate-fade-in-up">
          <h1 className="text-5xl font-black text-gray-900 tracking-tighter leading-none mb-3">
            New <span className="text-indigo-600">Application</span>
          </h1>
          <p className="text-gray-500 font-medium italic text-lg">Secure your digital identity in 4 simple steps.</p>
        </div>
        <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-4 py-2 rounded-xl">
           <Zap className="h-4 w-4 mr-2 text-amber-500 fill-amber-500" /> Instant Processing Active
        </div>
      </div>

      {/* Modern Stepper */}
      <div className="mb-20 px-4 relative">
        <div className="absolute top-[22px] left-0 w-full h-1 bg-gray-100 -z-10 rounded-full">
           <div 
             className="h-full bg-indigo-600 transition-all duration-700" 
             style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
           ></div>
        </div>
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-xl transition-all duration-500 ${
                currentStep >= step.id ? 'bg-indigo-600 text-white scale-110 rotate-3' : 'bg-white text-gray-300'
              }`}>
                {currentStep > step.id ? <Check className="h-6 w-6" /> : <span className="font-black text-lg">{step.id}</span>}
              </div>
              <div className="mt-4 text-center">
                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${currentStep >= step.id ? 'text-indigo-600' : 'text-gray-400'}`}>
                  {step.name}
                </p>
                <p className="hidden md:block text-[8px] font-bold text-gray-300 italic uppercase tracking-widest">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-premium p-10 lg:p-14 animate-fade-in-up">
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Service Configuration</h2>
              <p className="text-gray-500 font-medium italic">Select your preferred DSC category and validity plan.</p>
            </div>

            {loadingData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <Skeleton className="h-32 w-full" />
                 <Skeleton className="h-32 w-full" />
                 <Skeleton className="h-32 w-full" />
                 <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {categories.map(cat => (
                  <button
                    key={cat.CategoryName}
                    onClick={() => selectCategory(cat.CategoryName)}
                    className={`relative p-8 text-left rounded-[2rem] border-2 transition-all duration-300 overflow-hidden group ${
                      formData.dscType === cat.CategoryName 
                        ? 'border-indigo-600 bg-indigo-50/20 ring-4 ring-indigo-50 shadow-2xl' 
                        : 'border-gray-50 bg-gray-50/50 hover:bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-12 -mt-12 transition-transform duration-700 ${formData.dscType === cat.CategoryName ? 'scale-150' : 'group-hover:scale-125'}`}></div>
                    <FileBadge className={`h-10 w-10 mb-6 transition-all duration-300 ${formData.dscType === cat.CategoryName ? 'text-indigo-600 scale-110' : 'text-gray-400'}`} />
                    <h3 className="text-xl font-black text-gray-900 mb-2">{cat.CategoryName}</h3>
                    <p className="text-xs text-gray-500 font-medium italic leading-relaxed">{cat.Description}</p>
                    
                    {formData.dscType === cat.CategoryName && (
                       <div className="absolute top-6 right-6 h-6 w-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                          <Check className="h-4 w-4" />
                       </div>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {formData.dscType && !loadingData && (
              <div className="pt-12 border-t border-gray-50 animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8">Validity & Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {pricing.filter(p => p.Category === formData.dscType).map(plan => (
                    <button
                      key={plan.TierName}
                      onClick={() => selectPlan(plan.TierName)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                        formData.planTier === plan.TierName 
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                          : 'border-gray-50 bg-white text-gray-500 hover:border-indigo-200'
                      }`}
                    >
                      <p className={`text-base font-black ${formData.planTier === plan.TierName ? 'text-white' : 'text-gray-900'}`}>{plan.TierName}</p>
                      <p className={`text-lg font-black mt-1 ${formData.planTier === plan.TierName ? 'text-indigo-100' : 'text-indigo-600'}`}>₹{plan.Price}</p>
                      {formData.planTier === plan.TierName && (
                        <CheckCircle className="absolute top-2 right-2 h-4 w-4 text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Personal Dossier */}
        {currentStep === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Applicant Identity</h2>
              <p className="text-gray-500 font-medium italic">Provide accurate contact and address details for standard verification.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField label="Full Name" type="text" placeholder="Rahul K." value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} icon={User} required />
              <InputField label="Contact Email" type="email" placeholder="rahul@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} icon={Mail} required />
              <InputField label="Primary Phone" type="tel" placeholder="+91 99999 99999" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} icon={Phone} required />
              <InputField label="Postal Address" type="text" placeholder="123 Street, City, State" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} icon={MapPin} required />
            </div>
          </div>
        )}

        {/* Step 3: Vault Uploads */}
        {currentStep === 3 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
             <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Verification Vault</h2>
              <p className="text-gray-500 font-medium italic">Securely upload high-resolution ID proofs for identity assurance.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FileUploader label="Aadhaar ID" onUpload={(base64) => setFormData({...formData, aadhaarFile: base64})} />
              <FileUploader label="PAN Identity" onUpload={(base64) => setFormData({...formData, panFile: base64})} />
              <FileUploader label="Live Biometric" onUpload={(base64) => setFormData({...formData, photoFile: base64})} />
            </div>
            <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-4">
               <AlertCircle className="h-5 w-5 text-amber-600 mt-1 shrink-0" />
               <p className="text-xs font-bold text-amber-900 leading-relaxed uppercase tracking-tight">
                 Ensure documents are clearly visible. Poor quality uploads may result in verification failure and registration delays.
               </p>
            </div>
          </div>
        )}

        {/* Step 4: Final Summary */}
        {currentStep === 4 && (
          <div className="space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">Final Review</h2>
              <p className="text-gray-500 font-medium italic">Confirm your choices before proceeding to secure payment terminal.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <div className="space-y-6">
                  <div className="p-8 bg-indigo-50 border border-indigo-100 rounded-[2rem] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                       <CreditCard className="h-24 w-24 text-indigo-600" />
                    </div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">Selected Certificate</p>
                    <h3 className="text-3xl font-black text-gray-900 mb-1">{formData.dscType}</h3>
                    <p className="text-lg font-black text-indigo-600">{formData.planTier} Subscription</p>
                    <div className="mt-8 flex items-baseline">
                       <span className="text-4xl font-black text-gray-900 tracking-tighter">₹{formData.price}</span>
                       <span className="ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">All Taxes Inc.</span>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Contact Record</h4>
                    <div className="space-y-4">
                       <ReviewItem icon={User} label="Name" value={formData.fullName} />
                       <ReviewItem icon={Mail} label="Email" value={formData.email} />
                       <ReviewItem icon={Phone} label="Phone" value={formData.phone} />
                    </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Document Checklist</h4>
                    <div className="space-y-4">
                       <CheckItem label="Aadhaar Card Verification" status={!!formData.aadhaarFile} />
                       <CheckItem label="PAN Identity Verification" status={!!formData.panFile} />
                       <CheckItem label="Biometric Photo Capture" status={!!formData.photoFile} />
                    </div>
                  </div>

                  <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[2rem]">
                    <div className="flex items-center space-x-3 mb-4">
                       <Shield className="h-6 w-6 text-emerald-600" />
                       <span className="text-sm font-black text-emerald-900 uppercase tracking-widest leading-none">Safe & Secure</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-800 leading-relaxed opacity-70 italic uppercase tracking-tight">
                       Your data is encrypted with enterprise-grade RSA-4096 security protocols.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        )}

        <div className="mt-16 flex items-center justify-between border-t border-gray-50 pt-12">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className={`flex items-center text-xs font-black uppercase tracking-[0.2em] transition-all px-6 py-2 rounded-xl h-14 ${
              currentStep === 1 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-900 hover:text-indigo-600 hover:bg-gray-50'
            }`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </button>
          
          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="btn-primary flex items-center h-14"
            >
              Continue
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-10 h-14 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.22em] flex items-center shadow-xl shadow-green-100 hover:bg-green-700 transition-all hover:shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-6 w-6" />
              ) : (
                <>Finalize & Pay <ArrowRight className="ml-3 h-5 w-5" /></>
              )}
            </button>
          )}
        </div>
      </div>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

function ReviewItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center space-x-4">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-indigo-600 transition-colors">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <p className="text-sm font-black text-gray-900 tracking-tight leading-none">{value || 'Not provided'}</p>
      </div>
    </div>
  );
}

function CheckItem({ label, status }: { label: string, status: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50">
      <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">{label}</span>
      <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${status ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-300'}`}>
        <Check className="h-4 w-4" />
      </div>
    </div>
  );
}
