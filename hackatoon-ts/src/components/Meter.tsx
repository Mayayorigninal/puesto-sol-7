type MeterProps = {
  label: string
  text: string
  value: number
  color: string
  target?: number
}

export function Meter({ label, text, value, color, target }: MeterProps) {
  return (
    <div className="medidor">
      <div className="et"><span>{label}</span><span>{text}</span></div>
      <div className="tr" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}>
        <i style={{ width: `${value}%`, background: color }} />
        {target !== undefined && <span className="meta" style={{ left: `${target}%` }} />}
      </div>
    </div>
  )
}
