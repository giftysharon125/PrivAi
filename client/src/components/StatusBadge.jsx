import React from 'react';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const StatusBadge = ({ status, size = 'md' }) => {
  const isEligible = status === 'ELIGIBLE' || status === 'PASS' || status === true;
  const isPending = status === 'PENDING' || status === 'uploaded';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm font-semibold',
    lg: 'px-4 py-1.5 text-base font-bold'
  }[size] || 'px-3 py-1 text-sm font-semibold';

  if (isPending) {
    return (
      <span className={`inline-flex items-center space-x-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
        <Clock className="w-4 h-4 animate-spin" />
        <span>PROCESSING</span>
      </span>
    );
  }

  if (isEligible) {
    return (
      <span className={`inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10 ${sizeClasses}`}>
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>{status === true || status === 'PASS' ? 'PASS' : 'ELIGIBLE'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-sm shadow-rose-500/10 ${sizeClasses}`}>
      <XCircle className="w-4 h-4 text-rose-400" />
      <span>{status === false || status === 'FAIL' ? 'FAIL' : 'NOT ELIGIBLE'}</span>
    </span>
  );
};

export default StatusBadge;
