import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiInformationCircle, 
  HiExclamationTriangle, 
  HiXMark,
  HiShoppingBag,
  HiHeart,
  HiClipboardDocumentCheck
} from 'react-icons/hi2';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', iconType = null, duration = 3500) => {
    if (!message) return;
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => {
      // Prevent exact duplicate toasts showing at the same time
      const isDuplicate = prev.some((t) => t.message === message);
      if (isDuplicate) return prev;
      return [...prev, { id, message, type, iconType }];
    });

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="polite"
        className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-[380px] z-[99999] flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((toast) => {
          const isSuccess = toast.type === 'success';
          const isError = toast.type === 'error';
          const isWarning = toast.type === 'warning';

          // Auto detect icon type if not explicitly passed
          const lowerMsg = toast.message.toLowerCase();
          const isBagIcon = toast.iconType === 'bag' || lowerMsg.includes('bag') || lowerMsg.includes('cart');
          const isHeartIcon = toast.iconType === 'heart' || lowerMsg.includes('wishlist');
          const isCopyIcon = toast.iconType === 'copy' || lowerMsg.includes('copied') || lowerMsg.includes('clipboard');

          return (
            <div
              key={toast.id}
              className={`group relative flex items-center justify-between gap-3 w-full p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-300 pointer-events-auto animate-in slide-in-from-top-4 fade-in-50 ${
                isSuccess
                  ? 'bg-zinc-950/95 border-emerald-500/30 text-white shadow-emerald-950/20 border-l-4 border-l-emerald-500'
                  : isError
                  ? 'bg-zinc-950/95 border-red-500/30 text-white shadow-red-950/20 border-l-4 border-l-red-500'
                  : isWarning
                  ? 'bg-zinc-950/95 border-amber-500/30 text-white shadow-amber-950/20 border-l-4 border-l-amber-500'
                  : 'bg-zinc-950/95 border-sky-500/30 text-white shadow-sky-950/20 border-l-4 border-l-sky-500'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Icon Container with React Icons (HiShoppingBag for Cart/Bag) */}
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-md ${
                    isBagIcon
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-emerald-500/10'
                      : isHeartIcon
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-rose-500/10'
                      : isSuccess
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : isError
                      ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                      : isWarning
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                      : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                  }`}
                >
                  {isBagIcon ? (
                    <HiShoppingBag className="text-emerald-400 text-2xl" />
                  ) : isHeartIcon ? (
                    <HiHeart className="text-rose-400 text-2xl" />
                  ) : isCopyIcon ? (
                    <HiClipboardDocumentCheck className="text-sky-400 text-2xl" />
                  ) : isSuccess ? (
                    <HiCheckCircle className="text-emerald-400 text-2xl" />
                  ) : isError ? (
                    <HiXCircle className="text-red-400 text-2xl" />
                  ) : isWarning ? (
                    <HiExclamationTriangle className="text-amber-400 text-2xl" />
                  ) : (
                    <HiInformationCircle className="text-sky-400 text-2xl" />
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    {isBagIcon ? 'Shopping Bag' : isHeartIcon ? 'Wishlist' : isSuccess ? 'Success' : isError ? 'Error' : isWarning ? 'Warning' : 'Notification'}
                  </span>
                  <p className="text-xs md:text-sm font-bold text-white leading-snug break-words mt-0.5">
                    {toast.message}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-zinc-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-all shrink-0 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <HiXMark className="text-lg" />
              </button>
            </div>
          );
        })}
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
