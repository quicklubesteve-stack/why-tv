import React, { useState, useEffect } from 'react';
import { Lock, X, AlertTriangle, KeyRound, ShieldAlert } from 'lucide-react';
import { Channel } from '../types';

interface ParentalLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetChannel: Channel | null;
  correctPin: string;
  onSuccess: (channelId: string) => void;
}

export const ParentalLockModal: React.FC<ParentalLockModalProps> = ({
  isOpen,
  onClose,
  targetChannel,
  correctPin,
  onSuccess,
}) => {
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen || !targetChannel) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const verifyPin = (enteredPin: string) => {
    if (enteredPin === correctPin) {
      onSuccess(targetChannel.id);
      onClose();
    } else {
      setErrorMsg('Incorrect PIN. Please try again.');
      setTimeout(() => {
        setPin('');
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-cable-900 border border-amber-400/60 rounded-2xl w-full max-w-sm p-6 shadow-2xl flex flex-col items-center text-center space-y-4">
        {/* Header Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400">
          <Lock className="w-7 h-7" />
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold bg-black/50 px-2 py-0.5 rounded border border-neutral-700">
            Parental Controls Protected
          </span>
          <h3 className="text-xl font-bold text-white mt-1">Unlock Channel</h3>
          <p className="text-xs text-slate-300 mt-1">
            Enter the 4-digit PIN to access <strong className="text-white">{targetChannel.name}</strong> (CH {targetChannel.channelNumber}).
          </p>
        </div>

        {/* 4-Digit PIN Indicators */}
        <div className="flex items-center space-x-3 my-2">
          {[0, 1, 2, 3].map((index) => {
            const hasDigit = pin.length > index;
            return (
              <div
                key={index}
                className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-all ${
                  hasDigit
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-cable-focus'
                    : 'border-neutral-700 bg-neutral-950 text-slate-600'
                }`}
              >
                {hasDigit ? '•' : ''}
              </div>
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 font-bold animate-pulse">{errorMsg}</p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="py-3 rounded-xl bg-cable-800 hover:bg-cable-700 border border-cable-border text-white text-lg font-bold font-mono transition cable-focus-ring active:scale-95"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={() => setPin('')}
            className="py-3 rounded-xl bg-cable-800 hover:bg-neutral-800 border border-cable-border text-slate-400 text-xs font-mono font-bold transition"
          >
            CLEAR
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="py-3 rounded-xl bg-cable-800 hover:bg-cable-700 border border-cable-border text-white text-lg font-bold font-mono transition cable-focus-ring active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="py-3 rounded-xl bg-cable-800 hover:bg-neutral-800 border border-cable-border text-slate-400 text-xs font-mono font-bold transition"
          >
            ⌫
          </button>
        </div>

        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white pt-2"
        >
          Cancel & Return to Previous Channel
        </button>
      </div>
    </div>
  );
};
