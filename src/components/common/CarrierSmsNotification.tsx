import React, { useEffect, useState } from 'react';
import { subscribeToSms, SmsNotificationEvent } from '../../services/smsService';
import { MessageSquare, Copy, Check, X, Smartphone } from 'lucide-react';

interface CarrierSmsNotificationProps {
  onAutoFillCode?: (code: string) => void;
}

export const CarrierSmsNotification: React.FC<CarrierSmsNotificationProps> = ({ onAutoFillCode }) => {
  const [currentEvent, setCurrentEvent] = useState<SmsNotificationEvent | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToSms((event) => {
      setCurrentEvent(event);
      setCopied(false);
    });
    return unsubscribe;
  }, []);

  // Auto-dismiss notification after 14 seconds
  useEffect(() => {
    if (!currentEvent) return;
    const timer = setTimeout(() => {
      setCurrentEvent(null);
    }, 14000);
    return () => clearTimeout(timer);
  }, [currentEvent]);

  if (!currentEvent) return null;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentEvent.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAutoFill = () => {
    if (onAutoFillCode) {
      onAutoFillCode(currentEvent.code);
    }
    handleCopy();
    setCurrentEvent(null);
  };

  return (
    <div
      id="carrier-sms-notification-banner"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-md animate-bounce-short select-none"
    >
      <div className="p-3.5 rounded-2xl bg-[#1c1d22]/95 backdrop-blur-xl border border-white/20 shadow-2xl text-white flex flex-col gap-2 ring-1 ring-emerald-500/30">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
              <span className="text-white font-bold">MESSAGES</span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">SMS Carrier</span>
              <span>•</span>
              <span className="text-slate-400 text-[10px]">Just now</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentEvent(null)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss SMS"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="px-0.5">
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-white">C-TOWN Security Code:</span> Your verification code is{' '}
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-mono font-bold tracking-widest text-sm inline-block">
              {currentEvent.code}
            </span>
            . Sent to <span className="text-slate-200 font-mono">{currentEvent.phone}</span>.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1 border-t border-white/5">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            type="button"
            onClick={handleAutoFill}
            className="px-3 py-1.5 rounded-lg bg-[#1ed760] hover:bg-[#1fdf64] text-black text-[11px] font-bold flex items-center gap-1.5 shadow-md transition-transform hover:scale-[1.02] active:scale-95"
          >
            <Smartphone className="w-3 h-3" />
            <span>Auto-fill Code ({currentEvent.code})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
