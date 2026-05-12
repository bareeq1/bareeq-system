// ============================================================
//  Bareeq | بريق  ·  Data
// ============================================================

const CATEGORIES = [{
  id: "signature",
  label: "Signature",
  ar: "المميزة",
  glyph: "✦"
}, {
  id: "coffee",
  label: "Coffee",
  ar: "قهوة",
  glyph: "◐"
}, {
  id: "cold",
  label: "Cold",
  ar: "باردة",
  glyph: "◇"
}, {
  id: "blended",
  label: "Blended",
  ar: "مخفوقة",
  glyph: "◯"
}, {
  id: "matcha",
  label: "Matcha",
  ar: "ماتشا",
  glyph: "❋"
}, {
  id: "refresher",
  label: "Refreshers",
  ar: "منعشة",
  glyph: "≈"
}, {
  id: "juice",
  label: "Juice",
  ar: "عصائر",
  glyph: "◔"
}, {
  id: "dessert",
  label: "Dessert",
  ar: "حلويات",
  glyph: "❀"
}, {
  id: "bakery",
  label: "Bakery",
  ar: "مخبوزات",
  glyph: "❒"
}, {
  id: "cookies",
  label: "Cookies",
  ar: "كوكيز",
  glyph: "✿"
}, {
  id: "beans",
  label: "Coffee Beans",
  ar: "حبوب",
  glyph: "●"
}];

