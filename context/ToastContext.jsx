"use client";

import { createContext, useContext, useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Radio, X } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 size={15} className="text-lime-300" />,
  error: <AlertTriangle size={15} className="text-rose-400" />,
  info: <Radio size={15} className="text-cyan-300" />,
};

const BORDERS = {
  success: "border-lime-300/30",
  error: "border-rose-400/30",
  info: "border-cyan-300/30",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, title, body) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-3), { id, type, title, body }]);
      setTimeout(() => dismiss(id), 6000);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      success: (title, body) => push("success", title, body),
      error: (title, body) => push("error", title, body),
      info: (title, body) => push("info", title, body),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              className={`pointer-events-auto rounded-lg border ${BORDERS[toast.type]} bg-[#060b13]/95 p-3.5 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-md`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 shrink-0">{ICONS[toast.type]}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-white/90">
                    {toast.title}
                  </p>
                  {toast.body && (
                    <p className="mt-1 text-xs leading-relaxed text-white/55">{toast.body}</p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="shrink-0 rounded p-0.5 text-white/35 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Dismiss notification"
                >
                  <X size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
