using Bareeq.Api.Entities;

namespace Bareeq.Api.Data.Seeds;

public static class BranchSeed
{
    public static Branch[] Branches() =>
    [
        new Branch
        {
            Id = "helwan",
            Label = "Helwan",
            Address = "شارع طلعت حرب، حلوان، القاهرة",
            Phone = "+20 2 2555 0101",
            Hours = "Sun–Thu 8 AM–11 PM, Fri–Sat 8 AM–12 AM",
            Latitude = 29.8416,
            Longitude = 31.3342
        },
        new Branch
        {
            Id = "hadayek-helwan",
            Label = "Hadayek Helwan",
            Address = "شارع الجيش، حدائق حلوان، القاهرة",
            Phone = "+20 2 2555 0202",
            Hours = "Sun–Thu 8 AM–11 PM, Fri–Sat 8 AM–12 AM",
            Latitude = 29.8553,
            Longitude = 31.3221
        }
    ];
}
