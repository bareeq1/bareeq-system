using Bareeq.Api.Entities;

namespace Bareeq.Api.Data;

public static class SubscriptionSeed
{
    public static SubscriptionPlan[] Plans() =>
    [
        new SubscriptionPlan { Id = "daily", Label = "The Daily", Price = 1490, Description = "A drink a day · pick 7 weekly favorites", SortOrder = 1 },
        new SubscriptionPlan { Id = "beans", Label = "The Bean Drop", Price = 890, Description = "250g specialty beans, monthly", SortOrder = 2 },
        new SubscriptionPlan { Id = "brewbar", Label = "The Brew Bar", Price = 2200, Description = "Eight pour-overs at the counter", SortOrder = 3 }
    ];

    public static SubscriptionPerk[] Perks() =>
    [
        new SubscriptionPerk { Id = 1, PlanId = "daily", Text = "15% off all extras", SortOrder = 1 },
        new SubscriptionPerk { Id = 2, PlanId = "daily", Text = "Skip days anytime", SortOrder = 2 },
        new SubscriptionPerk { Id = 3, PlanId = "daily", Text = "Free pastry every 7th", SortOrder = 3 },

        new SubscriptionPerk { Id = 4, PlanId = "beans", Text = "New origin each month", SortOrder = 1 },
        new SubscriptionPerk { Id = 5, PlanId = "beans", Text = "Tasting notes card", SortOrder = 2 },
        new SubscriptionPerk { Id = 6, PlanId = "beans", Text = "Free shipping", SortOrder = 3 },

        new SubscriptionPerk { Id = 7, PlanId = "brewbar", Text = "Reserved stool", SortOrder = 1 },
        new SubscriptionPerk { Id = 8, PlanId = "brewbar", Text = "Cupping invite", SortOrder = 2 },
        new SubscriptionPerk { Id = 9, PlanId = "brewbar", Text = "VIP shortcut", SortOrder = 3 }
    ];
}
