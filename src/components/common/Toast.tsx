import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-wensure-teal shrink-0" />;
        let borderColor = 'border-wensure-teal/30';
        let bgTag = 'bg-wensure-ink';

        if (toast.type === 'warning') {
          icon = <AlertCircle className="w-5 h-5 text-wensure-warning shrink-0" />;
          borderColor = 'border-wensure-warning/40';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-sky-400 shrink-0" />;
          borderColor = 'border-sky-500/40';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded bg-wensure-ink text-white border ${borderColor} shadow-2xl transition-all animate-in slide-in-from-bottom-3 duration-300`}
          >
            {icon}
            <div className="flex-1 text-xs text-stone-200 leading-relaxed font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
