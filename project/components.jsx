// ============================================================
//  Bareeq · shared components
// ============================================================

const { useState, useEffect, useRef, useMemo } = React;

// -------- Logo --------
function Logo({ size = 22, color }) {
  const style = { fontFamily: 'var(--f-display)', fontSize: size, color, lineHeight: 1, letterSpacing: '-0.01em', position: 'relative', display: 'inline-flex', alignItems: 'baseline', gap: 8 };
  return (
    <span style={style}>
      <span style={{ position: 'relative' }}>
        bareeq
        <span style={{ position: 'absolute', top: -size*0.18, right: -size*0.45, fontSize: size*0.32, color: 'var(--gold-deep)' }}>✦</span>
      </span>
      <span className="arabic" style={{ fontSize: size*0.78, color: 'var(--ink-mute)' }}>بريق</span>
    </span>
  );
}

// -------- Eyebrow with bullet --------
function Eyebrow({ children, gold, style }) {
  return (
    <div className={`eyebrow ${gold ? 'eyebrow-g' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, ...style }}>
      <span style={{ width: 14, height: 1, background: 'currentColor' }} />
      {children}
    </div>
  );
}

// -------- Hairline --------
function Hair({ style }) { return <div className="hair" style={style} />; }

// -------- Tonal placeholder image with optional label --------
function Ph({ tone = '', label = '', radius = 12, aspect = '4 / 3', children, style = {}, grain = true }) {
  return (
    <div
      className={`ph ${tone ? `ph--${tone}` : ''} ${grain ? 'grain' : ''}`}
      data-label={label}
      style={{ aspectRatio: aspect, borderRadius: radius, width: '100%', ...style }}
    >
      {children}
    </div>
  );
}

// -------- Price tag --------
function Price({ value, size = 14, soft }) {
  return (
    <span className="mono" style={{ fontSize: size, color: soft ? 'var(--ink-mute)' : 'var(--ink)' }}>
      <span style={{ fontSize: size*0.78, opacity: 0.7, marginRight: 2 }}>EGP</span>{Number(value).toFixed(0)}
    </span>
  );
}

// -------- Tag chip (NEW, etc) --------
function Tag({ children, tone = 'ink' }) {
  const map = {
    ink: { bg: 'var(--ink)', fg: 'var(--ivory)' },
    gold: { bg: 'linear-gradient(180deg,var(--gold),var(--gold-2))', fg: 'var(--burgundy-ink)' },
    burgundy: { bg: 'var(--burgundy)', fg: 'var(--ivory)' },
    sage: { bg: 'var(--sage)', fg: 'var(--ivory)' },
    ghost: { bg: 'transparent', fg: 'var(--ink)', border: '1px solid var(--rule)' },
  };
  const t = map[tone] || map.ink;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', borderRadius: 999,
      background: t.bg, color: t.fg, border: t.border || 'none',
      fontFamily: 'var(--f-mono)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase'
    }}>{children}</span>
  );
}

// -------- Quantity stepper --------
function Qty({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(Math.max(min, value-1))} aria-label="decrease">–</button>
      <span>{value}</span>
      <button onClick={() => onChange(Math.min(max, value+1))} aria-label="increase">+</button>
    </div>
  );
}

// -------- Section header --------
function SectionHeader({ kicker, title, lead, action, dark }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32, marginBottom: 28 }}>
      <div style={{ maxWidth: 760 }}>
        {kicker && <Eyebrow gold style={{ marginBottom: 14, color: dark ? 'var(--gold)' : undefined }}>{kicker}</Eyebrow>}
        <h2 className="serif" style={{ margin: 0, fontSize: 56, lineHeight: 1.02, letterSpacing: '-0.015em', color: dark ? 'var(--ivory)' : 'var(--ink)' }}>{title}</h2>
        {lead && <p style={{ margin: '14px 0 0', maxWidth: 540, color: dark ? 'rgba(255,255,255,.7)' : 'var(--ink-mute)', fontSize: 15, textWrap: 'pretty' }}>{lead}</p>}
      </div>
      {action}
    </div>
  );
}

// -------- Product card --------
function ProductCard({ item, lang, onOpen, onAdd }) {
  const showAr = lang === 'ar' || lang === 'bi';
  const showEn = lang === 'en' || lang === 'bi';
  return (
    <div className="card card--hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div onClick={() => onOpen(item)} style={{ cursor: 'pointer', position: 'relative' }}>
        <Ph tone={item.tone} label={item.name} aspect="5 / 4" radius={0} />
        {item.flag && (
          <div style={{ position: 'absolute', top: 12, left: 12 }}>
            <Tag tone={item.flag === 'bestseller' ? 'gold' : item.flag === 'signature' ? 'burgundy' : 'ink'}>{item.flag}</Tag>
          </div>
        )}
      </div>
      <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
          <h3 className="serif" style={{ margin: 0, fontSize: 22, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
            {showEn && item.name}
          </h3>
          <Price value={item.price} size={13} />
        </div>
        {showAr && <div className="arabic" style={{ fontSize: 15, color: 'var(--ink-mute)', direction: 'rtl', textAlign: 'left' }}>{item.ar}</div>}
        <p style={{ margin: '4px 0 12px', fontSize: 12.5, color: 'var(--ink-mute)', lineHeight: 1.5, textWrap: 'pretty', flex: 1 }}>{item.desc}</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center' }}>
          {item.calories != null
            ? <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>{item.calories} KCAL</span>
            : <span className="mono" style={{ fontSize: 10, color: 'var(--ink-faint)', letterSpacing: '0.12em' }}>WHOLE BEAN</span>}
          <button className="btn btn--ink btn--sm" onClick={(e) => { e.stopPropagation(); onAdd(item); }}>
            Add <span style={{ fontFamily: 'var(--f-mono)', opacity: 0.7 }}>+</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// -------- Marquee --------
function Marquee({ items, gap = 60, speed = 60 }) {
  const ref = useRef(null);
  return (
    <div style={{ overflow: 'hidden', borderTop: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)', padding: '14px 0', background: 'var(--paper)' }}>
      <div ref={ref} style={{
        display: 'inline-flex', gap, whiteSpace: 'nowrap',
        animation: `marquee ${speed}s linear infinite`,
      }}>
        {[...items, ...items].map((it, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 18 }}>
            <span className="serif" style={{ fontSize: 28, fontStyle: 'italic', color: 'var(--ink)' }}>{it.en}</span>
            <span className="arabic" style={{ fontSize: 22, color: 'var(--ink-mute)' }}>{it.ar}</span>
            <span style={{ color: 'var(--gold-deep)' }}>✦</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}

// -------- Modal shell --------
function Modal({ open, onClose, children, width = 940 }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20,12,8,0.45)',
      backdropFilter: 'blur(8px)',
      display: 'grid', placeItems: 'center',
      padding: 24,
      animation: 'fade .25s ease both',
    }} onClick={onClose}>
      <style>{`@keyframes fade { from { opacity: 0 } to { opacity: 1 } } @keyframes lift { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`}</style>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto',
        background: 'var(--paper)', borderRadius: 24,
        border: '1px solid var(--rule)',
        boxShadow: '0 60px 120px -40px rgba(20,12,8,.6)',
        animation: 'lift .35s cubic-bezier(.2,.7,.2,1) both',
      }}>
        {children}
      </div>
    </div>
  );
}

// -------- Tier badge --------
function TierBadge({ tier, size = 56 }) {
  const colors = {
    bronze: ['oklch(0.55 0.07 50)', 'oklch(0.42 0.08 45)'],
    silver: ['oklch(0.78 0.018 80)', 'oklch(0.62 0.020 80)'],
    gold:   ['oklch(0.82 0.10 78)', 'oklch(0.66 0.105 70)'],
    vip:    ['oklch(0.30 0.06 30)', 'oklch(0.18 0.04 25)'],
  };
  const [a,b] = colors[tier] || colors.bronze;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 30% 25%, ${a}, ${b} 70%)`,
      display: 'grid', placeItems: 'center',
      color: tier === 'silver' ? 'var(--ink)' : 'var(--ivory)',
      fontFamily: 'var(--f-display)', fontSize: size * 0.42,
      boxShadow: 'inset 0 1px 1px rgba(255,255,255,.5), 0 12px 24px -12px rgba(0,0,0,.4)',
      position: 'relative', flexShrink: 0,
    }}>
      {tier === 'vip' ? '♛' : tier[0].toUpperCase()}
    </div>
  );
}

Object.assign(window, { Logo, Eyebrow, Hair, Ph, Price, Tag, Qty, SectionHeader, ProductCard, Marquee, Modal, TierBadge });
