export function Logo({ compact=false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-compact' : ''}`} aria-label="RafaAi">
      <img src="/rafaai-logo.svg" alt="" className="brand-logo" />
      {!compact && <span className="brand-name">Rafa<span>Ai</span></span>}
    </div>
  )
}
