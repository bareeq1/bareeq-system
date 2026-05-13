using Bareeq.Api.Entities;

namespace Bareeq.Api.Data;

public static class CatalogSeed
{
    public static Category[] Categories() =>
    [
        new Category { Id = "signature", LabelEn = "Signature", LabelAr = "المميزة", Glyph = "✦", SortOrder = 1 },
        new Category { Id = "coffee", LabelEn = "Coffee", LabelAr = "قهوة", Glyph = "◐", SortOrder = 2 },
        new Category { Id = "cold", LabelEn = "Cold", LabelAr = "باردة", Glyph = "◇", SortOrder = 3 },
        new Category { Id = "blended", LabelEn = "Blended", LabelAr = "مخفوقة", Glyph = "◯", SortOrder = 4 },
        new Category { Id = "matcha", LabelEn = "Matcha", LabelAr = "ماتشا", Glyph = "❋", SortOrder = 5 },
        new Category { Id = "refresher", LabelEn = "Refreshers", LabelAr = "منعشة", Glyph = "≈", SortOrder = 6 },
        new Category { Id = "juice", LabelEn = "Juice", LabelAr = "عصائر", Glyph = "◔", SortOrder = 7 },
        new Category { Id = "dessert", LabelEn = "Dessert", LabelAr = "حلويات", Glyph = "❀", SortOrder = 8 },
        new Category { Id = "bakery", LabelEn = "Bakery", LabelAr = "مخبوزات", Glyph = "❒", SortOrder = 9 },
        new Category { Id = "cookies", LabelEn = "Cookies", LabelAr = "كوكيز", Glyph = "✿", SortOrder = 10 },
        new Category { Id = "beans", LabelEn = "Coffee Beans", LabelAr = "حبوب", Glyph = "●", SortOrder = 11 }
    ];

