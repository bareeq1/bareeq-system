using Bareeq.Api.Entities;

namespace Bareeq.Api.Data;

public static class LoyaltySeed
{
    public static Tier[] Tiers() =>
    [
        new Tier { Id = "bronze", Label = "Bronze", MinPoints = 0, MaxPoints = 250, SortOrder = 1 },
        new Tier { Id = "silver", Label = "Silver", MinPoints = 250, MaxPoints = 750, SortOrder = 2 },
        new Tier { Id = "gold", Label = "Gold", MinPoints = 750, MaxPoints = 1800, SortOrder = 3 },
        new Tier { Id = "vip", Label = "VIP", MinPoints = 1800, MaxPoints = 9999, SortOrder = 4 }
    ];

    public static TierPerk[] TierPerks() =>
    [
        new TierPerk { Id = 1, TierId = "bronze", Text = "Birthday drink", SortOrder = 1 },
        new TierPerk { Id = 2, TierId = "bronze", Text = "Free Wi-Fi lounge", SortOrder = 2 },
        new TierPerk { Id = 3, TierId = "silver", Text = "10% off pastries", SortOrder = 1 },
        new TierPerk { Id = 4, TierId = "silver", Text = "Free milk upgrade", SortOrder = 2 },
        new TierPerk { Id = 5, TierId = "gold", Text = "Free drink weekly", SortOrder = 1 },
        new TierPerk { Id = 6, TierId = "gold", Text = "Priority brew bar", SortOrder = 2 },
        new TierPerk { Id = 7, TierId = "gold", Text = "Cupping invites", SortOrder = 3 },
        new TierPerk { Id = 8, TierId = "vip", Text = "Concierge ordering", SortOrder = 1 },
        new TierPerk { Id = 9, TierId = "vip", Text = "Reserved seat", SortOrder = 2 },
        new TierPerk { Id = 10, TierId = "vip", Text = "Beans drop · first access", SortOrder = 3 },
        new TierPerk { Id = 11, TierId = "vip", Text = "Annual roastery dinner", SortOrder = 4 }
    ];

    public static Badge[] Badges() =>
    [
        new Badge { Id = "first", Label = "First Sip", Description = "First order placed", Glyph = "✦", SortOrder = 1 },
        new Badge { Id = "streak7", Label = "Seven Mornings", Description = "7-day streak", Glyph = "◔", SortOrder = 2 },
        new Badge { Id = "matcha", Label = "Matcha Master", Description = "Tried all matcha", Glyph = "❋", SortOrder = 3 },
        new Badge { Id = "brewbar", Label = "Brew Bar Initiate", Description = "Tried Aeropress + V60", Glyph = "◐", SortOrder = 4 },
        new Badge { Id = "winter", Label = "Winter Ritual", Description = "3 hot chocolates", Glyph = "❄", SortOrder = 5 },
        new Badge { Id = "signature", Label = "House Signature", Description = "Order 5 signatures", Glyph = "✧", SortOrder = 6 },
        new Badge { Id = "beans", Label = "Bean Collector", Description = "Buy 3 bean SKUs", Glyph = "●", SortOrder = 7 },
        new Badge { Id = "vip", Label = "Inner Circle", Description = "Reach VIP", Glyph = "♛", SortOrder = 8 }
    ];

    public static Coupon[] Coupons() =>
    [
        new Coupon { Id = "WINTER25", Label = "Winter Warmer", Description = "25% off all hot chocolates", ExpiryText = "Ends May 21", Flavor = "burgundy", SortOrder = 1 },
        new Coupon { Id = "MATCHA2x1", Label = "Matcha Hour", Description = "Buy 1 matcha · get 1 free, 3–5pm", ExpiryText = "Daily", Flavor = "matcha", SortOrder = 2 },
        new Coupon { Id = "BEANS150", Label = "Bean Drop", Description = "EGP 150 off any 250g bag", ExpiryText = "Ends Jun 02", Flavor = "ink", SortOrder = 3 },
        new Coupon { Id = "BIRTHDAY", Label = "On The House", Description = "Any signature drink · birthday week", ExpiryText = "Personalized", Flavor = "gold", SortOrder = 4 }
    ];
}
