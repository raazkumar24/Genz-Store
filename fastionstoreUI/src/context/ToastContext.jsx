import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:right-6 md:bottom-6 z-[9999] flex flex-col items-center md:items-end gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 w-full md:w-auto min-w-[250px] max-w-full md:max-w-sm px-4 py-3 rounded-xl shadow-2xl bg-white border border-gray-100 transform transition-all duration-300 ease-out translate-y-0 opacity-100 pointer-events-auto"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {toast.type === 'success' && <CheckCircle size={20} className="text-green-500 shrink-0" />}
            {toast.type === 'error' && <XCircle size={20} className="text-red-500 shrink-0" />}
            {toast.type === 'info' && <Info size={20} className="text-blue-500 shrink-0" />}
            
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              {toast.message}
            </span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