// "tone" maps to .ph--{tone} placeholder swatch
const ITEMS = [
// SIGNATURE / WINTER
{
  id: "fic",
  cat: "signature",
  name: "Fruity Ice Chocolate",
  ar: "فروتي آيس شوكولاتة",
  desc: "Fruity & chocolate · whipped cream cap, berries",
  price: 120,
  tone: "berry",
  flag: "new",
  calories: 320
}, {
  id: "trh",
  cat: "signature",
  name: "Tropical Hibiscus",
  ar: "كركديه استوائي",
  desc: "Hibiscus, passion, lemon, soda",
  price: 100,
  tone: "berry",
  flag: "new",
  calories: 90
}, {
  id: "shc",
  cat: "signature",
  name: "Strawberry Hot Chocolate",
  ar: "شوكولاتة ساخنة بالفراولة",
  desc: "Winter ritual · strawberry cream, dark cocoa",
  price: 100,
  tone: "burgundy",
  flag: "winter",
  calories: 380
}, {
  id: "bhc",
  cat: "signature",
  name: "Bueno Hot Chocolate",
  ar: "بوينو شوكولاتة ساخنة",
  desc: "Hazelnut praline, milk foam crown",
  price: 100,
  tone: "coffee",
  flag: "winter",
  calories: 410
}, {
  id: "aero",
  cat: "signature",
  name: "Aeropress · Brew Bar",
  ar: "إيروبريس",
  desc: "Single-origin pour · clean, citric, weightless",
  price: 100,
  tone: "ink",
  flag: "brew",
  calories: 5
}, {
  id: "v60",
  cat: "signature",
  name: "V60 · Brew Bar",
  ar: "V60",
  desc: "Chemex-style filter · slow extraction, 4 min",
  price: 120,
  tone: "ink",
  flag: "new",
  calories: 5
},
// COFFEE
{
  id: "mdl",
  cat: "coffee",
  name: "Medjool Date Latte",
  ar: "لاتيه التمر",
  desc: "Medjool dates, espresso, milk, cinnamon",
  price: 110,
  tone: "coffee",
  flag: "signature",
  calories: 240
}, {
  id: "pis",
  cat: "coffee",
  name: "Pistachio Latte",
  ar: "لاتيه فستق",
  desc: "Pistachio, milk, espresso, a touch of bareeq",
  price: 130,
  tone: "pistachio",
  flag: "bestseller",
  calories: 260
}, {
  id: "spa",
  cat: "coffee",
  name: "Spanish Latte",
  ar: "لاتيه إسباني",
  desc: "Condensed milk, espresso, milk",
  price: 115,
  tone: "cream",
  calories: 290
}, {
  id: "wmoc",
  cat: "coffee",
  name: "White Mocha",
  ar: "وايت موكا",
  desc: "White chocolate, espresso, milk",
  price: 115,
  tone: "cream",
  calories: 310
}, {
  id: "moc",
  cat: "coffee",
  name: "Mocha",
  ar: "موكا",
  desc: "Chocolate, fresh milk, espresso",
  price: 110,
  tone: "coffee",
  calories: 290
}, {
  id: "scl",
  cat: "coffee",
  name: "Salted Caramel Latte",
  ar: "كراميل بالملح",
  desc: "Milk, espresso, salted caramel",
  price: 110,
  tone: "gold",
  calories: 280
}, {
  id: "cap",
  cat: "coffee",
  name: "Cappuccino",
  ar: "كابتشينو",
  desc: "Milk, espresso, foam crown",
  price: 85,
  tone: "coffee",
  calories: 140
}, {
  id: "lat",
  cat: "coffee",
  name: "Latte",
  ar: "لاتيه",
  desc: "Fresh milk, espresso, magic",
  price: 100,
  tone: "coffee",
  calories: 200
}, {
  id: "cor",
  cat: "coffee",
  name: "Cortado",
  ar: "كورتادو",
  desc: "Espresso · milk · light foam",
  price: 70,
  tone: "coffee",
  calories: 120
}, {
  id: "fw",
  cat: "coffee",
  name: "Flat White",
  ar: "فلات وايت",
  desc: "Espresso · milk · velvet foam",
  price: 80,
  tone: "coffee",
  calories: 150
}, {
  id: "ccl",
  cat: "coffee",
  name: "Cinnamon Caramel Latte",
  ar: "قرفة وكراميل",
  desc: "Cinnamon, caramel, milk, espresso",
  price: 110,
  tone: "gold",
  calories: 270
}, {
  id: "am",
  cat: "coffee",
  name: "Americano",
  ar: "أمريكانو",
  desc: "Espresso + hot water",
  price: 70,
  tone: "coffee",
  calories: 5
}, {
  id: "esp",
  cat: "coffee",
  name: "Espresso",
  ar: "إسبريسو",
  desc: "Specialty single shot",
  price: 60,
  tone: "ink",
  calories: 5
}, {
  id: "tur",
  cat: "coffee",
  name: "قهوة تركي",
  ar: "Turkish Coffee",
  desc: "Slow simmered · Brazilian + Colombian blend",
  price: 35,
  tone: "ink",
  calories: 5
}, {
  id: "mac",
  cat: "coffee",
  name: "Macchiato",
  ar: "ماكياتو",
  desc: "Espresso · a kiss of foam",
  price: 60,
  tone: "coffee",
  calories: 80
}, {
  id: "hcm",
  cat: "coffee",
  name: "Hot Caramel Macchiato",
  ar: "كراميل ماكياتو",
  desc: "Caramel, milk, espresso, vanilla",
  price: 115,
  tone: "gold",
  calories: 280
},
// COLD
{
  id: "iam",
  cat: "cold",
  name: "Iced Americano",
  ar: "أيس أمريكانو",
  desc: "Espresso · ice · water",
  price: 70,
  tone: "coffee",
  calories: 5
}, {
  id: "ipis",
  cat: "cold",
  name: "Iced Pistachio Latte",
  ar: "أيس فستق",
  desc: "Pistachio, milk, espresso",
  price: 130,
  tone: "pistachio",
  flag: "bestseller",
  calories: 280
}, {
  id: "icm",
  cat: "cold",
  name: "Iced Caramel Macchiato",
  ar: "أيس كراميل",
  desc: "Caramel, milk, espresso, vanilla",
  price: 115,
  tone: "gold",
  calories: 290
}, {
  id: "iwm",
  cat: "cold",
  name: "Iced Shaken White Mocha",
  ar: "أيس وايت موكا",
  desc: "White mocha, espresso, milk",
  price: 115,
  tone: "cream",
  calories: 320
}, {
  id: "imo",
  cat: "cold",
  name: "Iced Mocha",
  ar: "أيس موكا",
  desc: "Chocolate, espresso, milk",
  price: 115,
  tone: "coffee",
  calories: 300
}, {
  id: "iscl",
  cat: "cold",
  name: "Iced Salted Caramel Latte",
  ar: "أيس كراميل بالملح",
  desc: "Milk, espresso, salted caramel",
  price: 115,
  tone: "gold",
  calories: 290
}, {
  id: "isp",
  cat: "cold",
  name: "Iced Spanish Latte",
  ar: "أيس إسباني",
  desc: "Milk, espresso, condensed milk",
  price: 115,
  tone: "cream",
  calories: 300
}, {
  id: "ilat",
  cat: "cold",
  name: "Iced Latte",
  ar: "أيس لاتيه",
  desc: "Milk · espresso · ice",
  price: 100,
  tone: "coffee",
  calories: 210
},
// BLENDED
{
  id: "pcb",
  cat: "blended",
  name: "Pistachio Cream Blend",
  ar: "فستق بلند",
  desc: "Pistachio cream, espresso, vanilla milk",
  price: 130,
  tone: "pistachio",
  calories: 360
}, {
  id: "carb",
  cat: "blended",
  name: "Caramel Blend",
  ar: "كراميل بلند",
  desc: "Caramel, milk powder, vanilla, espresso",
  price: 120,
  tone: "gold",
  calories: 340
}, {
  id: "wmb",
  cat: "blended",
  name: "White Mocha Blend",
  ar: "وايت موكا بلند",
  desc: "White chocolate, vanilla milk, espresso",
  price: 120,
  tone: "cream",
  calories: 360
}, {
  id: "scb",
  cat: "blended",
  name: "Salted Caramel Blend",
  ar: "كراميل ملح بلند",
  desc: "Salted caramel, milk, espresso, ice",
  price: 120,
  tone: "gold",
  calories: 340
}, {
  id: "mob",
  cat: "blended",
  name: "Mocha Blend",
  ar: "موكا بلند",
  desc: "Chocolate, fresh milk, espresso",
  price: 120,
  tone: "coffee",
  calories: 340
}, {
  id: "lab",
  cat: "blended",
  name: "Latte Blend",
  ar: "لاتيه بلند",
  desc: "Milk, espresso, vanilla ice",
  price: 100,
  tone: "coffee",
  calories: 280
}, {
  id: "spb",
  cat: "blended",
  name: "Spanish Blend",
  ar: "إسباني بلند",
  desc: "Condensed milk, espresso, vanilla, ice",
  price: 120,
  tone: "cream",
  calories: 320
}, {
  id: "onc",
  cat: "blended",
  name: "Oreo Nutella Cream",
  ar: "أوريو نوتيلا",
  desc: "Oreo, Nutella, vanilla powder",
  price: 100,
  tone: "ink",
  calories: 380
}, {
  id: "svc",
  cat: "blended",
  name: "Strawberry Vanilla Cream",
  ar: "فراولة وفانيليا",
  desc: "Strawberry, vanilla, ice, whipped cream",
  price: 100,
  tone: "berry",
  calories: 320
}, {
  id: "blu",
  cat: "blended",
  name: "Blueberry",
  ar: "توت أزرق",
  desc: "Blueberries, vanilla, ice, whipped",
  price: 89,
  tone: "berry",
  calories: 280
},
// MATCHA
{
  id: "hsm",
  cat: "matcha",
  name: "Hot Spanish Matcha",
  ar: "ماتشا إسباني ساخن",
  desc: "Japanese ceremonial matcha, condensed milk",
  price: 120,
  tone: "matcha",
  flag: "new",
  calories: 220
}, {
  id: "jcsm",
  cat: "matcha",
  name: "Japanese Cream Spanish Matcha",
  ar: "ماتشا كريم إسباني",
  desc: "Ceremonial grade · cream cap",
  price: 120,
  tone: "matcha",
  calories: 280
}, {
  id: "jbmc",
  cat: "matcha",
  name: "Japanese Blueberry Matcha Cream",
  ar: "ماتشا توت كريم",
  desc: "Blueberry compote, matcha, cream",
  price: 120,
  tone: "matcha",
  flag: "new",
  calories: 290
}, {
  id: "jiwc",
  cat: "matcha",
  name: "Iced White Chocolate Matcha",
  ar: "ماتشا وايت شوكولاتة بارد",
  desc: "White chocolate, ceremonial matcha, ice",
  price: 120,
  tone: "matcha",
  calories: 280
}, {
  id: "jml",
  cat: "matcha",
  name: "Japanese Matcha Latte",
  ar: "ماتشا لاتيه",
  desc: "Ceremonial matcha, milk",
  price: 120,
  tone: "matcha",
  flag: "signature",
  calories: 180
}, {
  id: "jwmb",
  cat: "matcha",
  name: "White Chocolate Matcha Blend",
  ar: "ماتشا بلند",
  desc: "Matcha, white chocolate, blended",
  price: 120,
  tone: "matcha",
  calories: 320
}, {
  id: "jcm",
  cat: "matcha",
  name: "Japanese Cream Matcha",
  ar: "ماتشا كريم",
  desc: "Milk powder, vanilla, ceremonial matcha",
  price: 120,
  tone: "matcha",
  flag: "new",
  calories: 280
},
// REFRESHERS
{
  id: "sbl",
  cat: "refresher",
  name: "Sunshine Blue Lemonade",
  ar: "ليمونادة زرقاء",
  desc: "Blue lemon, lemon, mint, soda",
  price: 80,
  tone: "berry",
  calories: 90
}, {
  id: "sst",
  cat: "refresher",
  name: "Sunshine Strawberry",
  ar: "فراولة منعشة",
  desc: "Strawberry, lemon, mint, soda",
  price: 80,
  tone: "berry",
  calories: 100
}, {
  id: "spe",
  cat: "refresher",
  name: "Sunshine Peach",
  ar: "خوخ منعش",
  desc: "Peach, lemon, mint, soda",
  price: 80,
  tone: "orange",
  calories: 100
}, {
  id: "sbb",
  cat: "refresher",
  name: "Sunshine Blueberry",
  ar: "توت منعش",
  desc: "Blueberry, lemon, mint, soda",
  price: 80,
  tone: "berry",
  calories: 95
}, {
  id: "spf",
  cat: "refresher",
  name: "Sunshine Passion Fruit",
  ar: "باشن منعش",
  desc: "Passion fruit soda",
  price: 80,
  tone: "orange",
  calories: 95
}, {
  id: "slm",
  cat: "refresher",
  name: "Sunshine Lemon Mint",
  ar: "ليمون نعناع",
  desc: "Lemon, mint, soda",
  price: 80,
  tone: "matcha",
  calories: 80
}, {
  id: "pit",
  cat: "refresher",
  name: "Peach Iced Tea",
  ar: "شاي خوخ بارد",
  desc: "Brewed tea, peach, ice",
  price: 80,
  tone: "orange",
  calories: 110
}, {
  id: "lpf",
  cat: "refresher",
  name: "Lemon Passion Fruit",
  ar: "ليمون باشن",
  desc: "Lemon, tropical fruits",
  price: 80,
  tone: "orange",
  calories: 100
},
// JUICE
{
  id: "wat",
  cat: "juice",
  name: "Watermelon",
  ar: "بطيخ",
  desc: "Watermelon, sugar, ice",
  price: 80,
  tone: "berry",
  flag: "new",
  calories: 110
}, {
  id: "msm",
  cat: "juice",
  name: "Mango Smoothie",
  ar: "مانجو سموذي",
  desc: "Fresh mango smoothie",
  price: 70,
  tone: "orange",
  calories: 180
}, {
  id: "mng",
  cat: "juice",
  name: "Mango",
  ar: "مانجو",
  desc: "Fresh-pressed mango",
  price: 60,
  tone: "orange",
  calories: 130
}, {
  id: "bsm",
  cat: "juice",
  name: "Blueberry Smoothie",
  ar: "توت سموذي",
  desc: "Wild blueberry, water, bareeq",
  price: 80,
  tone: "berry",
  calories: 160
}, {
  id: "pfs",
  cat: "juice",
  name: "Passion Fruit Smoothie",
  ar: "باشن سموذي",
  desc: "Tropical fruits, snow, glitter",
  price: 80,
  tone: "orange",
  calories: 170
}, {
  id: "mlm",
  cat: "juice",
  name: "Mint Lemonade",
  ar: "ليمون نعناع",
  desc: "Lemonade, mint, ice, water",
  price: 60,
  tone: "matcha",
  calories: 120
}, {
  id: "foj",
  cat: "juice",
  name: "Fresh Orange Juice",
  ar: "عصير برتقال",
  desc: "Fresh-pressed orange",
  price: 60,
  tone: "orange",
  calories: 110
},
// DESSERT
{
  id: "rvc",
  cat: "dessert",
  name: "Red Velvet Cake",
  ar: "ريد فيلفت",
  desc: "Cream cheese frosting, slow-baked",
  price: 120,
  tone: "berry",
  flag: "new",
  calories: 420
}, {
  id: "cck",
  cat: "dessert",
  name: "Carrot Cake",
  ar: "كيك جزر",
  desc: "Walnut, cinnamon, cream cheese",
  price: 120,
  tone: "gold",
  flag: "new",
  calories: 410
}, {
  id: "ccs",
  cat: "dessert",
  name: "Classic Cheesecake",
  ar: "تشيز كيك",
  desc: "Plain · vanilla cream cheese",
  price: 80,
  tone: "cream",
  calories: 380
}, {
  id: "tir",
  cat: "dessert",
  name: "Italian Tiramisu",
  ar: "تيراميسو",
  desc: "Mascarpone, espresso, cocoa",
  price: 120,
  tone: "coffee",
  flag: "signature",
  calories: 440
}, {
  id: "rhc",
  cat: "dessert",
  name: "Russian Honey Cake",
  ar: "ميدوفيك",
  desc: "Layered honey, sour cream",
  price: 90,
  tone: "gold",
  calories: 380
}, {
  id: "ccw",
  cat: "dessert",
  name: "Chocolate Walnut Cake",
  ar: "كيك شوكولاتة جوز",
  desc: "Chocolate cake, fresh walnut",
  price: 100,
  tone: "coffee",
  calories: 430
}, {
  id: "ssc",
  cat: "dessert",
  name: "San Sebastian Cheesecake",
  ar: "سان سيباستيان",
  desc: "Burnt basque · roasted, jus",
  price: 90,
  tone: "gold",
  calories: 410
},
// BAKERY
{
  id: "tms",
  cat: "bakery",
  name: "Tuna Melt Sandwich",
  ar: "تونة ساندويتش",
  desc: "Tuna, vegetables, mayo, cheese, brown",
  price: 90,
  tone: "cream",
  flag: "new",
  calories: 480
}, {
  id: "don",
  cat: "bakery",
  name: "American Donuts",
  ar: "دونات",
  desc: "Glazed, fresh-fried",
  price: 80,
  tone: "cream",
  flag: "new",
  calories: 320
}, {
  id: "but",
  cat: "bakery",
  name: "Butter Croissant",
  ar: "كرواسون زبدة",
  desc: "Layers of cultured butter",
  price: 50,
  tone: "gold",
  calories: 280
}, {
  id: "pic",
  cat: "bakery",
  name: "Pistachio Croissant",
  ar: "كرواسون فستق",
  desc: "Butter croissant, pistachio cream",
  price: 100,
  tone: "pistachio",
  flag: "signature",
  calories: 380
}, {
  id: "ssw",
  cat: "bakery",
  name: "Turkish Chicken Sandwich",
  ar: "ساندويتش تركي",
  desc: "Chicken, cheese, lettuce, pepper, mayo",
  price: 95,
  tone: "cream",
  calories: 420
}, {
  id: "tcc",
  cat: "bakery",
  name: "Turkish Cheese Croissant",
  ar: "كرواسون جبن",
  desc: "Croissant, cheese, Turkish chicken, lettuce",
  price: 85,
  tone: "gold",
  calories: 380
}, {
  id: "nuc",
  cat: "bakery",
  name: "Nutella Croissant",
  ar: "كرواسون نوتيلا",
  desc: "Butter croissant, Nutella",
  price: 80,
  tone: "coffee",
  calories: 360
}, {
  id: "cir",
  cat: "bakery",
  name: "Cinnamon Roll",
  ar: "سينامون رول",
  desc: "Soft cinnamon cake roll",
  price: 80,
  tone: "gold",
  calories: 380
},
// COOKIES
{
  id: "svck",
  cat: "cookies",
  name: "Spice Vanilla Cookies",
  ar: "كوكيز فانيليا",
  desc: "White & Belgian chocolate, cinnamon",
  price: 70,
  tone: "cream",
  calories: 220
}, {
  id: "nuck",
  cat: "cookies",
  name: "Nutella Cookies",
  ar: "كوكيز نوتيلا",
  desc: "Nutella centre · soft bake",
  price: 70,
  tone: "coffee",
  calories: 240
}, {
  id: "kic",
  cat: "cookies",
  name: "Kinder Cookies",
  ar: "كوكيز كيندر",
  desc: "Kinder · milk chocolate",
  price: 85,
  tone: "cream",
  calories: 250
}, {
  id: "orc",
  cat: "cookies",
  name: "Original Cookie",
  ar: "كوكيز كلاسيك",
  desc: "House blend · double choc",
  price: 70,
  tone: "coffee",
  calories: 230
},
// BEANS
{
  id: "btr",
  cat: "beans",
  name: "Turkish Coffee Blend",
  ar: "بن تركي",
  desc: "Brazilian + Colombian · finely ground · 250g",
  price: 270,
  tone: "burgundy",
  flag: "new",
  calories: null
}, {
  id: "bmw",
  cat: "beans",
  name: "Milky Way Blend",
  ar: "ميلكي واي",
  desc: "Brazil + Colombia · whole bean · 250g",
  price: 450,
  tone: "burgundy",
  flag: "signature",
  calories: null
}, {
  id: "bbz",
  cat: "beans",
  name: "Brazilian Black Diamond",
  ar: "بن برازيلي",
  desc: "Single-origin · 100% Arabica · 250g",
  price: 550,
  tone: "burgundy",
  calories: null
}, {
  id: "bet",
  cat: "beans",
  name: "Ethiopian Specialty",
  ar: "بن إثيوبي",
  desc: "Yirgacheffe · floral, citrus, jasmine · 250g",
  price: 650,
  tone: "burgundy",
  flag: "bestseller",
  calories: null
}];
const ADDONS = [{
  id: "strawberry",
  label: "Strawberry",
  price: 30
}, {
  id: "blueberry",
  label: "Blueberry",
  price: 30
}, {
  id: "caramel",
  label: "Caramel",
  price: 25
}, {
  id: "pistachio",
  label: "Pistachio",
  price: 35
}, {
  id: "nutella",
  label: "Nutella",
  price: 30
}];
const MILKS = [{
  id: "fresh",
  label: "Fresh whole",
  delta: 0
}, {
  id: "skim",
  label: "Skim",
  delta: 0
}, {
  id: "oat",
  label: "Oat",
  delta: 15
}, {
  id: "almond",
  label: "Almond",
  delta: 15
}, {
  id: "coconut",
  label: "Coconut",
  delta: 15
}];
const SIZES = [{
  id: "single",
  label: "Single",
  delta: 0
}, {
  id: "double",
  label: "Double",
  delta: 15
}, {
  id: "grand",
  label: "Grand",
  delta: 25
}];
const TIERS = [{
  id: "bronze",
  label: "Bronze",
  min: 0,
  max: 250,
  perks: ["Birthday drink", "Free Wi-Fi lounge"]
}, {
  id: "silver",
  label: "Silver",
  min: 250,
  max: 750,
  perks: ["10% off pastries", "Free milk upgrade"]
}, {
  id: "gold",
  label: "Gold",
  min: 750,
  max: 1800,
  perks: ["Free drink weekly", "Priority brew bar", "Cupping invites"]
}, {
  id: "vip",
  label: "VIP",
  min: 1800,
  max: 9999,
  perks: ["Concierge ordering", "Reserved seat", "Beans drop · first access", "Annual roastery dinner"]
}];
const BADGES = [{
  id: "first",
  label: "First Sip",
  sub: "First order placed",
  earned: true,
  glyph: "✦"
}, {
  id: "streak7",
  label: "Seven Mornings",
  sub: "7-day streak",
  earned: true,
  glyph: "◔"
}, {
  id: "matcha",
  label: "Matcha Master",
  sub: "Tried all matcha",
  earned: true,
  glyph: "❋"
}, {
  id: "brewbar",
  label: "Brew Bar Initiate",
  sub: "Tried Aeropress + V60",
  earned: true,
  glyph: "◐"
}, {
  id: "winter",
  label: "Winter Ritual",
  sub: "3 hot chocolates",
  earned: false,
  glyph: "❄"
}, {
  id: "signature",
  label: "House Signature",
  sub: "Order 5 signatures",
  earned: false,
  glyph: "✧"
}, {
  id: "beans",
  label: "Bean Collector",
  sub: "Buy 3 bean SKUs",
  earned: false,
  glyph: "●"
}, {
  id: "vip",
  label: "Inner Circle",
  sub: "Reach VIP",
  earned: false,
  glyph: "♛"
}];
const ORDERS = [{
  id: "BR-2841",
  date: "May 09 · 08:24",
  items: ["Pistachio Latte", "Butter Croissant"],
  total: 180,
  status: "Delivered",
  points: 18
}, {
  id: "BR-2807",
  date: "May 06 · 07:51",
  items: ["Iced Spanish Latte", "Pistachio Croissant"],
  total: 215,
  status: "Delivered",
  points: 22
}, {
  id: "BR-2782",
  date: "May 03 · 16:12",
  items: ["Japanese Matcha Latte"],
  total: 120,
  status: "Delivered",
  points: 12
}, {
  id: "BR-2764",
  date: "Apr 30 · 09:03",
  items: ["Medjool Date Latte", "Original Cookie"],
  total: 180,
  status: "Delivered",
  points: 18
}, {
  id: "BR-2741",
  date: "Apr 27 · 11:40",
  items: ["Tropical Hibiscus"],
  total: 100,
  status: "Delivered",
  points: 10
}];
const TESTIMONIALS = [{
  id: 1,
  body: "The pistachio latte ruined every other coffee for me. The dates one tastes like a memory.",
  who: "Yara H.",
  role: "Cairo · Gold member",
  tone: "pistachio"
}, {
  id: 2,
  body: "Their brew bar is the closest thing to a third-wave Tokyo café I've found in Egypt.",
  who: "Karim S.",
  role: "Helwan · Silver",
  tone: "ink"
}, {
  id: 3,
  body: "بريق is the only place I bring out-of-town friends. The matcha is genuinely ceremonial grade.",
  who: "Salma N.",
  role: "Maadi · VIP",
  tone: "matcha"
}];
const COUPONS = [{
  id: "WINTER25",
  label: "Winter Warmer",
  sub: "25% off all hot chocolates",
  expiry: "Ends May 21",
  flavor: "burgundy"
}, {
  id: "MATCHA2x1",
  label: "Matcha Hour",
  sub: "Buy 1 matcha · get 1 free, 3–5pm",
  expiry: "Daily",
  flavor: "matcha"
}, {
  id: "BEANS150",
  label: "Bean Drop",
  sub: "EGP 150 off any 250g bag",
  expiry: "Ends Jun 02",
  flavor: "ink"
}, {
  id: "BIRTHDAY",
  label: "On The House",
  sub: "Any signature drink · birthday week",
  expiry: "Personalized",
  flavor: "gold"
}];
window.BAREEQ = {
  CATEGORIES,
  ITEMS,
  ADDONS,
  MILKS,
  SIZES,
  TIERS,
  BADGES,
  ORDERS,
  TESTIMONIALS,
  COUPONS
};