    public static Item[] Items() =>
    [
        new Item { Id = "fic", CategoryId = "signature", NameEn = "Fruity Ice Chocolate", NameAr = "فروتي آيس شوكولاتة", Description = "Fruity & chocolate · whipped cream cap, berries", Price = 120, Tone = "berry", Flag = "new", Calories = 320, SortOrder = 1 },
        new Item { Id = "trh", CategoryId = "signature", NameEn = "Tropical Hibiscus", NameAr = "كركديه استوائي", Description = "Hibiscus, passion, lemon, soda", Price = 100, Tone = "berry", Flag = "new", Calories = 90, SortOrder = 2 },
        new Item { Id = "shc", CategoryId = "signature", NameEn = "Strawberry Hot Chocolate", NameAr = "شوكولاتة ساخنة بالفراولة", Description = "Winter ritual · strawberry cream, dark cocoa", Price = 100, Tone = "burgundy", Flag = "winter", Calories = 380, SortOrder = 3 },
        new Item { Id = "bhc", CategoryId = "signature", NameEn = "Bueno Hot Chocolate", NameAr = "بوينو شوكولاتة ساخنة", Description = "Hazelnut praline, milk foam crown", Price = 100, Tone = "coffee", Flag = "winter", Calories = 410, SortOrder = 4 },
        new Item { Id = "aero", CategoryId = "signature", NameEn = "Aeropress · Brew Bar", NameAr = "إيروبريس", Description = "Single-origin pour · clean, citric, weightless", Price = 100, Tone = "ink", Flag = "brew", Calories = 5, SortOrder = 5 },
        new Item { Id = "v60", CategoryId = "signature", NameEn = "V60 · Brew Bar", NameAr = "V60", Description = "Chemex-style filter · slow extraction, 4 min", Price = 120, Tone = "ink", Flag = "new", Calories = 5, SortOrder = 6 },

        new Item { Id = "mdl", CategoryId = "coffee", NameEn = "Medjool Date Latte", NameAr = "لاتيه التمر", Description = "Medjool dates, espresso, milk, cinnamon", Price = 110, Tone = "coffee", Flag = "signature", Calories = 240, SortOrder = 7 },
        new Item { Id = "pis", CategoryId = "coffee", NameEn = "Pistachio Latte", NameAr = "لاتيه فستق", Description = "Pistachio, milk, espresso, a touch of bareeq", Price = 130, Tone = "pistachio", Flag = "bestseller", Calories = 260, SortOrder = 8 },
        new Item { Id = "spa", CategoryId = "coffee", NameEn = "Spanish Latte", NameAr = "لاتيه إسباني", Description = "Condensed milk, espresso, milk", Price = 115, Tone = "cream", Calories = 290, SortOrder = 9 },
        new Item { Id = "wmoc", CategoryId = "coffee", NameEn = "White Mocha", NameAr = "وايت موكا", Description = "White chocolate, espresso, milk", Price = 115, Tone = "cream", Calories = 310, SortOrder = 10 },
        new Item { Id = "moc", CategoryId = "coffee", NameEn = "Mocha", NameAr = "موكا", Description = "Chocolate, fresh milk, espresso", Price = 110, Tone = "coffee", Calories = 290, SortOrder = 11 },
        new Item { Id = "scl", CategoryId = "coffee", NameEn = "Salted Caramel Latte", NameAr = "كراميل بالملح", Description = "Milk, espresso, salted caramel", Price = 110, Tone = "gold", Calories = 280, SortOrder = 12 },
        new Item { Id = "cap", CategoryId = "coffee", NameEn = "Cappuccino", NameAr = "كابتشينو", Description = "Milk, espresso, foam crown", Price = 85, Tone = "coffee", Calories = 140, SortOrder = 13 },
        new Item { Id = "lat", CategoryId = "coffee", NameEn = "Latte", NameAr = "لاتيه", Description = "Fresh milk, espresso, magic", Price = 100, Tone = "coffee", Calories = 200, SortOrder = 14 },
        new Item { Id = "cor", CategoryId = "coffee", NameEn = "Cortado", NameAr = "كورتادو", Description = "Espresso · milk · light foam", Price = 70, Tone = "coffee", Calories = 120, SortOrder = 15 },
        new Item { Id = "fw", CategoryId = "coffee", NameEn = "Flat White", NameAr = "فلات وايت", Description = "Espresso · milk · velvet foam", Price = 80, Tone = "coffee", Calories = 150, SortOrder = 16 },
        new Item { Id = "ccl", CategoryId = "coffee", NameEn = "Cinnamon Caramel Latte", NameAr = "قرفة وكراميل", Description = "Cinnamon, caramel, milk, espresso", Price = 110, Tone = "gold", Calories = 270, SortOrder = 17 },
        new Item { Id = "am", CategoryId = "coffee", NameEn = "Americano", NameAr = "أمريكانو", Description = "Espresso + hot water", Price = 70, Tone = "coffee", Calories = 5, SortOrder = 18 },
        new Item { Id = "esp", CategoryId = "coffee", NameEn = "Espresso", NameAr = "إسبريسو", Description = "Specialty single shot", Price = 60, Tone = "ink", Calories = 5, SortOrder = 19 },
        new Item { Id = "tur", CategoryId = "coffee", NameEn = "Turkish Coffee", NameAr = "قهوة تركي", Description = "Slow simmered · Brazilian + Colombian blend", Price = 35, Tone = "ink", Calories = 5, SortOrder = 20 },
        new Item { Id = "mac", CategoryId = "coffee", NameEn = "Macchiato", NameAr = "ماكياتو", Description = "Espresso · a kiss of foam", Price = 60, Tone = "coffee", Calories = 80, SortOrder = 21 },
        new Item { Id = "hcm", CategoryId = "coffee", NameEn = "Hot Caramel Macchiato", NameAr = "كراميل ماكياتو", Description = "Caramel, milk, espresso, vanilla", Price = 115, Tone = "gold", Calories = 280, SortOrder = 22 },

        new Item { Id = "iam", CategoryId = "cold", NameEn = "Iced Americano", NameAr = "أيس أمريكانو", Description = "Espresso · ice · water", Price = 70, Tone = "coffee", Calories = 5, SortOrder = 23 },
        new Item { Id = "ipis", CategoryId = "cold", NameEn = "Iced Pistachio Latte", NameAr = "أيس فستق", Description = "Pistachio, milk, espresso", Price = 130, Tone = "pistachio", Flag = "bestseller", Calories = 280, SortOrder = 24 },
        new Item { Id = "icm", CategoryId = "cold", NameEn = "Iced Caramel Macchiato", NameAr = "أيس كراميل", Description = "Caramel, milk, espresso, vanilla", Price = 115, Tone = "gold", Calories = 290, SortOrder = 25 },
        new Item { Id = "iwm", CategoryId = "cold", NameEn = "Iced Shaken White Mocha", NameAr = "أيس وايت موكا", Description = "White mocha, espresso, milk", Price = 115, Tone = "cream", Calories = 320, SortOrder = 26 },
        new Item { Id = "imo", CategoryId = "cold", NameEn = "Iced Mocha", NameAr = "أيس موكا", Description = "Chocolate, espresso, milk", Price = 115, Tone = "coffee", Calories = 300, SortOrder = 27 },
        new Item { Id = "iscl", CategoryId = "cold", NameEn = "Iced Salted Caramel Latte", NameAr = "أيس كراميل بالملح", Description = "Milk, espresso, salted caramel", Price = 115, Tone = "gold", Calories = 290, SortOrder = 28 },
        new Item { Id = "isp", CategoryId = "cold", NameEn = "Iced Spanish Latte", NameAr = "أيس إسباني", Description = "Milk, espresso, condensed milk", Price = 115, Tone = "cream", Calories = 300, SortOrder = 29 },
        new Item { Id = "ilat", CategoryId = "cold", NameEn = "Iced Latte", NameAr = "أيس لاتيه", Description = "Milk · espresso · ice", Price = 100, Tone = "coffee", Calories = 210, SortOrder = 30 },

        new Item { Id = "pcb", CategoryId = "blended", NameEn = "Pistachio Cream Blend", NameAr = "فستق بلند", Description = "Pistachio cream, espresso, vanilla milk", Price = 130, Tone = "pistachio", Calories = 360, SortOrder = 31 },
        new Item { Id = "carb", CategoryId = "blended", NameEn = "Caramel Blend", NameAr = "كراميل بلند", Description = "Caramel, milk powder, vanilla, espresso", Price = 120, Tone = "gold", Calories = 340, SortOrder = 32 },
        new Item { Id = "wmb", CategoryId = "blended", NameEn = "White Mocha Blend", NameAr = "وايت موكا بلند", Description = "White chocolate, vanilla milk, espresso", Price = 120, Tone = "cream", Calories = 360, SortOrder = 33 },
        new Item { Id = "scb", CategoryId = "blended", NameEn = "Salted Caramel Blend", NameAr = "كراميل ملح بلند", Description = "Salted caramel, milk, espresso, ice", Price = 120, Tone = "gold", Calories = 340, SortOrder = 34 },
        new Item { Id = "mob", CategoryId = "blended", NameEn = "Mocha Blend", NameAr = "موكا بلند", Description = "Chocolate, fresh milk, espresso", Price = 120, Tone = "coffee", Calories = 340, SortOrder = 35 },
        new Item { Id = "lab", CategoryId = "blended", NameEn = "Latte Blend", NameAr = "لاتيه بلند", Description = "Milk, espresso, vanilla ice", Price = 100, Tone = "coffee", Calories = 280, SortOrder = 36 },
        new Item { Id = "spb", CategoryId = "blended", NameEn = "Spanish Blend", NameAr = "إسباني بلند", Description = "Condensed milk, espresso, vanilla, ice", Price = 120, Tone = "cream", Calories = 320, SortOrder = 37 },
        new Item { Id = "onc", CategoryId = "blended", NameEn = "Oreo Nutella Cream", NameAr = "أوريو نوتيلا", Description = "Oreo, Nutella, vanilla powder", Price = 100, Tone = "ink", Calories = 380, SortOrder = 38 },
        new Item { Id = "svc", CategoryId = "blended", NameEn = "Strawberry Vanilla Cream", NameAr = "فراولة وفانيليا", Description = "Strawberry, vanilla, ice, whipped cream", Price = 100, Tone = "berry", Calories = 320, SortOrder = 39 },
        new Item { Id = "blu", CategoryId = "blended", NameEn = "Blueberry", NameAr = "توت أزرق", Description = "Blueberries, vanilla, ice, whipped", Price = 89, Tone = "berry", Calories = 280, SortOrder = 40 },

        new Item { Id = "hsm", CategoryId = "matcha", NameEn = "Hot Spanish Matcha", NameAr = "ماتشا إسباني ساخن", Description = "Japanese ceremonial matcha, condensed milk", Price = 120, Tone = "matcha", Flag = "new", Calories = 220, SortOrder = 41 },
        new Item { Id = "jcsm", CategoryId = "matcha", NameEn = "Japanese Cream Spanish Matcha", NameAr = "ماتشا كريم إسباني", Description = "Ceremonial grade · cream cap", Price = 120, Tone = "matcha", Calories = 280, SortOrder = 42 },
        new Item { Id = "jbmc", CategoryId = "matcha", NameEn = "Japanese Blueberry Matcha Cream", NameAr = "ماتشا توت كريم", Description = "Blueberry compote, matcha, cream", Price = 120, Tone = "matcha", Flag = "new", Calories = 290, SortOrder = 43 },
        new Item { Id = "jiwc", CategoryId = "matcha", NameEn = "Iced White Chocolate Matcha", NameAr = "ماتشا وايت شوكولاتة بارد", Description = "White chocolate, ceremonial matcha, ice", Price = 120, Tone = "matcha", Calories = 280, SortOrder = 44 },
        new Item { Id = "jml", CategoryId = "matcha", NameEn = "Japanese Matcha Latte", NameAr = "ماتشا لاتيه", Description = "Ceremonial matcha, milk", Price = 120, Tone = "matcha", Flag = "signature", Calories = 180, SortOrder = 45 },
        new Item { Id = "jwmb", CategoryId = "matcha", NameEn = "White Chocolate Matcha Blend", NameAr = "ماتشا بلند", Description = "Matcha, white chocolate, blended", Price = 120, Tone = "matcha", Calories = 320, SortOrder = 46 },
        new Item { Id = "jcm", CategoryId = "matcha", NameEn = "Japanese Cream Matcha", NameAr = "ماتشا كريم", Description = "Milk powder, vanilla, ceremonial matcha", Price = 120, Tone = "matcha", Flag = "new", Calories = 280, SortOrder = 47 },

        new Item { Id = "sbl", CategoryId = "refresher", NameEn = "Sunshine Blue Lemonade", NameAr = "ليمونادة زرقاء", Description = "Blue lemon, lemon, mint, soda", Price = 80, Tone = "berry", Calories = 90, SortOrder = 48 },
        new Item { Id = "sst", CategoryId = "refresher", NameEn = "Sunshine Strawberry", NameAr = "فراولة منعشة", Description = "Strawberry, lemon, mint, soda", Price = 80, Tone = "berry", Calories = 100, SortOrder = 49 },
        new Item { Id = "spe", CategoryId = "refresher", NameEn = "Sunshine Peach", NameAr = "خوخ منعش", Description = "Peach, lemon, mint, soda", Price = 80, Tone = "orange", Calories = 100, SortOrder = 50 },
        new Item { Id = "sbb", CategoryId = "refresher", NameEn = "Sunshine Blueberry", NameAr = "توت منعش", Description = "Blueberry, lemon, mint, soda", Price = 80, Tone = "berry", Calories = 95, SortOrder = 51 },
        new Item { Id = "spf", CategoryId = "refresher", NameEn = "Sunshine Passion Fruit", NameAr = "باشن منعش", Description = "Passion fruit soda", Price = 80, Tone = "orange", Calories = 95, SortOrder = 52 },
        new Item { Id = "slm", CategoryId = "refresher", NameEn = "Sunshine Lemon Mint", NameAr = "ليمون نعناع", Description = "Lemon, mint, soda", Price = 80, Tone = "matcha", Calories = 80, SortOrder = 53 },
        new Item { Id = "pit", CategoryId = "refresher", NameEn = "Peach Iced Tea", NameAr = "شاي خوخ بارد", Description = "Brewed tea, peach, ice", Price = 80, Tone = "orange", Calories = 110, SortOrder = 54 },
        new Item { Id = "lpf", CategoryId = "refresher", NameEn = "Lemon Passion Fruit", NameAr = "ليمون باشن", Description = "Lemon, tropical fruits", Price = 80, Tone = "orange", Calories = 100, SortOrder = 55 },

        new Item { Id = "wat", CategoryId = "juice", NameEn = "Watermelon", NameAr = "بطيخ", Description = "Watermelon, sugar, ice", Price = 80, Tone = "berry", Flag = "new", Calories = 110, SortOrder = 56 },
        new Item { Id = "msm", CategoryId = "juice", NameEn = "Mango Smoothie", NameAr = "مانجو سموذي", Description = "Fresh mango smoothie", Price = 70, Tone = "orange", Calories = 180, SortOrder = 57 },
        new Item { Id = "mng", CategoryId = "juice", NameEn = "Mango", NameAr = "مانجو", Description = "Fresh-pressed mango", Price = 60, Tone = "orange", Calories = 130, SortOrder = 58 },
        new Item { Id = "bsm", CategoryId = "juice", NameEn = "Blueberry Smoothie", NameAr = "توت سموذي", Description = "Wild blueberry, water, bareeq", Price = 80, Tone = "berry", Calories = 160, SortOrder = 59 },
        new Item { Id = "pfs", CategoryId = "juice", NameEn = "Passion Fruit Smoothie", NameAr = "باشن سموذي", Description = "Tropical fruits, snow, glitter", Price = 80, Tone = "orange", Calories = 170, SortOrder = 60 },
        new Item { Id = "mlm", CategoryId = "juice", NameEn = "Mint Lemonade", NameAr = "ليمون نعناع", Description = "Lemonade, mint, ice, water", Price = 60, Tone = "matcha", Calories = 120, SortOrder = 61 },
        new Item { Id = "foj", CategoryId = "juice", NameEn = "Fresh Orange Juice", NameAr = "عصير برتقال", Description = "Fresh-pressed orange", Price = 60, Tone = "orange", Calories = 110, SortOrder = 62 },

        new Item { Id = "rvc", CategoryId = "dessert", NameEn = "Red Velvet Cake", NameAr = "ريد فيلفت", Description = "Cream cheese frosting, slow-baked", Price = 120, Tone = "berry", Flag = "new", Calories = 420, SortOrder = 63 },
        new Item { Id = "cck", CategoryId = "dessert", NameEn = "Carrot Cake", NameAr = "كيك جزر", Description = "Walnut, cinnamon, cream cheese", Price = 120, Tone = "gold", Flag = "new", Calories = 410, SortOrder = 64 },
        new Item { Id = "ccs", CategoryId = "dessert", NameEn = "Classic Cheesecake", NameAr = "تشيز كيك", Description = "Plain · vanilla cream cheese", Price = 80, Tone = "cream", Calories = 380, SortOrder = 65 },
        new Item { Id = "tir", CategoryId = "dessert", NameEn = "Italian Tiramisu", NameAr = "تيراميسو", Description = "Mascarpone, espresso, cocoa", Price = 120, Tone = "coffee", Flag = "signature", Calories = 440, SortOrder = 66 },
        new Item { Id = "rhc", CategoryId = "dessert", NameEn = "Russian Honey Cake", NameAr = "ميدوفيك", Description = "Layered honey, sour cream", Price = 90, Tone = "gold", Calories = 380, SortOrder = 67 },
        new Item { Id = "ccw", CategoryId = "dessert", NameEn = "Chocolate Walnut Cake", NameAr = "كيك شوكولاتة جوز", Description = "Chocolate cake, fresh walnut", Price = 100, Tone = "coffee", Calories = 430, SortOrder = 68 },
        new Item { Id = "ssc", CategoryId = "dessert", NameEn = "San Sebastian Cheesecake", NameAr = "سان سيباستيان", Description = "Burnt basque · roasted, jus", Price = 90, Tone = "gold", Calories = 410, SortOrder = 69 },

        new Item { Id = "tms", CategoryId = "bakery", NameEn = "Tuna Melt Sandwich", NameAr = "تونة ساندويتش", Description = "Tuna, vegetables, mayo, cheese, brown", Price = 90, Tone = "cream", Flag = "new", Calories = 480, SortOrder = 70 },
        new Item { Id = "don", CategoryId = "bakery", NameEn = "American Donuts", NameAr = "دونات", Description = "Glazed, fresh-fried", Price = 80, Tone = "cream", Flag = "new", Calories = 320, SortOrder = 71 },
        new Item { Id = "but", CategoryId = "bakery", NameEn = "Butter Croissant", NameAr = "كرواسون زبدة", Description = "Layers of cultured butter", Price = 50, Tone = "gold", Calories = 280, SortOrder = 72 },
        new Item { Id = "pic", CategoryId = "bakery", NameEn = "Pistachio Croissant", NameAr = "كرواسون فستق", Description = "Butter croissant, pistachio cream", Price = 100, Tone = "pistachio", Flag = "signature", Calories = 380, SortOrder = 73 },
        new Item { Id = "ssw", CategoryId = "bakery", NameEn = "Turkish Chicken Sandwich", NameAr = "ساندويتش تركي", Description = "Chicken, cheese, lettuce, pepper, mayo", Price = 95, Tone = "cream", Calories = 420, SortOrder = 74 },
        new Item { Id = "tcc", CategoryId = "bakery", NameEn = "Turkish Cheese Croissant", NameAr = "كرواسون جبن", Description = "Croissant, cheese, Turkish chicken, lettuce", Price = 85, Tone = "gold", Calories = 380, SortOrder = 75 },
        new Item { Id = "nuc", CategoryId = "bakery", NameEn = "Nutella Croissant", NameAr = "كرواسون نوتيلا", Description = "Butter croissant, Nutella", Price = 80, Tone = "coffee", Calories = 360, SortOrder = 76 },
        new Item { Id = "cir", CategoryId = "bakery", NameEn = "Cinnamon Roll", NameAr = "سينامون رول", Description = "Soft cinnamon cake roll", Price = 80, Tone = "gold", Calories = 380, SortOrder = 77 },

        new Item { Id = "svck", CategoryId = "cookies", NameEn = "Spice Vanilla Cookies", NameAr = "كوكيز فانيليا", Description = "White & Belgian chocolate, cinnamon", Price = 70, Tone = "cream", Calories = 220, SortOrder = 78 },
        new Item { Id = "nuck", CategoryId = "cookies", NameEn = "Nutella Cookies", NameAr = "كوكيز نوتيلا", Description = "Nutella centre · soft bake", Price = 70, Tone = "coffee", Calories = 240, SortOrder = 79 },
        new Item { Id = "kic", CategoryId = "cookies", NameEn = "Kinder Cookies", NameAr = "كوكيز كيندر", Description = "Kinder · milk chocolate", Price = 85, Tone = "cream", Calories = 250, SortOrder = 80 },
        new Item { Id = "orc", CategoryId = "cookies", NameEn = "Original Cookie", NameAr = "كوكيز كلاسيك", Description = "House blend · double choc", Price = 70, Tone = "coffee", Calories = 230, SortOrder = 81 },

        new Item { Id = "btr", CategoryId = "beans", NameEn = "Turkish Coffee Blend", NameAr = "بن تركي", Description = "Brazilian + Colombian · finely ground · 250g", Price = 270, Tone = "burgundy", Flag = "new", SortOrder = 82 },
        new Item { Id = "bmw", CategoryId = "beans", NameEn = "Milky Way Blend", NameAr = "ميلكي واي", Description = "Brazil + Colombia · whole bean · 250g", Price = 450, Tone = "burgundy", Flag = "signature", SortOrder = 83 },
        new Item { Id = "bbz", CategoryId = "beans", NameEn = "Brazilian Black Diamond", NameAr = "بن برازيلي", Description = "Single-origin · 100% Arabica · 250g", Price = 550, Tone = "burgundy", SortOrder = 84 },
        new Item { Id = "bet", CategoryId = "beans", NameEn = "Ethiopian Specialty", NameAr = "بن إثيوبي", Description = "Yirgacheffe · floral, citrus, jasmine · 250g", Price = 650, Tone = "burgundy", Flag = "bestseller", SortOrder = 85 }
    ];

