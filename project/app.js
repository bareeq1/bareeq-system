// ============================================================
//  Bareeq · App shell
// ============================================================

const {
  useState: useS,
  useEffect: useE
} = React;
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "warm",
  "density": 1
} /*EDITMODE-END*/;
function App() {
  const [screen, setScreen] = useS('home');
  const [cart, setCart] = useS([]);
  const [drawerOpen, setDrawerOpen] = useS(false);
  const [openedItem, setOpenedItem] = useS(null);
  const [tw, setTw] = useTweaks(TWEAK_DEFAULTS);
  const {
    lang,
    toggle,
    t: tr
  } = useI18n();
  useE(() => {
    document.documentElement.dataset.palette = tw.palette;
  }, [tw.palette]);
  const addToCart = item => {
    setCart(c => {
      const existing = c.findIndex(x => x.id === item.id && !x.notes);
      if (existing >= 0 && !item.qty) {
        const copy = c.slice();
        copy[existing] = {
          ...copy[existing],
          qty: copy[existing].qty + 1
        };
        return copy;
      }
      return [...c, {
        ...item,
        qty: item.qty || 1
      }];
    });
    setDrawerOpen(true);
  };
  const openProduct = item => setOpenedItem(item);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "shell"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "topnav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "topnav__inner"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setScreen('home'),
    className: "topnav__logo"
  }, /*#__PURE__*/React.createElement(Logo, {
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "topnav__center"
  }, [['home', tr('nav.home')], ['menu', tr('nav.menu')], ['rewards', tr('nav.rewards')], ['dashboard', tr('nav.account')]].map(([id, label]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    className: "tab",
    "data-active": screen === id,
    onClick: () => {
      setScreen(id);
      window.scrollTo({
        top: 0,
        behavior: 'auto'
      });
    }
  }, label))), /*#__PURE__*/React.createElement("div", {
    className: "topnav__right"
  }, /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: toggle,
    title: "Language"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--f-mono)',
      fontSize: 10,
      letterSpacing: '0.08em'
    }
  }, tr('nav.language'))), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    title: "Wishlist"
  }, "\u2661"), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn",
    onClick: () => setDrawerOpen(true),
    title: "Cart",
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "\u25EF"), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: -4,
      right: -4,
      background: 'var(--burgundy)',
      color: 'var(--ivory)',
      borderRadius: 999,
      fontSize: 10,
      padding: '2px 6px',
      fontFamily: 'var(--f-mono)',
      border: '2px solid var(--ivory)'
    }
  }, cartCount)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn--ink btn--sm",
    onClick: () => setScreen('menu')
  }, tr('nav.order'))))), /*#__PURE__*/React.createElement("main", null, screen === 'home' && /*#__PURE__*/React.createElement(HomeScreen, {
    go: setScreen,
    addToCart: addToCart,
    openProduct: openProduct
  }), screen === 'menu' && /*#__PURE__*/React.createElement(MenuScreen, {
    go: setScreen,
    addToCart: addToCart,
    openProduct: openProduct,
    cart: cart
  }), screen === 'rewards' && /*#__PURE__*/React.createElement(RewardsScreen, {
    go: setScreen
  }), screen === 'dashboard' && /*#__PURE__*/React.createElement(DashboardScreen, {
    go: setScreen
  })), /*#__PURE__*/React.createElement(CartDrawer, {
    open: drawerOpen,
    onClose: () => setDrawerOpen(false),
    cart: cart,
    setCart: setCart,
    go: setScreen
  }), /*#__PURE__*/React.createElement(ProductDetail, {
    item: openedItem,
    onClose: () => setOpenedItem(null),
    onAdd: addToCart
  }), /*#__PURE__*/React.createElement("nav", {
    className: "mobile-bottom-nav"
  }, [['home', tr('nav.home'), '⌂'], ['menu', tr('nav.menu'), '☰'], ['rewards', tr('nav.rewards'), '✦'], ['dashboard', tr('nav.account'), '◔']].map(([id, label, glyph]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    "data-active": screen === id,
    onClick: () => {
      setScreen(id);
      window.scrollTo({
        top: 0
      });
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, glyph), /*#__PURE__*/React.createElement("span", null, label))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setDrawerOpen(true),
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "glyph"
  }, "\u25EF"), /*#__PURE__*/React.createElement("span", null, tr('nav.cart'), cartCount > 0 ? ` · ${cartCount}` : ''))), /*#__PURE__*/React.createElement(TweaksPanel, {
    title: "Tweaks"
  }, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Palette"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Tone",
    value: tw.palette,
    onChange: v => setTw('palette', v),
    options: [{
      value: 'warm',
      label: 'Warm'
    }, {
      value: 'sand',
      label: 'Sand'
    }, {
      value: 'midnight',
      label: 'Night'
    }]
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Quick jump"
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Home",
    onClick: () => setScreen('home')
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Menu",
    onClick: () => setScreen('menu')
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Rewards",
    onClick: () => setScreen('rewards')
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Account",
    onClick: () => setScreen('dashboard')
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Demo"
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Add Pistachio Latte",
    onClick: () => {
      addToCart(window.BAREEQ.ITEMS.find(i => i.id === 'pis'));
    }
  }), /*#__PURE__*/React.createElement(TweakButton, {
    label: "Open product modal",
    onClick: () => setOpenedItem(window.BAREEQ.ITEMS.find(i => i.id === 'mdl'))
  })));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(LangProvider, null, /*#__PURE__*/React.createElement(App, null)));
