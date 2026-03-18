import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  error?: string;
  required?: boolean;
}

export default function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  required = false,
}: InputFieldProps) {
  return (
    <div className="mb-6 group">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2 px-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-all duration-300">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-2xl border-2 border-gray-50 ${
            Icon ? 'pl-12' : 'pl-5'
          } pr-5 py-4 text-sm font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-600 transition-all bg-white shadow-sm hover:border-gray-200`}
        />
      </div>
      {error && <p className="mt-2 text-[10px] font-black uppercase tracking-tight text-red-500 px-1">{error}</p>}
    </div>
  );
}