    public static Addon[] Addons() =>
    [
        new Addon { Id = "strawberry", Label = "Strawberry", Price = 30, SortOrder = 1 },
        new Addon { Id = "blueberry", Label = "Blueberry", Price = 30, SortOrder = 2 },
        new Addon { Id = "caramel", Label = "Caramel", Price = 25, SortOrder = 3 },
        new Addon { Id = "pistachio", Label = "Pistachio", Price = 35, SortOrder = 4 },
        new Addon { Id = "nutella", Label = "Nutella", Price = 30, SortOrder = 5 }
    ];

    public static Milk[] Milks() =>
    [
        new Milk { Id = "fresh", Label = "Fresh whole", Delta = 0, SortOrder = 1 },
        new Milk { Id = "skim", Label = "Skim", Delta = 0, SortOrder = 2 },
        new Milk { Id = "oat", Label = "Oat", Delta = 15, SortOrder = 3 },
        new Milk { Id = "almond", Label = "Almond", Delta = 15, SortOrder = 4 },
        new Milk { Id = "coconut", Label = "Coconut", Delta = 15, SortOrder = 5 }
    ];

    public static SizeOption[] Sizes() =>
    [
        new SizeOption { Id = "single", Label = "Single", Delta = 0, SortOrder = 1 },
        new SizeOption { Id = "double", Label = "Double", Delta = 15, SortOrder = 2 },
        new SizeOption { Id = "grand", Label = "Grand", Delta = 25, SortOrder = 3 }
    ];
}
