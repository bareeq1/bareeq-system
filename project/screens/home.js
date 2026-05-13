// ============================================================
//  HOME — cinematic hero + featured + loyalty preview + testimonials
// ============================================================

function HomeScreen({
  go,
  addToCart,
  openProduct,
  data
}) {
  const {
    lang,
    t
  } = useI18n();
  const featured = (data.ITEMS || []).filter(i => ['pis', 'mdl', 'jml', 'aero', 'rvc', 'tir'].includes(i.id));
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    className: "hero grain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__inner wrap-wide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__copy"
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      color: 'var(--gold)'
    }
  }, t('hero.eyebrow')), /*#__PURE__*/React.createElement("h1", {
    className: "hero__title serif"
  }, t('hero.title1'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: 'var(--gold)'
    }
  }, t('hero.title2')), /*#__PURE__*/React.createElement("br", null), t('hero.title3')), /*#__PURE__*/React.createElement("div", {
    className: "hero__tagline"
  }, /*#__PURE__*/React.createElement("div", {
    className: lang === 'en' ? 'arabic' : ''
  }, t('hero.tagline')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-deep)'
    }
  }, "\u2726")), /*#__PURE__*/React.createElement("p", {
    className: "hero__lead"
  }, t('hero.lead')), /*#__PURE__*/React.createElement("div", {
    className: "hero__ctas"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold",
    onClick: () => go('menu')
  }, t('hero.ctaOrder'), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--f-mono)'
    }
  }, "\u2192")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost-light",
    onClick: () => go('rewards')
  }, t('hero.ctaJoin'))), /*#__PURE__*/React.createElement("div", {
    className: "hero__stats"
  }, [['11', t('hero.statsA')], ['04', t('hero.statsB')], ['7am', t('hero.statsC')]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: v
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif hero__stat-k"
  }, k), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow hero__stat-v"
  }, v))))), /*#__PURE__*/React.createElement("div", {
    className: "hero__art"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero__art-a",
    style: {
      background: 'oklch(0.22 0.03 10)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/hero-a.jpg",
    alt: "Bareeq hibiscus drink",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero__art-b",
    style: {
      background: 'oklch(0.88 0.025 75)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/hero-b.jpg",
    alt: "Bareeq signature strawberry drink",
    fetchpriority: "high",
    decoding: "async",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero__art-c",
    style: {
      background: 'oklch(0.68 0.09 72)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/hero-c.jpg",
    alt: "Bareeq hot chocolate",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero__chip"
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/hero-chip.jpg",
    alt: "",
    style: {
      width: 48,
      height: 48,
      borderRadius: 10,
      objectFit: 'cover',
      flexShrink: 0,
      display: 'block',
      background: 'oklch(0.72 0.10 20)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-g"
  }, "Bestseller"), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 17,
      lineHeight: 1.1,
      marginTop: 2
    }
  }, "Fruity Ice Chocolate"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(Price, {
    value: 120,
    size: 11
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "hero__corner-tl"
  }, "MENU \u211607", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7
    }
  }, "SS \u2014 26")), /*#__PURE__*/React.createElement("div", {
    className: "hero__corner-br"
  }, t('common.scroll'), " \xB7 \u0627\u0646\u0632\u0644")), /*#__PURE__*/React.createElement(Marquee, {
    items: [{
      en: 'Slow brewed',
      ar: 'بطيء التحضير'
    }, {
      en: 'Single origin',
      ar: 'مصدر واحد'
    }, {
      en: 'Made by hand',
      ar: 'يدوي الصنع'
    }, {
      en: 'Roasted in Helwan',
      ar: 'محمصة حلوان'
    }, {
      en: 'Ceremonial matcha',
      ar: 'ماتشا احتفالي'
    }, {
      en: 'Open 7AM — 1AM',
      ar: 'مفتوح يوميًا'
    }]
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '110px 0 60px',
      background: 'var(--ivory)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kicker: t('home.featuredKicker'),
    title: t('home.featuredTitle'),
    lead: t('home.featuredLead'),
    action: /*#__PURE__*/React.createElement("button", {
      className: "btn btn--ghost",
      onClick: () => go('menu')
    }, t('common.seeMenu'))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 28
    }
  }, featured.map(it => /*#__PURE__*/React.createElement(ProductCard, {
    key: it.id,
    item: it,
    onOpen: openProduct,
    onAdd: addToCart
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink)',
      color: 'var(--ivory)',
      padding: '120px 0'
    },
    className: "grain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      color: 'var(--gold)'
    }
  }, t('home.brewKicker')), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      fontSize: 72,
      margin: '20px 0',
      lineHeight: 1.02,
      letterSpacing: '-0.02em'
    }
  }, /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--gold)'
    }
  }, t('home.brewTitle1')), /*#__PURE__*/React.createElement("br", null), t('home.brewTitle2')), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 16,
      maxWidth: 460,
      textWrap: 'pretty'
    }
  }, t('home.brewLead')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 40
    }
  }, [['01', 'Aeropress', 'Citric · weightless'], ['02', 'V60 · Hario', 'Floral · slow'], ['03', 'Matcha', 'Ceremonial · Uji']].map(([n, ti, s]) => /*#__PURE__*/React.createElement("div", {
    key: n,
    style: {
      borderLeft: '1px solid rgba(255,240,225,0.2)',
      paddingLeft: 16,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--gold)',
      fontSize: 10,
      letterSpacing: '0.2em'
    }
  }, "\u2116 ", n), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 22,
      marginTop: 6
    }
  }, ti), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'rgba(255,240,225,0.55)',
      marginTop: 4
    }
  }, s))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 540,
      background: 'oklch(0.18 0.02 40)',
      borderRadius: 6,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/brew-bar.jpg",
    alt: "Barista crafting V60 pour-over at Bareeq",
    loading: "lazy",
    width: "660",
    height: "540",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center top',
      borderRadius: 6,
      display: 'block'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 24,
      left: 24,
      right: 24,
      color: 'var(--ivory)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.22em',
      opacity: 0.65
    }
  }, "BARISTA \xB7 04:00"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.22em',
      opacity: 0.65
    }
  }, "92\xB0 \xB7 18G \xB7 240ML"))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '110px 0',
      background: 'var(--cream)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kicker: t('home.loyaltyKicker'),
    title: t('home.loyaltyTitle'),
    lead: t('home.loyaltyLead'),
    action: /*#__PURE__*/React.createElement("button", {
      className: "btn btn--ink",
      onClick: () => go('rewards')
    }, t('home.loyaltyCta'))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 18
    }
  }, (data.TIERS || []).map((tier, i) => /*#__PURE__*/React.createElement("div", {
    key: tier.id,
    className: tier.id === 'vip' ? 'lux-border' : 'card',
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      position: 'relative',
      minHeight: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(TierBadge, {
    tier: tier.id,
    size: 48
  }), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: 'var(--ink-faint)',
      letterSpacing: '0.18em'
    }
  }, "0", i + 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 28
    }
  }, tier.label), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: 'var(--ink-mute)',
      letterSpacing: '0.14em',
      marginTop: 4
    }
  }, tier.min, " \u2013 ", tier.max === 9999 ? '∞' : tier.max, " \u2726")), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 7,
      fontSize: 13,
      color: 'var(--ink-soft)'
    }
  }, tier.perks.map(p => /*#__PURE__*/React.createElement("li", {
    key: p,
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold-deep)'
    }
  }, "\u2726"), p)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '110px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kicker: t('home.testimonialsKicker'),
    title: t('home.testimonialsTitle')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 24
    }
  }, (data.TESTIMONIALS || []).map(tm => /*#__PURE__*/React.createElement("figure", {
    key: tm.id,
    className: "card",
    style: {
      padding: 32,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      minHeight: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 4,
      color: 'var(--gold-deep)'
    }
  }, [1, 2, 3, 4, 5].map(s => /*#__PURE__*/React.createElement("span", {
    key: s
  }, "\u2726"))), /*#__PURE__*/React.createElement("blockquote", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 22,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      fontStyle: 'italic',
      flex: 1,
      textWrap: 'pretty'
    }
  }, "\"", tm.body, "\""), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingTop: 18,
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: tm.tone,
    label: "",
    aspect: "auto",
    radius: 999,
    style: {
      width: 38,
      height: 38
    },
    grain: false
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500
    }
  }, tm.who), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginTop: 2
    }
  }, tm.role)))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 0 110px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, (data.COUPONS || []).map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      background: c.flavor === 'gold' ? 'linear-gradient(135deg, var(--gold), var(--gold-deep))' : c.flavor === 'matcha' ? 'var(--sage-2)' : c.flavor === 'burgundy' ? 'var(--burgundy)' : 'var(--ink)',
      color: c.flavor === 'gold' ? 'var(--burgundy-ink)' : 'var(--ivory)',
      borderRadius: 16,
      padding: 22,
      position: 'relative',
      overflow: 'hidden',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em',
      opacity: 0.7
    }
  }, "COUPON \xB7 ", c.id), /*#__PURE__*/React.createElement("h4", {
    className: "serif",
    style: {
      margin: '10px 0 6px',
      fontSize: 24,
      lineHeight: 1.1
    }
  }, c.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      opacity: 0.85,
      textWrap: 'pretty'
    }
  }, c.sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10.5,
      letterSpacing: '0.14em',
      opacity: 0.7
    }
  }, c.expiry), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--sm",
    style: {
      background: 'rgba(255,255,255,.15)',
      color: 'inherit',
      backdropFilter: 'blur(6px)'
    }
  }, "Clip \u2192"))))))), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }));
}
function Footer({
  go
}) {
  const {
    t
  } = useI18n();
  const socials = [{
    label: 'IG',
    href: 'https://www.instagram.com/bareeq.eg__'
  }, {
    label: 'FB',
    href: 'https://www.facebook.com/bareeq.egy/'
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink)',
      color: 'var(--ivory)',
      padding: '80px 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
      gap: 48,
      marginBottom: 60
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    size: 36,
    color: "var(--ivory)"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,240,225,0.6)',
      maxWidth: 320,
      marginTop: 22,
      fontSize: 14,
      lineHeight: 1.6
    }
  }, t('footer.tagline')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 22
    }
  }, socials.map(({
    label,
    href
  }) => /*#__PURE__*/React.createElement("a", {
    key: label,
    href: href,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      width: 36,
      height: 36,
      borderRadius: 999,
      border: '1px solid rgba(255,240,225,0.2)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--f-mono)',
      fontSize: 10.5,
      color: 'var(--ivory)',
      textDecoration: 'none',
      transition: 'border-color .2s, background .2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--gold)';
      e.currentTarget.style.background = 'rgba(255,240,225,0.08)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'rgba(255,240,225,0.2)';
      e.currentTarget.style.background = 'transparent';
    }
  }, label)))), [[t('footer.order'), ['Full menu', 'Brew bar', 'Coffee beans', 'Catering']], [t('footer.circle'), ['Loyalty tiers', 'Rewards wallet', 'Refer a friend', 'VIP']]].map(([h, items]) => /*#__PURE__*/React.createElement("div", {
    key: h
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-g",
    style: {
      color: 'var(--gold)'
    }
  }, h), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '18px 0 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, items.map(i => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 14
    }
  }, i))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow eyebrow-g",
    style: {
      color: 'var(--gold)'
    }
  }, t('footer.visit')), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      padding: 0,
      margin: '18px 0 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 14
    }
  }, "Helwan branch"), /*#__PURE__*/React.createElement("li", {
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 14
    }
  }, "Hours \xB7 7AM \u2014 1AM"), /*#__PURE__*/React.createElement("li", {
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 14
    }
  }, "Mostafa Safwat St"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "tel:+201110387361",
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 14,
      textDecoration: 'none',
      fontFamily: 'var(--f-mono)',
      letterSpacing: '0.06em'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'var(--gold)',
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,240,225,0.7)'
  }, "+20 111 038 7361"))))), /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      paddingTop: 24,
      borderTop: '1px solid rgba(255,240,225,0.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'rgba(255,240,225,0.45)',
      fontSize: 12,
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      letterSpacing: '0.2em'
    }
  }, t('footer.rights')), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      letterSpacing: '0.2em'
    }
  }, t('footer.location'))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 24,
      textAlign: 'center',
      fontSize: 11,
      color: 'rgba(255,240,225,0.25)',
      fontFamily: 'var(--f-mono)',
      letterSpacing: '0.14em'
    }
  }, "CRAFTED BY", ' ', /*#__PURE__*/React.createElement("a", {
    href: "https://gamal.vercel.app",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      color: 'rgba(255,240,225,0.45)',
      textDecoration: 'none',
      borderBottom: '1px solid rgba(255,240,225,0.2)',
      paddingBottom: 1,
      transition: 'color .2s, border-color .2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.color = 'var(--gold)';
      e.currentTarget.style.borderColor = 'var(--gold)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.color = 'rgba(255,240,225,0.45)';
      e.currentTarget.style.borderColor = 'rgba(255,240,225,0.2)';
    }
  }, "GAMAL"))));
}
Object.assign(window, {
  HomeScreen,
  Footer
});
