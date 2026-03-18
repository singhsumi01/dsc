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
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`block w-full rounded-xl border-gray-200 ${
            Icon ? 'pl-11' : 'pl-4'
          } pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white shadow-sm hover:border-gray-300`}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
}
