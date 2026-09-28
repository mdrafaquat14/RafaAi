export function Logo({ compact=false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? 'brand-compact' : ''}`} aria-label="RafaAi">
      <img src="/favicon.svg" alt="RafaAi" className="brand-logo" />
      {!compact && <span className="brand-name">Rafa<span>Ai</span></span>}
    </div>
  )
}
