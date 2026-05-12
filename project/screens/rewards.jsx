// ============================================================
//  REWARDS / LOYALTY
// ============================================================

function RewardsScreen({ go }) {
  const { lang, t } = useI18n();
  const points = 612;
  const tier = window.BAREEQ.TIERS.find(ti => points >= ti.min && points < ti.max) || window.BAREEQ.TIERS[0];
  const tierIdx = window.BAREEQ.TIERS.indexOf(tier);
  const nextTier = window.BAREEQ.TIERS[tierIdx + 1];
  const progress = ((points - tier.min) / (tier.max - tier.min)) * 100;
  const streak = 12;

  return (
    <div className="screen">
      {/* HERO */}
      <section style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '60px 0 80px', position: 'relative', overflow: 'hidden' }} className="grain">
        {/* decorative orbit */}
        <div style={{ position: 'absolute', top: '-30%', right: '-10%', width: 720, height: 720, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, var(--gold), transparent 65%)', opacity: 0.35 }} />
        <div className="wrap-wide" style={{ position: 'relative' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <Eyebrow gold style={{ color: 'var(--gold)' }}>{t('rewards.kicker')}</Eyebrow>
              <h1 className="serif" style={{ margin: '20px 0 0', fontSize: 96, lineHeight: 0.96, letterSpacing: '-0.02em', fontWeight: 400 }}>
                {t('rewards.title1')}<br/>
                <em style={{ color: 'var(--gold)' }}>{t('rewards.title2')}</em>
              </h1>
              <p style={{ color: 'rgba(255,240,225,0.7)', maxWidth: 480, marginTop: 22, fontSize: 16, lineHeight: 1.6, textWrap: 'pretty' }}>
                {t('rewards.lead')}
              </p>
            </div>

            {/* MEMBERSHIP CARD */}
            <div className="lux-border" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
              <div style={{ padding: 30, background: 'linear-gradient(135deg, oklch(0.32 0.06 30), oklch(0.18 0.04 25))', borderRadius: 18, color: 'var(--ivory)', position: 'relative', minHeight: 280 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Logo size={26} color="var(--ivory)" />
                    <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', opacity: 0.6, marginTop: 16 }}>{t('rewards.member')} № 00428</div>
                  </div>
                  <TierBadge tier={tier.id} size={56} />
                </div>
                <div style={{ marginTop: 28 }}>
                  <div className="serif" style={{ fontSize: 56, lineHeight: 1, color: 'var(--gold)' }}>
                    {points} <span style={{ fontSize: 24, opacity: 0.7 }}>✦</span>
                  </div>
                  <div className="mono" style={{ fontSize: 10.5, letterSpacing: '0.2em', opacity: 0.6, marginTop: 6 }}>{t('rewards.sparkles')} · {tier.label.toUpperCase()}</div>
                </div>
                <div style={{ marginTop: 22 }}>
                  <div style={{ height: 6, background: 'rgba(255,240,225,.15)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold), var(--gold-deep))' }} />
                  </div>
                  {nextTier && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginTop: 8 }}>
                      <span>{tier.label}</span>
                      <span className="mono">{nextTier.min - points} ✦ → {nextTier.label}</span>
                    </div>
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: 16, right: 20, fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.18em', opacity: 0.4 }}>
                  YARA · 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIER LADDER */}
      <section style={{ padding: '90px 0', background: 'var(--ivory)' }}>
        <div className="wrap">
          <SectionHeader kicker={t('rewards.tiersKicker')} title={t('rewards.tiersTitle')} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {window.BAREEQ.TIERS.map((ti, i) => {
              const active = ti.id === tier.id;
              return (
                <div key={ti.id} className={active ? 'lux-border' : 'card'} style={{ padding: 28, minHeight: 360, display: 'flex', flexDirection: 'column', gap: 16, position: 'relative' }}>
                  {active && <div style={{ position: 'absolute', top: 12, right: 12 }}><Tag tone="gold">{t('common.you')}</Tag></div>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TierBadge tier={ti.id} size={56} />
                    <span className="mono" style={{ fontSize: 11, color: 'var(--ink-faint)', letterSpacing: '0.18em' }}>0{i+1}</span>
                  </div>
                  <div>
                    <h3 className="serif" style={{ margin: 0, fontSize: 32, letterSpacing: '-0.01em' }}>{ti.label}</h3>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.14em', marginTop: 6 }}>
                      {ti.min} – {ti.max === 9999 ? '∞' : ti.max} ✦
                    </div>
                  </div>
                  <Hair />
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9, fontSize: 13, color: 'var(--ink-soft)' }}>
                    {ti.perks.map(p => <li key={p} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold-deep)' }}>✦</span>{p}</li>)}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STREAK + SPIN + ACHIEVEMENTS */}
      <section style={{ padding: '0 0 90px' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
          {/* STREAK */}
          <div className="card" style={{ padding: 36, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Eyebrow gold>{t('rewards.streakKicker')}</Eyebrow>
              <span className="mono" style={{ fontSize: 11, color: 'var(--ink-mute)', letterSpacing: '0.2em' }}>{t('rewards.streakResets')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <div className="serif" style={{ fontSize: 96, lineHeight: 0.9, letterSpacing: '-0.03em' }}>{streak}</div>
              <div>
                <div className="serif" style={{ fontSize: 22 }}>{t('rewards.streakDays')}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 4 }}>3 more for the <strong style={{ color: 'var(--gold-deep)' }}>Fortnight Drop</strong> ✦</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 6 }}>
              {Array.from({ length: 15 }).map((_, i) => {
                const done = i < streak;
                const milestone = (i+1) % 7 === 0;
                return (
                  <div key={i} title={`Day ${i+1}`} style={{
                    aspectRatio: '1',
                    borderRadius: 6,
                    background: done ? (milestone ? 'var(--gold)' : 'var(--burgundy)') : 'var(--ivory-2)',
                    border: i === streak ? '1px dashed var(--ink)' : '1px solid var(--rule)',
                    display: 'grid', placeItems: 'center',
                    fontSize: 10, fontFamily: 'var(--f-mono)',
                    color: done ? (milestone ? 'var(--burgundy-ink)' : 'var(--ivory)') : 'var(--ink-faint)',
                    animation: i === streak ? 'pulseGold 2.4s ease-in-out infinite' : 'none',
                  }}>{i+1}</div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-mute)' }}>
              <span>Day 1</span><span>Day 7 · Free drink</span><span>Day 14 · Pastry</span>
            </div>
          </div>

          {/* SPIN */}
          <div className="card" style={{ padding: 36, background: 'var(--burgundy)', color: 'var(--ivory)', display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', overflow: 'hidden' }}>
            <Eyebrow gold style={{ color: 'var(--gold)' }}>{t('rewards.spinKicker')}</Eyebrow>
            <div className="serif" style={{ fontSize: 38, lineHeight: 1.05 }}>{t('rewards.spinTitle')}</div>
            <p style={{ color: 'rgba(255,240,225,0.7)', fontSize: 13.5, textWrap: 'pretty' }}>{t('rewards.spinLead')}</p>
            <div style={{ position: 'relative', width: 200, height: 200, margin: '8px auto 0' }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: 'conic-gradient(var(--gold) 0 60deg, var(--ivory) 60deg 120deg, var(--gold-deep) 120deg 180deg, var(--ivory) 180deg 240deg, var(--gold) 240deg 300deg, var(--burgundy-2) 300deg 360deg)',
                boxShadow: 'inset 0 0 0 6px rgba(255,255,255,.1), 0 20px 40px -20px rgba(0,0,0,.6)',
              }} />
              <div style={{ position: 'absolute', inset: '40%', borderRadius: '50%', background: 'var(--ink)', color: 'var(--gold)', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-display)', fontSize: 14 }}>spin</div>
              <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '14px solid var(--gold)' }} />
            </div>
            <button className="btn btn--gold" style={{ marginTop: 6 }}>{t('rewards.spinCta')}</button>
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section style={{ padding: '0 0 90px' }}>
        <div className="wrap">
          <SectionHeader kicker={t('rewards.badgesKicker')} title={t('rewards.badgesTitle')} lead="Small honors for being a regular. Three more unlocked recently." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {window.BAREEQ.BADGES.map(b => (
              <div key={b.id} className="card" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 12, opacity: b.earned ? 1 : 0.55 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: b.earned ? 'radial-gradient(circle at 30% 30%, var(--gold), var(--gold-deep))' : 'var(--ivory-2)',
                  display: 'grid', placeItems: 'center',
                  color: b.earned ? 'var(--burgundy-ink)' : 'var(--ink-faint)',
                  fontSize: 22,
                  boxShadow: b.earned ? 'inset 0 1px 1px rgba(255,255,255,.5)' : 'none',
                }}>{b.glyph}</div>
                <div>
                  <div className="serif" style={{ fontSize: 20, lineHeight: 1.1 }}>{b.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4 }}>{b.sub}</div>
                </div>
                <div className="mono" style={{ fontSize: 10, color: b.earned ? 'var(--gold-deep)' : 'var(--ink-faint)', letterSpacing: '0.18em', marginTop: 'auto' }}>
                  {b.earned ? '✓ EARNED' : 'LOCKED'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COUPONS WALLET */}
      <section style={{ background: 'var(--cream)', padding: '90px 0' }}>
        <div className="wrap">
          <SectionHeader kicker={t('rewards.couponsKicker')} title={t('rewards.couponsTitle')} lead="Personalized offers based on your taste. Tap to apply at checkout." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            {window.BAREEQ.COUPONS.map(c => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'stretch', gap: 0, borderRadius: 18, overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
                <div style={{
                  width: 160,
                  background: c.flavor === 'gold' ? 'linear-gradient(135deg, var(--gold), var(--gold-deep))'
                    : c.flavor === 'matcha' ? 'var(--sage-2)'
                    : c.flavor === 'burgundy' ? 'var(--burgundy)'
                    : 'var(--ink)',
                  color: c.flavor === 'gold' ? 'var(--burgundy-ink)' : 'var(--ivory)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 16, textAlign: 'center',
                  borderRight: '2px dashed rgba(255,255,255,.3)',
                }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', opacity: 0.7 }}>CODE</div>
                  <div className="serif" style={{ fontSize: 22, marginTop: 4 }}>{c.id}</div>
                </div>
                <div style={{ flex: 1, background: 'var(--paper)', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 className="serif" style={{ margin: 0, fontSize: 22 }}>{c.label}</h4>
                  <div style={{ fontSize: 13, color: 'var(--ink-mute)', marginTop: 4, textWrap: 'pretty' }}>{c.sub}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                    <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.14em' }}>{c.expiry}</span>
                    <button className="btn btn--ghost btn--sm">{t('common.apply')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REFERRAL */}
      <section style={{ padding: '90px 0 120px' }}>
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36, alignItems: 'center' }}>
          <div>
            <Eyebrow gold>{t('rewards.referKicker')}</Eyebrow>
            <h2 className="serif" style={{ fontSize: 64, margin: '20px 0', lineHeight: 1.02 }}>
              {t('rewards.referTitle1')}<br/>{t('rewards.referTitle2')}
            </h2>
            <p style={{ color: 'var(--ink-mute)', maxWidth: 440, fontSize: 15, textWrap: 'pretty' }}>
              {t('rewards.referLead')}
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, maxWidth: 440 }}>
              <input value="bareeq.app/YARA-42" readOnly style={{ flex: 1, padding: '14px 18px', borderRadius: 999, border: '1px solid var(--rule)', background: 'var(--paper)', fontFamily: 'var(--f-mono)', fontSize: 13 }} />
              <button className="btn btn--ink">{t('common.copy')}</button>
            </div>
          </div>
          <div className="card" style={{ padding: 36, background: 'var(--ink)', color: 'var(--ivory)' }}>
            <div className="serif" style={{ fontSize: 72, color: 'var(--gold)', lineHeight: 1 }}>02</div>
            <div className="mono" style={{ fontSize: 11, color: 'rgba(255,240,225,.6)', letterSpacing: '0.18em', marginTop: 6 }}>FRIENDS REFERRED · 1 TO GO</div>
            <Hair style={{ margin: '24px 0', borderColor: 'rgba(255,240,225,.15)' }}/>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['Salma N. · joined Apr 18 · +50 ✦','Karim S. · joined Mar 02 · +50 ✦'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Ph tone="gold" label="" aspect="1" style={{ width: 28, height: 28 }} grain={false} />
                  <span style={{ fontSize: 13, color: 'rgba(255,240,225,.85)' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  );
}

Object.assign(window, { RewardsScreen });
