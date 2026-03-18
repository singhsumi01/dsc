'use client';

import { useState } from 'react';
import { Upload, X, Check, FileCheck, Loader2 } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  onUpload: (base64: string) => void;
}

export default function FileUploader({ label, onUpload }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onUpload(base64);
        setTimeout(() => setIsUploading(false), 600);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className="space-y-3 group">
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] px-1">
        {label}
      </label>
      
      <div className={`relative h-40 rounded-[2rem] border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center p-6 overflow-hidden ${
        preview 
          ? 'border-emerald-500 bg-emerald-50/50' 
          : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-indigo-200'
      }`}>
        {isUploading ? (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Encrypting...</p>
          </div>
        ) : preview ? (
          <>
            <div className="h-12 w-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-emerald-100">
               <FileCheck className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Upload Secured</p>
            <p className="text-[8px] text-gray-400 font-bold uppercase truncate max-w-full">identity_document_encrypted.bin</p>
            <button
              onClick={removeFile}
              className="absolute top-4 right-4 p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <X className="h-3.3 w-3.3" />
            </button>
          </>
        ) : (
          <>
            <div className="h-12 w-12 bg-white text-gray-400 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-500">
               <Upload className="h-6 w-6" />
            </div>
            <p className="text-[10px] font-black text-gray-400 group-hover:text-gray-900 uppercase tracking-widest mb-1 transition-colors">Capture or Select</p>
            <p className="text-[8px] text-gray-300 font-bold uppercase">PNG, JPG or PDF up to 10MB</p>
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept="image/*,.pdf"
            />
          </>
        )}
      </div>
    </div>
  );
}
