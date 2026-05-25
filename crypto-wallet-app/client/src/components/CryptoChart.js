import React, { useMemo } from 'react';

function sparklinePath(values, width = 300, height = 100) {
  if (!values || values.length === 0) return '';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  return values.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / range) * height;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

export default function CryptoChart({ prices, ethPrice, ethDelta }){
  const points = useMemo(() => prices && prices.length ? prices : null, [prices]);
  const path = useMemo(() => sparklinePath(points, 300, 80), [points]);
  return (
    <div className="card p-4 rounded-xl w-full h-56">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm muted">Portfolio Value</div>
          <div className="text-2xl font-bold">{ethPrice ? `$${Number(ethPrice).toLocaleString(undefined,{maximumFractionDigits:2})}` : '--'}</div>
        </div>
        <div className="text-sm muted">7d<br/><div className={`font-semibold ${ethDelta>=0? 'text-green-400':'text-rose-400'}`}>{ethDelta==null? '—' : `${ethDelta>=0?'+':''}${Number(ethDelta).toFixed(2)}%`}</div></div>
      </div>
      <div className="mt-4 h-36 w-full bg-gradient-to-r from-violet-900/10 to-cyan-900/6 rounded-lg p-4 flex items-center">
        {path ? (
          <svg viewBox={`0 0 300 80`} className="w-full h-full">
            <path d={path} fill="none" stroke="#6b5ce9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <div className="w-full h-full flex items-center justify-center muted">No price data</div>
        )}
      </div>
    </div>
  );
}
