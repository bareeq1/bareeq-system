// ============================================================
//  HOME — cinematic hero + featured + loyalty preview + testimonials
// ============================================================

function HomeScreen({ go, addToCart, openProduct, lang }) {
  const featured = window.BAREEQ.ITEMS.filter(i => ['pis','mdl','jml','aero','rvc','tir'].includes(i.id));
  const signatures = window.BAREEQ.ITEMS.filter(i => i.cat === 'signature').slice(0, 4);

  return (
    <div className="screen">
      {/* ── CINEMATIC HERO ────────────────────────────────────────── */}
      <section className="hero grain">
        <div className="hero__inner wrap-wide">
          <div className="hero__copy">
            <Eyebrow gold style={{ color: 'var(--gold)' }}>Helwan · Est. 2023 · Specialty roastery</Eyebrow>
            <h1 className="hero__title serif">
              A glow<br/>
              <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>in every</span><br/>
              sip<span style={{ color: 'var(--gold)' }}>.</span>
            </h1>
            <div className="hero__tagline">
              <div className="arabic">بريق في كل رشفة</div>
              <span style={{ color: 'var(--gold-deep)' }}>✦</span>
            </div>
            <p className="hero__lead">
              Specialty Egyptian café culture, brewed slowly. From Medjool dates to ceremonial matcha — every drink is composed, never assembled.
            </p>
            <div className="hero__ctas">
              <button className="btn btn--gold" onClick={() => go('menu')}>
                Order now <span style={{ fontFamily: 'var(--f-mono)' }}>→</span>
              </button>
              <button className="btn btn--ghost-light" onClick={() => go('rewards')}>Join the Inner Circle</button>
            </div>
            <div className="hero__stats">
              {[
                ['11', 'Signature drinks'],
                ['04', 'Single-origin beans'],
                ['7am', 'Open daily'],
              ].map(([k,v]) => (
                <div key={v}>
                  <div className="serif hero__stat-k">{k}</div>
                  <div className="eyebrow hero__stat-v">{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* hero composition — collage on desktop, single panel on mobile */}
          <div className="hero__art">
            <div className="hero__art-a"><Ph tone="coffee" label="hero · espresso pour" aspect="auto" radius={4} style={{ height: '100%' }} /></div>
            <div className="hero__art-b"><Ph tone="cream" label="hero · pistachio latte" aspect="auto" radius={4} style={{ height: '100%' }} /></div>
            <div className="hero__art-c"><Ph tone="gold" label="hero · medjool dates" aspect="auto" radius={4} style={{ height: '100%' }} /></div>
            <div className="hero__chip">
              <div className="ph ph--pistachio" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }}></div>
              <div>
                <div className="eyebrow eyebrow-g">Bestseller</div>
                <div className="serif" style={{ fontSize: 17, lineHeight: 1.1, marginTop: 2 }}>Pistachio Latte</div>
                <div style={{ marginTop: 2 }}><Price value={130} size={11} /></div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero__corner-tl">MENU №07<br/><span style={{ opacity: 0.7 }}>SS — 26</span></div>
        <div className="hero__corner-br">↓ SCROLL · انزل</div>
      </section>

      {/* ── PRESS / MARQUEE ───────────────────────────────────── */}
      <Marquee items={[
        { en: 'Slow brewed', ar: 'بطيء التحضير' },
        { en: 'Single origin', ar: 'مصدر واحد' },
        { en: 'Made by hand', ar: 'يدوي الصنع' },
        { en: 'Roasted in Helwan', ar: 'محمصة حلوان' },
        { en: 'Ceremonial matcha', ar: 'ماتشا احتفالي' },
        { en: 'Open 7AM — 1AM', ar: 'مفتوح يوميًا' },
      ]} />

      {/* ── FEATURED DRINKS ──────────────────────────────────── */}
      <section style={{ padding: '110px 0 60px', background: 'var(--ivory)' }}>
        <div className="wrap">
          <SectionHeader
            kicker="The Bareeq Six · ستة بريق"
            title="A short menu of our quietest obsessions."
            lead="Drinks we keep returning to. Six of forty-eight, chosen by the barista team this month."
            action={<button className="btn btn--ghost" onClick={() => go('menu')}>See full menu →</button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {featured.map(it => (
              <ProductCard key={it.id} item={it} lang={lang} onOpen={openProduct} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* ── EDITORIAL · BREW BAR  ────────────────────────────── */}
      <section style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '120px 0' }} className="grain">
        <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <Eyebrow gold style={{ color: 'var(--gold)' }}>The Brew Bar · غرفة التحضير</Eyebrow>
            <h2 className="serif" style={{ fontSize: 72, margin: '20px 0', lineHeight: 1.02, letterSpacing: '-0.02em' }}>
              Four <em style={{ color: 'var(--gold)' }}>minutes</em>,<br/>
              one origin, one cup.
            </h2>
            <p style={{ color: 'rgba(255,240,225,0.7)', fontSize: 16, maxWidth: 460, textWrap: 'pretty' }}>
              Aeropress, V60 and ceremonial matcha — reserve a stool at the counter and watch your cup composed in real time.
            </p>
            <div style={{ display: 'flex', gap: 28, marginTop: 40 }}>
              {[
                ['01', 'Aeropress', 'Citric · weightless'],
                ['02', 'V60 · Hario', 'Floral · slow'],
                ['03', 'Matcha', 'Ceremonial · Uji'],
              ].map(([n,t,s]) => (
                <div key={n} style={{ borderLeft: '1px solid rgba(255,240,225,0.2)', paddingLeft: 16, flex: 1 }}>
                  <div className="mono" style={{ color: 'var(--gold)', fontSize: 10, letterSpacing: '0.2em' }}>№ {n}</div>
                  <div className="serif" style={{ fontSize: 22, marginTop: 6 }}>{t}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,240,225,0.55)', marginTop: 4 }}>{s}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 540 }}>
            <Ph tone="coffee" label="brew bar · aeropress pour" radius={6} style={{ position: 'absolute', inset: 0, height: '100%' }} grain={false} />
            <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: 'var(--ivory)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.65 }}>BARISTA · 04:00</div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: '0.22em', opacity: 0.65 }}>92° · 18G · 240ML</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOYALTY PREVIEW ──────────────────────────────────── */}
      <section style={{ padding: '110px 0', background: 'var(--cream)' }}>
        <div className="wrap">
          <SectionHeader
            kicker="Inner Circle · دائرتنا"
            title="A loyalty programme that earns its name."
            lead="Earn a sparkle on every order. Climb four tiers from Bronze to VIP — unlocking concierge ordering, weekly drinks on the house, and first access to bean drops."
            action={<button className="btn btn--ink" onClick={() => go('rewards')}>See the tiers →</button>}
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18 }}>
            {window.BAREEQ.TIERS.map((t, i) => (
              <div key={t.id} className={t.id === 'vip' ? 'lux-border' : 'card'} style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', minHeight: 280 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TierBadge tier={t.id} size={48} />
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-faint)', letterSpacing: '0.18em' }}>0{i+1}</span>
                </div>
                <div>
                  <h3 className="serif" style={{ margin: 0, fontSize: 28 }}>{t.label}</h3>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--ink-mute)', letterSpacing: '0.14em', marginTop: 4 }}>
                    {t.min} – {t.max === 9999 ? '∞' : t.max} ✦
                  </div>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, fontSize: 13, color: 'var(--ink-soft)' }}>
                  {t.perks.map(p => <li key={p} style={{ display: 'flex', gap: 8 }}><span style={{ color: 'var(--gold-deep)' }}>✦</span>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section style={{ padding: '110px 0' }}>
        <div className="wrap">
          <SectionHeader
            kicker="What guests say · شهادات"
            title="Reviews from the regulars."
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {window.BAREEQ.TESTIMONIALS.map((t, i) => (
              <figure key={t.id} className="card" style={{ padding: 32, margin: 0, display: 'flex', flexDirection: 'column', gap: 18, minHeight: 280 }}>
                <div style={{ display: 'flex', gap: 4, color: 'var(--gold-deep)' }}>
                  {[1,2,3,4,5].map(s => <span key={s}>✦</span>)}
                </div>
                <blockquote className="serif" style={{ margin: 0, fontSize: 22, lineHeight: 1.3, letterSpacing: '-0.005em', fontStyle: 'italic', flex: 1, textWrap: 'pretty' }}>
                  “{t.body}”
                </blockquote>
                <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 18, borderTop: '1px solid var(--rule)' }}>
                  <Ph tone={t.tone} label="" aspect="auto" radius={999} style={{ width: 38, height: 38 }} grain={false} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{t.who}</div>
                    <div className="eyebrow" style={{ marginTop: 2 }}>{t.role}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUPONS STRIP ────────────────────────────────────── */}
      <section style={{ padding: '0 0 110px' }}>
        <div className="wrap">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {window.BAREEQ.COUPONS.map(c => (
              <div key={c.id} style={{
                background: c.flavor === 'gold' ? 'linear-gradient(135deg, var(--gold), var(--gold-deep))'
                  : c.flavor === 'matcha' ? 'var(--sage-2)'
                  : c.flavor === 'burgundy' ? 'var(--burgundy)'
                  : 'var(--ink)',
                color: c.flavor === 'gold' ? 'var(--burgundy-ink)' : 'var(--ivory)',
                borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden',
                minHeight: 160, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '0.2em', opacity: 0.7 }}>COUPON · {c.id}</div>
                  <h4 className="serif" style={{ margin: '10px 0 6px', fontSize: 24, lineHeight: 1.1 }}>{c.label}</h4>
                  <div style={{ fontSize: 13, opacity: 0.85, textWrap: 'pretty' }}>{c.sub}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <span className="mono" style={{ fontSize: 10.5, letterSpacing: '0.14em', opacity: 0.7 }}>{c.expiry}</span>
                  <button className="btn btn--sm" style={{ background: 'rgba(255,255,255,.15)', color: 'inherit', backdropFilter: 'blur(6px)' }}>Clip →</button>
                </div>
                {/* perforated edge */}
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '60%', width: 1, background: 'rgba(255,255,255,.15)', backgroundImage: 'linear-gradient(to bottom, transparent 4px, currentColor 4px, currentColor 6px, transparent 6px)', backgroundSize: '1px 10px', display: 'none' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <Footer go={go} />
    </div>
  );
}

function Footer({ go }) {
  return (
    <footer style={{ background: 'var(--ink)', color: 'var(--ivory)', padding: '80px 0 40px' }}>
      <div className="wrap" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, marginBottom: 60 }}>
        <div>
          <Logo size={36} color="var(--ivory)" />
          <p style={{ color: 'rgba(255,240,225,0.6)', maxWidth: 320, marginTop: 22, fontSize: 14, lineHeight: 1.6 }}>
            Bareeq specialty coffee, Helwan. A glow in every sip — a pour-over poured slowly.
          </p>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            {['IG','FB','WA','TT'].map(s => (
              <span key={s} style={{ width: 36, height: 36, borderRadius: 999, border: '1px solid rgba(255,240,225,0.2)', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-mono)', fontSize: 10.5 }}>{s}</span>
            ))}
          </div>
        </div>
        {[
          ['Order', ['Full menu','Brew bar','Coffee beans','Catering']],
          ['Inner Circle', ['Loyalty tiers','Rewards wallet','Refer a friend','VIP']],
          ['Visit', ['Helwan branch','Hours · 7AM — 1AM','Mostafa Safwat St','+20 ** *** ****']],
        ].map(([h, items]) => (
          <div key={h}>
            <div className="eyebrow eyebrow-g" style={{ color: 'var(--gold)' }}>{h}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '18px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {items.map(i => <li key={i} style={{ color: 'rgba(255,240,225,0.7)', fontSize: 14 }}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 24, borderTop: '1px solid rgba(255,240,225,0.1)', color: 'rgba(255,240,225,0.45)', fontSize: 12 }}>
        <div className="mono" style={{ letterSpacing: '0.2em' }}>© 2026 BAREEQ · ALL RIGHTS RESERVED</div>
        <div className="mono" style={{ letterSpacing: '0.2em' }}>HELWAN · مصر</div>
      </div>
    </footer>
  );
}

Object.assign(window, { HomeScreen, Footer });
