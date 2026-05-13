// ============================================================
//  REWARDS / LOYALTY
// ============================================================

function RewardsScreen({
  go,
  data,
  loyalty
}) {
  const {
    lang,
    t
  } = useI18n();
  const tiers = data.TIERS || [];
  const badges = data.BADGES || [];
  const coupons = data.COUPONS || [];
  const points = loyalty?.points ?? 0;
  const streak = loyalty?.streakCount ?? 0;
  const memberNo = loyalty?.memberNumber || '00000';
  const tier = tiers.find(ti => points >= ti.min && points < ti.max) || tiers[0] || {
    id: 'bronze',
    label: 'Bronze',
    min: 0,
    max: 250,
    perks: []
  };
  const tierIdx = tiers.indexOf(tier);
  const nextTier = tiers[tierIdx + 1];
  const progress = tier.max > tier.min ? (points - tier.min) / (tier.max - tier.min) * 100 : 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "screen"
  }, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--ink)',
      color: 'var(--ivory)',
      padding: '60px 0 80px',
      position: 'relative',
      overflow: 'hidden'
    },
    className: "grain"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '-30%',
      right: '-10%',
      width: 720,
      height: 720,
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, var(--gold), transparent 65%)',
      opacity: 0.35
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "wrap-wide",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: 60,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      color: 'var(--gold)'
    }
  }, t('rewards.kicker')), /*#__PURE__*/React.createElement("h1", {
    className: "serif",
    style: {
      margin: '20px 0 0',
      fontSize: 96,
      lineHeight: 0.96,
      letterSpacing: '-0.02em',
      fontWeight: 400
    }
  }, t('rewards.title1'), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      color: 'var(--gold)'
    }
  }, t('rewards.title2'))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,240,225,0.7)',
      maxWidth: 480,
      marginTop: 22,
      fontSize: 16,
      lineHeight: 1.6,
      textWrap: 'pretty'
    }
  }, t('rewards.lead'))), /*#__PURE__*/React.createElement("div", {
    className: "lux-border",
    style: {
      padding: 0,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 30,
      background: 'linear-gradient(135deg, oklch(0.32 0.06 30), oklch(0.18 0.04 25))',
      borderRadius: 18,
      color: 'var(--ivory)',
      position: 'relative',
      minHeight: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    size: 26,
    color: "var(--ivory)"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em',
      opacity: 0.6,
      marginTop: 16
    }
  }, t('rewards.member'), " \u2116 ", memberNo)), /*#__PURE__*/React.createElement(TierBadge, {
    tier: tier.id,
    size: 56
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 56,
      lineHeight: 1,
      color: 'var(--gold)'
    }
  }, points, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      opacity: 0.7
    }
  }, "\u2726")), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10.5,
      letterSpacing: '0.2em',
      opacity: 0.6,
      marginTop: 6
    }
  }, t('rewards.sparkles'), " \xB7 ", tier.label.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'rgba(255,240,225,.15)',
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.min(progress, 100)}%`,
      height: '100%',
      background: 'linear-gradient(90deg, var(--gold), var(--gold-deep))'
    }
  })), nextTier && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      opacity: 0.7,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, tier.label), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, nextTier.min - points, " \u2726 \u2192 ", nextTier.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 16,
      right: 20,
      fontFamily: 'var(--f-mono)',
      fontSize: 9,
      letterSpacing: '0.18em',
      opacity: 0.4
    }
  }, "BAREEQ \xB7 2026")))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 0',
      background: 'var(--ivory)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kicker: t('rewards.tiersKicker'),
    title: t('rewards.tiersTitle')
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, tiers.map((ti, i) => {
    const active = ti.id === tier.id;
    return /*#__PURE__*/React.createElement("div", {
      key: ti.id,
      className: active ? 'lux-border' : 'card',
      style: {
        padding: 28,
        minHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'relative'
      }
    }, active && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 12,
        right: 12
      }
    }, /*#__PURE__*/React.createElement(Tag, {
      tone: "gold"
    }, t('common.you'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(TierBadge, {
      tier: ti.id,
      size: 56
    }), /*#__PURE__*/React.createElement("span", {
      className: "mono",
      style: {
        fontSize: 11,
        color: 'var(--ink-faint)',
        letterSpacing: '0.18em'
      }
    }, "0", i + 1)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "serif",
      style: {
        margin: 0,
        fontSize: 32,
        letterSpacing: '-0.01em'
      }
    }, ti.label), /*#__PURE__*/React.createElement("div", {
      className: "mono",
      style: {
        fontSize: 11,
        color: 'var(--ink-mute)',
        letterSpacing: '0.14em',
        marginTop: 6
      }
    }, ti.min, " \u2013 ", ti.max === 9999 ? '∞' : ti.max, " \u2726")), /*#__PURE__*/React.createElement(Hair, null), /*#__PURE__*/React.createElement("ul", {
      style: {
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 9,
        fontSize: 13,
        color: 'var(--ink-soft)'
      }
    }, ti.perks.map(p => /*#__PURE__*/React.createElement("li", {
      key: p,
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--gold-deep)'
      }
    }, "\u2726"), p))));
  })))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 0 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 36,
      display: 'flex',
      flexDirection: 'column',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('rewards.streakKicker')), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)',
      letterSpacing: '0.2em'
    }
  }, t('rewards.streakResets'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 96,
      lineHeight: 0.9,
      letterSpacing: '-0.03em'
    }
  }, streak), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 22
    }
  }, t('rewards.streakDays')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)',
      marginTop: 4
    }
  }, "3 more for the ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--gold-deep)'
    }
  }, "Fortnight Drop"), " \u2726"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(15, 1fr)',
      gap: 6
    }
  }, Array.from({
    length: 15
  }).map((_, i) => {
    const done = i < streak;
    const milestone = (i + 1) % 7 === 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      title: `Day ${i + 1}`,
      style: {
        aspectRatio: '1',
        borderRadius: 6,
        background: done ? milestone ? 'var(--gold)' : 'var(--burgundy)' : 'var(--ivory-2)',
        border: i === streak ? '1px dashed var(--ink)' : '1px solid var(--rule)',
        display: 'grid',
        placeItems: 'center',
        fontSize: 10,
        fontFamily: 'var(--f-mono)',
        color: done ? milestone ? 'var(--burgundy-ink)' : 'var(--ivory)' : 'var(--ink-faint)',
        animation: i === streak ? 'pulseGold 2.4s ease-in-out infinite' : 'none'
      }
    }, i + 1);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 11,
      color: 'var(--ink-mute)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Day 1"), /*#__PURE__*/React.createElement("span", null, "Day 7 \xB7 Free drink"), /*#__PURE__*/React.createElement("span", null, "Day 14 \xB7 Pastry"))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 36,
      background: 'var(--burgundy)',
      color: 'var(--ivory)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true,
    style: {
      color: 'var(--gold)'
    }
  }, t('rewards.spinKicker')), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 38,
      lineHeight: 1.05
    }
  }, t('rewards.spinTitle')), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,240,225,0.7)',
      fontSize: 13.5,
      textWrap: 'pretty'
    }
  }, t('rewards.spinLead')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 200,
      height: 200,
      margin: '8px auto 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: 'conic-gradient(var(--gold) 0 60deg, var(--ivory) 60deg 120deg, var(--gold-deep) 120deg 180deg, var(--ivory) 180deg 240deg, var(--gold) 240deg 300deg, var(--burgundy-2) 300deg 360deg)',
      boxShadow: 'inset 0 0 0 6px rgba(255,255,255,.1), 0 20px 40px -20px rgba(0,0,0,.6)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '40%',
      borderRadius: '50%',
      background: 'var(--ink)',
      color: 'var(--gold)',
      display: 'grid',
      placeItems: 'center',
      fontFamily: 'var(--f-display)',
      fontSize: 14
    }
  }, "spin"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: -8,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderTop: '14px solid var(--gold)'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--gold",
    style: {
      marginTop: 6
    }
  }, t('rewards.spinCta'))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '0 0 90px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kicker: t('rewards.badgesKicker'),
    title: t('rewards.badgesTitle'),
    lead: "Small honors for being a regular. Three more unlocked recently."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 16
    }
  }, badges.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.id,
    className: "card",
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      opacity: b.earned ? 1 : 0.55
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: b.earned ? 'radial-gradient(circle at 30% 30%, var(--gold), var(--gold-deep))' : 'var(--ivory-2)',
      display: 'grid',
      placeItems: 'center',
      color: b.earned ? 'var(--burgundy-ink)' : 'var(--ink-faint)',
      fontSize: 22,
      boxShadow: b.earned ? 'inset 0 1px 1px rgba(255,255,255,.5)' : 'none'
    }
  }, b.glyph), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 20,
      lineHeight: 1.1
    }
  }, b.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)',
      marginTop: 4
    }
  }, b.sub)), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      color: b.earned ? 'var(--gold-deep)' : 'var(--ink-faint)',
      letterSpacing: '0.18em',
      marginTop: 'auto'
    }
  }, b.earned ? '✓ EARNED' : 'LOCKED')))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--cream)',
      padding: '90px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    kicker: t('rewards.couponsKicker'),
    title: t('rewards.couponsTitle'),
    lead: "Personalized offers based on your taste. Tap to apply at checkout."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 18
    }
  }, coupons.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      display: 'flex',
      alignItems: 'stretch',
      gap: 0,
      borderRadius: 18,
      overflow: 'hidden',
      boxShadow: 'var(--shadow-soft)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 160,
      background: c.flavor === 'gold' ? 'linear-gradient(135deg, var(--gold), var(--gold-deep))' : c.flavor === 'matcha' ? 'var(--sage-2)' : c.flavor === 'burgundy' ? 'var(--burgundy)' : 'var(--ink)',
      color: c.flavor === 'gold' ? 'var(--burgundy-ink)' : 'var(--ivory)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      textAlign: 'center',
      borderRight: '2px dashed rgba(255,255,255,.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 10,
      letterSpacing: '0.2em',
      opacity: 0.7
    }
  }, "CODE"), /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 22,
      marginTop: 4
    }
  }, c.id)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: 'var(--paper)',
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    className: "serif",
    style: {
      margin: 0,
      fontSize: 22
    }
  }, c.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)',
      marginTop: 4,
      textWrap: 'pretty'
    }
  }, c.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 10.5,
      color: 'var(--ink-faint)',
      letterSpacing: '0.14em'
    }
  }, c.expiry), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ghost btn--sm"
  }, t('common.apply'))))))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '90px 0 120px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "wrap",
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 36,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    gold: true
  }, t('rewards.referKicker')), /*#__PURE__*/React.createElement("h2", {
    className: "serif",
    style: {
      fontSize: 64,
      margin: '20px 0',
      lineHeight: 1.02
    }
  }, t('rewards.referTitle1'), /*#__PURE__*/React.createElement("br", null), t('rewards.referTitle2')), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-mute)',
      maxWidth: 440,
      fontSize: 15,
      textWrap: 'pretty'
    }
  }, t('rewards.referLead')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 24,
      maxWidth: 440
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: "bareeq.app/YARA-42",
    readOnly: true,
    style: {
      flex: 1,
      padding: '14px 18px',
      borderRadius: 999,
      border: '1px solid var(--rule)',
      background: 'var(--paper)',
      fontFamily: 'var(--f-mono)',
      fontSize: 13
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink"
  }, t('common.copy')))), /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 36,
      background: 'var(--ink)',
      color: 'var(--ivory)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 72,
      color: 'var(--gold)',
      lineHeight: 1
    }
  }, "02"), /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      fontSize: 11,
      color: 'rgba(255,240,225,.6)',
      letterSpacing: '0.18em',
      marginTop: 6
    }
  }, "FRIENDS REFERRED \xB7 1 TO GO"), /*#__PURE__*/React.createElement(Hair, {
    style: {
      margin: '24px 0',
      borderColor: 'rgba(255,240,225,.15)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, ['Salma N. · joined Apr 18 · +50 ✦', 'Karim S. · joined Mar 02 · +50 ✦'].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Ph, {
    tone: "gold",
    label: "",
    aspect: "1",
    style: {
      width: 28,
      height: 28
    },
    grain: false
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'rgba(255,240,225,.85)'
    }
  }, s))))))), /*#__PURE__*/React.createElement(Footer, {
    go: go
  }));
}
Object.assign(window, {
  RewardsScreen
});
