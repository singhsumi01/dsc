import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <XCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-indigo-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-indigo-50 border-indigo-100'
  };

  return (
    <div className={`fixed bottom-8 right-8 flex items-center p-4 rounded-2xl border shadow-2xl animate-fade-in-up z-50 ${bgColors[type]}`}>
      <div className="mr-3">{icons[type]}</div>
      <p className="text-sm font-bold text-gray-900 leading-none">{message}</p>
    </div>
  );
};

export default Toast;
