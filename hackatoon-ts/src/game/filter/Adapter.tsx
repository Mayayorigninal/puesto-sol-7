export function Adapter({ step }: { step: number }) {
  const hose = 'M198 59c-40 0 -50 -26 -84 -14s-28 14 -50 14'
  return (
    <svg className="buzon" viewBox="0 0 320 118" role="img" aria-label="El adaptador en construcción">
      <rect x="0" y="0" width="70" height="118" fill="#1E2740" />
      <circle cx="42" cy="59" r="22" fill="#0A0E1A" stroke="#8A95AD" strokeWidth="3" />
      <text x="42" y="104" textAnchor="middle" fontFamily="var(--data)" fontSize="8" fill="#8A95AD">RANURA</text>
      {step >= 2 && <path d="M196 30q44 -22 88 0v58q-44 22 -88 0z" fill="#B98A55" opacity=".9" />}
      <rect x="208" y="34" width="64" height="50" rx="4" fill="#D8DEE9" />
      <path d="M216 44h48M216 54h48M216 64h48M216 74h48" stroke="#8A95AD" strokeWidth="2" />
      {step >= 1 && <rect x="198" y="26" width="84" height="66" rx="12" fill="#BFD9F2" opacity=".4" stroke="#DCEBFA" strokeWidth="1.5" />}
      {step >= 3 && <path d="M196 40h88M196 78h88" stroke="#9AA3B2" strokeWidth="7" opacity=".95" />}
      {step >= 4
        ? <g fill="none" strokeWidth="9" strokeLinecap="round">
            <path d={hose} stroke="#E8EDF7" />
            <path d={hose} stroke="#8A95AD" strokeDasharray="2 7" />
          </g>
        : <text x="134" y="64" textAnchor="middle" fontFamily="var(--display)" fontWeight="700" fontSize="22" fill="#EF6B4A">≠</text>}
    </svg>
  )
}
