'use client';

import { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Loader2, File } from 'lucide-react';

interface FileUploaderProps {
  label: string;
  onUpload: (base64: string, name: string) => void;
  accept?: string;
}

export default function FileUploader({ label, onUpload, accept = ".pdf,.jpg,.jpeg,.png" }: FileUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setLoading(true);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onUpload(base64String, selected.name);
        setLoading(false);
      };
      reader.readAsDataURL(selected);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 uppercase tracking-wider">{label}</label>
      <div 
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${
          file ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {!file ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center space-y-2 py-4"
          >
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-2">
              <Upload className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm font-bold text-gray-900 leading-none">Click to upload doc</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">PDF, PNG or JPG (Max 5MB)</p>
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <File className="h-5 w-5 text-white" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase">Ready to sync</p>
              </div>
            </div>
            {loading ? (
              <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
            ) : (
              <button 
                type="button"
                onClick={removeFile}
                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                title="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
