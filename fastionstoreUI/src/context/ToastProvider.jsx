import React, { useState, useCallback, useMemo, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Copy,
  Heart,
  ShoppingCart,
  Package,
  Trash2,
} from "lucide-react";
import { ToastContext } from "./ToastContext";

// Play subtle, soft audio chime for notifications
function playToastChime(type) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.18);
    } else {
      osc.type = "sine";
      const startFreq = type === "success" || type === "cart" ? 587.33 : 523.25;
      const endFreq = type === "success" || type === "cart" ? 880.0 : 659.25;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    }
  } catch (_e) {
    // Audio autoplay restrictions or offline, fail gracefully
  }
}

// Strip all emoji characters to ensure clean Lucide iconography
function sanitizeText(str) {
  if (!str) return "";
  return String(str)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// Dedicated single toast component to prevent re-render jitter
const ToastItem = React.memo(({ toast, onRemove }) => {
  const isCart =
    toast.type === "cart" ||
    toast.icon === "cart" ||
    toast.icon === "bag" ||
    toast.message?.toLowerCase().includes("cart") ||
    toast.message?.toLowerCase().includes("bag");

  const isPackage =
    toast.type === "package" ||
    toast.icon === "package" ||
    toast.title?.toLowerCase().includes("drop") ||
    toast.title?.toLowerCase().includes("product");

  const isCopy = toast.type === "copy" || toast.icon === "copy";
  const isHeart = toast.type === "heart" || toast.icon === "heart";
  const isTrash = toast.type === "trash" || toast.icon === "trash" || toast.message?.toLowerCase().includes("deleted");
  const isError = toast.type === "error";
  const isWarning = toast.type === "warning";
  const isSuccess = toast.type === "success" || isCart || isPackage;

  let iconComp = <Info size={17} className="text-blue-500" />;
  let borderColor = "border-blue-500/25";
  let accentBg = "bg-blue-50 text-blue-700";
  let progressColor = "bg-blue-500";

  if (isCart) {
    iconComp = <ShoppingCart size={17} className="text-emerald-600" />;
    borderColor = "border-emerald-500/30";
    accentBg = "bg-emerald-50 text-emerald-700";
    progressColor = "bg-emerald-500";
  } else if (isPackage) {
    iconComp = <Package size={17} className="text-blue-600" />;
    borderColor = "border-blue-500/30";
    accentBg = "bg-blue-50 text-blue-700";
    progressColor = "bg-blue-500";
  } else if (isTrash) {
    iconComp = <Trash2 size={17} className="text-neutral-600" />;
    borderColor = "border-neutral-300";
    accentBg = "bg-neutral-100 text-neutral-700";
    progressColor = "bg-neutral-600";
  } else if (isError) {
    iconComp = <AlertCircle size={17} className="text-red-500" />;
    borderColor = "border-red-500/30";
    accentBg = "bg-red-50 text-red-700";
    progressColor = "bg-red-500";
  } else if (isWarning) {
    iconComp = <AlertTriangle size={17} className="text-amber-500" />;
    borderColor = "border-amber-500/30";
    accentBg = "bg-amber-50 text-amber-700";
    progressColor = "bg-amber-500";
  } else if (isCopy) {
    iconComp = <Copy size={17} className="text-purple-500" />;
    borderColor = "border-purple-500/30";
    accentBg = "bg-purple-50 text-purple-700";
    progressColor = "bg-purple-500";
  } else if (isHeart) {
    iconComp = <Heart size={17} className="text-pink-500 fill-pink-500" />;
    borderColor = "border-pink-500/30";
    accentBg = "bg-pink-50 text-pink-700";
    progressColor = "bg-pink-500";
  } else if (isSuccess) {
    iconComp = <CheckCircle2 size={17} className="text-emerald-500" />;
    borderColor = "border-emerald-500/30";
    accentBg = "bg-emerald-50 text-emerald-700";
    progressColor = "bg-emerald-500";
  }

  const cleanTitle = sanitizeText(toast.title);
  const cleanMessage = sanitizeText(toast.message);

  return (
    <motion.div
      initial={{ opacity: 0, y: -16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-white border ${borderColor} shadow-2xl shadow-neutral-900/10 p-4 transition-all`}
      style={{ willChange: "transform, opacity" }}
    >
      <div className="flex items-start gap-3">
        {/* Status Badge with Pure Lucide Icon (Zero Emojis) */}
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentBg}`}>
          {iconComp}
        </div>

        {/* Body Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900">
              {cleanTitle}
            </span>
            <span className="text-[10px] font-semibold text-neutral-400">
              {toast.timestamp}
            </span>
          </div>
          <p className="text-xs font-semibold text-neutral-700 leading-snug break-words">
            {cleanMessage}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => onRemove(toast.id)}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close notification"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Hardware-accelerated Progress Bar (Smooth, zero repaint flicker) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-100 overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: toast.duration / 1000, ease: "linear" }}
          className={`h-full ${progressColor}`}
        />
      </div>
    </motion.div>
  );
});

ToastItem.displayName = "ToastItem";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem("fastion_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const timeoutsRef = useRef(new Map());

  const removeToast = useCallback((id) => {
    if (timeoutsRef.current.has(id)) {
      clearTimeout(timeoutsRef.current.get(id));
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = "info", optionsOrIcon = null) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      let duration = 4000;
      let title = "";
      let icon = null;

      if (typeof optionsOrIcon === "string") {
        icon = optionsOrIcon;
      } else if (optionsOrIcon && typeof optionsOrIcon === "object") {
        duration = optionsOrIcon.duration || duration;
        title = optionsOrIcon.title || "";
        icon = optionsOrIcon.icon || null;
      }

      const msgLower = String(message || "").toLowerCase();

      if (!title) {
        if (type === "cart" || icon === "cart" || icon === "bag" || msgLower.includes("cart") || msgLower.includes("bag")) {
          title = "Cart Updated";
          if (!icon) icon = "cart";
        } else if (type === "package" || icon === "package" || msgLower.includes("drop") || msgLower.includes("product")) {
          title = "Catalog";
          if (!icon) icon = "package";
        } else if (type === "success") {
          title = "Success";
        } else if (type === "error") {
          title = "Error";
        } else if (type === "warning") {
          title = "Attention";
        } else if (type === "copy" || icon === "copy") {
          title = "Copied";
        } else if (type === "heart" || icon === "heart") {
          title = "Wishlist";
        } else {
          title = "Notification";
        }
      }

      const cleanMessage = sanitizeText(message);
      const cleanTitle = sanitizeText(title);

      const newToast = {
        id,
        message: cleanMessage,
        type,
        icon,
        title: cleanTitle,
        duration,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setToasts((prev) => [newToast, ...prev.filter((t) => t.message !== cleanMessage)].slice(0, 4));

      setNotifications((prev) => {
        const updated = [newToast, ...prev].slice(0, 30);
        try {
          localStorage.setItem("fastion_notifications", JSON.stringify(updated));
        } catch {}
        return updated;
      });

      playToastChime(type);

      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      timeoutsRef.current.set(id, timer);
    },
    [removeToast]
  );

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.removeItem("fastion_notifications");
    } catch {}
  }, []);

  const contextValue = useMemo(
    () => ({ addToast, removeToast, toasts, notifications, clearNotifications }),
    [addToast, removeToast, toasts, notifications, clearNotifications]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Floating Streetwear Toast Container (Zero Emojis, Pure Lucide SVGs, Mobile Responsive) */}
      <div
        className="fixed top-3 inset-x-3 sm:inset-x-auto sm:top-5 sm:right-5 z-[999999] flex flex-col gap-2 sm:max-w-md pointer-events-none"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};