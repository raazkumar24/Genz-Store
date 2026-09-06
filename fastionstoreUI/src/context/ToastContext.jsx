import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
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

// Individual Toast Item with hover-pause and progress bar
const ToastItem = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration || 2800;
  const remainingRef = useRef(duration);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPaused) return;

    const interval = 25;
    const timer = setInterval(() => {
      remainingRef.current -= interval;
      const pct = Math.max(0, (remainingRef.current / duration) * 100);
      setProgress(pct);

      if (remainingRef.current <= 0) {
        clearInterval(timer);
        onRemove(toast.id);
      }
    }, interval);

    timerRef.current = timer;
    return () => clearInterval(timer);
  }, [isPaused, duration, onRemove, toast.id]);

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  const lowerMsg = (toast.message || '').toLowerCase();
  const isBag = toast.iconType === 'bag' || lowerMsg.includes('cart') || lowerMsg.includes('bag');
  const isHeart = toast.iconType === 'heart' || lowerMsg.includes('wishlist');
  const isCopy = toast.iconType === 'copy' || lowerMsg.includes('copied') || lowerMsg.includes('clipboard');

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex items-start justify-between gap-3 w-full p-3.5 sm:p-4 rounded-xl shadow-2xl backdrop-blur-xl border transition-all duration-300 pointer-events-auto overflow-hidden animate-in slide-in-from-top-3 fade-in-80 ${
        isSuccess
          ? 'bg-zinc-950/95 border-emerald-500/40 text-white shadow-emerald-950/40'
          : isError
          ? 'bg-zinc-950/95 border-red-500/40 text-white shadow-red-950/40'
          : isWarning
          ? 'bg-zinc-950/95 border-amber-500/40 text-white shadow-amber-950/40'
          : 'bg-zinc-950/95 border-sky-500/40 text-white shadow-sky-950/40'
      }`}
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Leading Icon Badge */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold shadow-xs ${
            isSuccess
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : isError
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : isWarning
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
          }`}
        >
          {isSuccess ? (
            isBag ? (
              <HiShoppingBag className="text-emerald-400 text-xl" />
            ) : (
              <HiCheckCircle className="text-emerald-400 text-xl" />
            )
          ) : isHeart ? (
            <HiHeart className="text-rose-400 text-xl" />
          ) : isCopy ? (
            <HiClipboardDocumentCheck className="text-sky-400 text-xl" />
          ) : isError ? (
            <HiXCircle className="text-red-400 text-xl" />
          ) : isWarning ? (
            <HiExclamationTriangle className="text-amber-400 text-xl" />
          ) : (
            <HiInformationCircle className="text-sky-400 text-xl" />
          )}
        </div>

        {/* Message Content */}
        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-black uppercase tracking-wider ${
                isSuccess
                  ? 'text-emerald-400'
                  : isError
                  ? 'text-red-400'
                  : isWarning
                  ? 'text-amber-400'
                  : 'text-sky-400'
              }`}
            >
              {toast.title || (isSuccess ? 'Success' : isError ? 'Error' : isWarning ? 'Notice' : 'Information')}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-zinc-100 leading-snug break-words mt-0.5">
            {toast.message}
          </p>
        </div>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <HiXMark className="text-base" />
      </button>

      {/* Bottom Duration Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10">
        <div
          className={`h-full transition-all ease-linear ${
            isSuccess
              ? 'bg-emerald-400'
              : isError
              ? 'bg-red-400'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-sky-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', iconType = null, duration = 2800) => {
    if (!message) return;
    const id = Math.random().toString(36).substring(2, 9);

    setToasts((prev) => {
      // Prevent exact duplicate toasts showing at the same time
      const isDuplicate = prev.some((t) => t.message === message);
      if (isDuplicate) return prev;
      return [...prev, { id, message, type, iconType, duration }];
    });
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div 
        aria-live="polite"
        className="fixed top-18 right-4 left-4 sm:left-auto sm:right-6 sm:w-[360px] z-[99999] flex flex-col gap-2.5 pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
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

export default ToastContext;
