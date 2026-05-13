using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Bareeq.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Addons",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Badges",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Glyph = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Badges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    LabelEn = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    LabelAr = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Glyph = table.Column<string>(type: "character varying(8)", maxLength: 8, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Coupons",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    ExpiryText = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Flavor = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coupons", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Milks",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Delta = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Milks", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Sizes",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Delta = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sizes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionPlans",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Description = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPlans", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Tiers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    Label = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    MinPoints = table.Column<int>(type: "integer", nullable: false),
                    MaxPoints = table.Column<int>(type: "integer", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tiers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    FullName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    AvatarUrl = table.Column<string>(type: "text", nullable: true),
                    GoogleSubject = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Sparkles = table.Column<int>(type: "integer", nullable: false),
                    StreakCount = table.Column<int>(type: "integer", nullable: false),
                    LastStreakAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CategoryId = table.Column<string>(type: "text", nullable: false),
                    NameEn = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    NameAr = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    Description = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: false),
                    Price = table.Column<int>(type: "integer", nullable: false),
                    Tone = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Flag = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: true),
                    Calories = table.Column<int>(type: "integer", nullable: true),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Items_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SubscriptionPerks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PlanId = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubscriptionPerks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SubscriptionPerks_SubscriptionPlans_PlanId",
                        column: x => x.PlanId,
                        principalTable: "SubscriptionPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TierPerks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TierId = table.Column<string>(type: "text", nullable: false),
                    Text = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TierPerks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TierPerks_Tiers_TierId",
                        column: x => x.TierId,
                        principalTable: "Tiers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Label = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    Detail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: false),
                    IsPrimary = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Addresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Subtotal = table.Column<int>(type: "integer", nullable: false),
                    Points = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserBadges",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    BadgeId = table.Column<string>(type: "text", nullable: false),
                    Earned = table.Column<bool>(type: "boolean", nullable: false),
                    EarnedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBadges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBadges_Badges_BadgeId",
                        column: x => x.BadgeId,
                        principalTable: "Badges",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserCoupons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    CouponId = table.Column<string>(type: "text", nullable: false),
                    Redeemed = table.Column<bool>(type: "boolean", nullable: false),
                    RedeemedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserCoupons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserCoupons_Coupons_CouponId",
                        column: x => x.CouponId,
                        principalTable: "Coupons",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserCoupons_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFavorites",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ItemId = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFavorites", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserFavorites_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserFavorites_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderId = table.Column<Guid>(type: "uuid", nullable: false),
                    ItemId = table.Column<string>(type: "text", nullable: false),
                    SizeId = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    MilkId = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    Notes = table.Column<string>(type: "character varying(512)", maxLength: 512, nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    UnitPrice = table.Column<int>(type: "integer", nullable: false),
                    LineTotal = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Items_ItemId",
                        column: x => x.ItemId,
                        principalTable: "Items",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "OrderItemAddons",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    OrderItemId = table.Column<Guid>(type: "uuid", nullable: false),
                    AddonId = table.Column<string>(type: "character varying(32)", maxLength: 32, nullable: false),
                    AddonLabel = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    AddonPrice = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItemAddons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItemAddons_OrderItems_OrderItemId",
                        column: x => x.OrderItemId,
                        principalTable: "OrderItems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Addons",
                columns: new[] { "Id", "Label", "Price", "SortOrder" },
                values: new object[,]
                {
                    { "blueberry", "Blueberry", 30, 2 },
                    { "caramel", "Caramel", 25, 3 },
                    { "nutella", "Nutella", 30, 5 },
                    { "pistachio", "Pistachio", 35, 4 },
                    { "strawberry", "Strawberry", 30, 1 }
                });

            migrationBuilder.InsertData(
                table: "Badges",
                columns: new[] { "Id", "Description", "Glyph", "Label", "SortOrder" },
                values: new object[,]
                {
                    { "beans", "Buy 3 bean SKUs", "●", "Bean Collector", 7 },
                    { "brewbar", "Tried Aeropress + V60", "◐", "Brew Bar Initiate", 4 },
                    { "first", "First order placed", "✦", "First Sip", 1 },
                    { "matcha", "Tried all matcha", "❋", "Matcha Master", 3 },
                    { "signature", "Order 5 signatures", "✧", "House Signature", 6 },
                    { "streak7", "7-day streak", "◔", "Seven Mornings", 2 },
                    { "vip", "Reach VIP", "♛", "Inner Circle", 8 },
                    { "winter", "3 hot chocolates", "❄", "Winter Ritual", 5 }
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Glyph", "LabelAr", "LabelEn", "SortOrder" },
                values: new object[,]
                {
                    { "bakery", "❒", "مخبوزات", "Bakery", 9 },
                    { "beans", "●", "حبوب", "Coffee Beans", 11 },
                    { "blended", "◯", "مخفوقة", "Blended", 4 },
                    { "coffee", "◐", "قهوة", "Coffee", 2 },
                    { "cold", "◇", "باردة", "Cold", 3 },
                    { "cookies", "✿", "كوكيز", "Cookies", 10 },
                    { "dessert", "❀", "حلويات", "Dessert", 8 },
                    { "juice", "◔", "عصائر", "Juice", 7 },
                    { "matcha", "❋", "ماتشا", "Matcha", 5 },
                    { "refresher", "≈", "منعشة", "Refreshers", 6 },
                    { "signature", "✦", "المميزة", "Signature", 1 }
                });

            migrationBuilder.InsertData(
                table: "Coupons",
                columns: new[] { "Id", "Description", "ExpiryText", "Flavor", "Label", "SortOrder" },
                values: new object[,]
                {
                    { "BEANS150", "EGP 150 off any 250g bag", "Ends Jun 02", "ink", "Bean Drop", 3 },
                    { "BIRTHDAY", "Any signature drink · birthday week", "Personalized", "gold", "On The House", 4 },
                    { "MATCHA2x1", "Buy 1 matcha · get 1 free, 3–5pm", "Daily", "matcha", "Matcha Hour", 2 },
                    { "WINTER25", "25% off all hot chocolates", "Ends May 21", "burgundy", "Winter Warmer", 1 }
                });

            migrationBuilder.InsertData(
                table: "Milks",
                columns: new[] { "Id", "Delta", "Label", "SortOrder" },
                values: new object[,]
                {
                    { "almond", 15, "Almond", 4 },
                    { "coconut", 15, "Coconut", 5 },
                    { "fresh", 0, "Fresh whole", 1 },
                    { "oat", 15, "Oat", 3 },
                    { "skim", 0, "Skim", 2 }
                });

            migrationBuilder.InsertData(
                table: "Sizes",
                columns: new[] { "Id", "Delta", "Label", "SortOrder" },
                values: new object[,]
                {
                    { "double", 15, "Double", 2 },
                    { "grand", 25, "Grand", 3 },
                    { "single", 0, "Single", 1 }
                });

            migrationBuilder.InsertData(
                table: "SubscriptionPlans",
                columns: new[] { "Id", "Description", "Label", "Price", "SortOrder" },
                values: new object[,]
                {
                    { "beans", "250g specialty beans, monthly", "The Bean Drop", 890, 2 },
                    { "brewbar", "Eight pour-overs at the counter", "The Brew Bar", 2200, 3 },
                    { "daily", "A drink a day · pick 7 weekly favorites", "The Daily", 1490, 1 }
                });

            migrationBuilder.InsertData(
                table: "Tiers",
                columns: new[] { "Id", "Label", "MaxPoints", "MinPoints", "SortOrder" },
                values: new object[,]
                {
                    { "bronze", "Bronze", 250, 0, 1 },
                    { "gold", "Gold", 1800, 750, 3 },
                    { "silver", "Silver", 750, 250, 2 },
                    { "vip", "VIP", 9999, 1800, 4 }
                });

            migrationBuilder.InsertData(
                table: "Items",
                columns: new[] { "Id", "Calories", "CategoryId", "Description", "Flag", "NameAr", "NameEn", "Price", "SortOrder", "Tone" },
                values: new object[,]
                {
                    { "aero", 5, "signature", "Single-origin pour · clean, citric, weightless", "brew", "إيروبريس", "Aeropress · Brew Bar", 100, 5, "ink" },
                    { "am", 5, "coffee", "Espresso + hot water", null, "أمريكانو", "Americano", 70, 18, "coffee" },
                    { "bbz", null, "beans", "Single-origin · 100% Arabica · 250g", null, "بن برازيلي", "Brazilian Black Diamond", 550, 84, "burgundy" },
                    { "bet", null, "beans", "Yirgacheffe · floral, citrus, jasmine · 250g", "bestseller", "بن إثيوبي", "Ethiopian Specialty", 650, 85, "burgundy" },
                    { "bhc", 410, "signature", "Hazelnut praline, milk foam crown", "winter", "بوينو شوكولاتة ساخنة", "Bueno Hot Chocolate", 100, 4, "coffee" },
                    { "blu", 280, "blended", "Blueberries, vanilla, ice, whipped", null, "توت أزرق", "Blueberry", 89, 40, "berry" },
                    { "bmw", null, "beans", "Brazil + Colombia · whole bean · 250g", "signature", "ميلكي واي", "Milky Way Blend", 450, 83, "burgundy" },
                    { "bsm", 160, "juice", "Wild blueberry, water, bareeq", null, "توت سموذي", "Blueberry Smoothie", 80, 59, "berry" },
                    { "btr", null, "beans", "Brazilian + Colombian · finely ground · 250g", "new", "بن تركي", "Turkish Coffee Blend", 270, 82, "burgundy" },
                    { "but", 280, "bakery", "Layers of cultured butter", null, "كرواسون زبدة", "Butter Croissant", 50, 72, "gold" },
                    { "cap", 140, "coffee", "Milk, espresso, foam crown", null, "كابتشينو", "Cappuccino", 85, 13, "coffee" },
                    { "carb", 340, "blended", "Caramel, milk powder, vanilla, espresso", null, "كراميل بلند", "Caramel Blend", 120, 32, "gold" },
                    { "cck", 410, "dessert", "Walnut, cinnamon, cream cheese", "new", "كيك جزر", "Carrot Cake", 120, 64, "gold" },
                    { "ccl", 270, "coffee", "Cinnamon, caramel, milk, espresso", null, "قرفة وكراميل", "Cinnamon Caramel Latte", 110, 17, "gold" },
                    { "ccs", 380, "dessert", "Plain · vanilla cream cheese", null, "تشيز كيك", "Classic Cheesecake", 80, 65, "cream" },
                    { "ccw", 430, "dessert", "Chocolate cake, fresh walnut", null, "كيك شوكولاتة جوز", "Chocolate Walnut Cake", 100, 68, "coffee" },
                    { "cir", 380, "bakery", "Soft cinnamon cake roll", null, "سينامون رول", "Cinnamon Roll", 80, 77, "gold" },
                    { "cor", 120, "coffee", "Espresso · milk · light foam", null, "كورتادو", "Cortado", 70, 15, "coffee" },
                    { "don", 320, "bakery", "Glazed, fresh-fried", "new", "دونات", "American Donuts", 80, 71, "cream" },
                    { "esp", 5, "coffee", "Specialty single shot", null, "إسبريسو", "Espresso", 60, 19, "ink" },
                    { "fic", 320, "signature", "Fruity & chocolate · whipped cream cap, berries", "new", "فروتي آيس شوكولاتة", "Fruity Ice Chocolate", 120, 1, "berry" },
                    { "foj", 110, "juice", "Fresh-pressed orange", null, "عصير برتقال", "Fresh Orange Juice", 60, 62, "orange" },
                    { "fw", 150, "coffee", "Espresso · milk · velvet foam", null, "فلات وايت", "Flat White", 80, 16, "coffee" },
                    { "hcm", 280, "coffee", "Caramel, milk, espresso, vanilla", null, "كراميل ماكياتو", "Hot Caramel Macchiato", 115, 22, "gold" },
                    { "hsm", 220, "matcha", "Japanese ceremonial matcha, condensed milk", "new", "ماتشا إسباني ساخن", "Hot Spanish Matcha", 120, 41, "matcha" },
                    { "iam", 5, "cold", "Espresso · ice · water", null, "أيس أمريكانو", "Iced Americano", 70, 23, "coffee" },
                    { "icm", 290, "cold", "Caramel, milk, espresso, vanilla", null, "أيس كراميل", "Iced Caramel Macchiato", 115, 25, "gold" },
                    { "ilat", 210, "cold", "Milk · espresso · ice", null, "أيس لاتيه", "Iced Latte", 100, 30, "coffee" },
                    { "imo", 300, "cold", "Chocolate, espresso, milk", null, "أيس موكا", "Iced Mocha", 115, 27, "coffee" },
                    { "ipis", 280, "cold", "Pistachio, milk, espresso", "bestseller", "أيس فستق", "Iced Pistachio Latte", 130, 24, "pistachio" },
                    { "iscl", 290, "cold", "Milk, espresso, salted caramel", null, "أيس كراميل بالملح", "Iced Salted Caramel Latte", 115, 28, "gold" },
                    { "isp", 300, "cold", "Milk, espresso, condensed milk", null, "أيس إسباني", "Iced Spanish Latte", 115, 29, "cream" },
                    { "iwm", 320, "cold", "White mocha, espresso, milk", null, "أيس وايت موكا", "Iced Shaken White Mocha", 115, 26, "cream" },
                    { "jbmc", 290, "matcha", "Blueberry compote, matcha, cream", "new", "ماتشا توت كريم", "Japanese Blueberry Matcha Cream", 120, 43, "matcha" },
                    { "jcm", 280, "matcha", "Milk powder, vanilla, ceremonial matcha", "new", "ماتشا كريم", "Japanese Cream Matcha", 120, 47, "matcha" },
                    { "jcsm", 280, "matcha", "Ceremonial grade · cream cap", null, "ماتشا كريم إسباني", "Japanese Cream Spanish Matcha", 120, 42, "matcha" },
                    { "jiwc", 280, "matcha", "White chocolate, ceremonial matcha, ice", null, "ماتشا وايت شوكولاتة بارد", "Iced White Chocolate Matcha", 120, 44, "matcha" },
                    { "jml", 180, "matcha", "Ceremonial matcha, milk", "signature", "ماتشا لاتيه", "Japanese Matcha Latte", 120, 45, "matcha" },
                    { "jwmb", 320, "matcha", "Matcha, white chocolate, blended", null, "ماتشا بلند", "White Chocolate Matcha Blend", 120, 46, "matcha" },
                    { "kic", 250, "cookies", "Kinder · milk chocolate", null, "كوكيز كيندر", "Kinder Cookies", 85, 80, "cream" },
                    { "lab", 280, "blended", "Milk, espresso, vanilla ice", null, "لاتيه بلند", "Latte Blend", 100, 36, "coffee" },
                    { "lat", 200, "coffee", "Fresh milk, espresso, magic", null, "لاتيه", "Latte", 100, 14, "coffee" },
                    { "lpf", 100, "refresher", "Lemon, tropical fruits", null, "ليمون باشن", "Lemon Passion Fruit", 80, 55, "orange" },
                    { "mac", 80, "coffee", "Espresso · a kiss of foam", null, "ماكياتو", "Macchiato", 60, 21, "coffee" },
                    { "mdl", 240, "coffee", "Medjool dates, espresso, milk, cinnamon", "signature", "لاتيه التمر", "Medjool Date Latte", 110, 7, "coffee" },
                    { "mlm", 120, "juice", "Lemonade, mint, ice, water", null, "ليمون نعناع", "Mint Lemonade", 60, 61, "matcha" },
                    { "mng", 130, "juice", "Fresh-pressed mango", null, "مانجو", "Mango", 60, 58, "orange" },
                    { "mob", 340, "blended", "Chocolate, fresh milk, espresso", null, "موكا بلند", "Mocha Blend", 120, 35, "coffee" },
                    { "moc", 290, "coffee", "Chocolate, fresh milk, espresso", null, "موكا", "Mocha", 110, 11, "coffee" },
                    { "msm", 180, "juice", "Fresh mango smoothie", null, "مانجو سموذي", "Mango Smoothie", 70, 57, "orange" },
                    { "nuc", 360, "bakery", "Butter croissant, Nutella", null, "كرواسون نوتيلا", "Nutella Croissant", 80, 76, "coffee" },
                    { "nuck", 240, "cookies", "Nutella centre · soft bake", null, "كوكيز نوتيلا", "Nutella Cookies", 70, 79, "coffee" },
                    { "onc", 380, "blended", "Oreo, Nutella, vanilla powder", null, "أوريو نوتيلا", "Oreo Nutella Cream", 100, 38, "ink" },
                    { "orc", 230, "cookies", "House blend · double choc", null, "كوكيز كلاسيك", "Original Cookie", 70, 81, "coffee" },
                    { "pcb", 360, "blended", "Pistachio cream, espresso, vanilla milk", null, "فستق بلند", "Pistachio Cream Blend", 130, 31, "pistachio" },
                    { "pfs", 170, "juice", "Tropical fruits, snow, glitter", null, "باشن سموذي", "Passion Fruit Smoothie", 80, 60, "orange" },
                    { "pic", 380, "bakery", "Butter croissant, pistachio cream", "signature", "كرواسون فستق", "Pistachio Croissant", 100, 73, "pistachio" },
                    { "pis", 260, "coffee", "Pistachio, milk, espresso, a touch of bareeq", "bestseller", "لاتيه فستق", "Pistachio Latte", 130, 8, "pistachio" },
                    { "pit", 110, "refresher", "Brewed tea, peach, ice", null, "شاي خوخ بارد", "Peach Iced Tea", 80, 54, "orange" },
                    { "rhc", 380, "dessert", "Layered honey, sour cream", null, "ميدوفيك", "Russian Honey Cake", 90, 67, "gold" },
                    { "rvc", 420, "dessert", "Cream cheese frosting, slow-baked", "new", "ريد فيلفت", "Red Velvet Cake", 120, 63, "berry" },
                    { "sbb", 95, "refresher", "Blueberry, lemon, mint, soda", null, "توت منعش", "Sunshine Blueberry", 80, 51, "berry" },
                    { "sbl", 90, "refresher", "Blue lemon, lemon, mint, soda", null, "ليمونادة زرقاء", "Sunshine Blue Lemonade", 80, 48, "berry" },
                    { "scb", 340, "blended", "Salted caramel, milk, espresso, ice", null, "كراميل ملح بلند", "Salted Caramel Blend", 120, 34, "gold" },
                    { "scl", 280, "coffee", "Milk, espresso, salted caramel", null, "كراميل بالملح", "Salted Caramel Latte", 110, 12, "gold" },
                    { "shc", 380, "signature", "Winter ritual · strawberry cream, dark cocoa", "winter", "شوكولاتة ساخنة بالفراولة", "Strawberry Hot Chocolate", 100, 3, "burgundy" },
                    { "slm", 80, "refresher", "Lemon, mint, soda", null, "ليمون نعناع", "Sunshine Lemon Mint", 80, 53, "matcha" },
                    { "spa", 290, "coffee", "Condensed milk, espresso, milk", null, "لاتيه إسباني", "Spanish Latte", 115, 9, "cream" },
                    { "spb", 320, "blended", "Condensed milk, espresso, vanilla, ice", null, "إسباني بلند", "Spanish Blend", 120, 37, "cream" },
                    { "spe", 100, "refresher", "Peach, lemon, mint, soda", null, "خوخ منعش", "Sunshine Peach", 80, 50, "orange" },
                    { "spf", 95, "refresher", "Passion fruit soda", null, "باشن منعش", "Sunshine Passion Fruit", 80, 52, "orange" },
                    { "ssc", 410, "dessert", "Burnt basque · roasted, jus", null, "سان سيباستيان", "San Sebastian Cheesecake", 90, 69, "gold" },
                    { "sst", 100, "refresher", "Strawberry, lemon, mint, soda", null, "فراولة منعشة", "Sunshine Strawberry", 80, 49, "berry" },
                    { "ssw", 420, "bakery", "Chicken, cheese, lettuce, pepper, mayo", null, "ساندويتش تركي", "Turkish Chicken Sandwich", 95, 74, "cream" },
                    { "svc", 320, "blended", "Strawberry, vanilla, ice, whipped cream", null, "فراولة وفانيليا", "Strawberry Vanilla Cream", 100, 39, "berry" },
                    { "svck", 220, "cookies", "White & Belgian chocolate, cinnamon", null, "كوكيز فانيليا", "Spice Vanilla Cookies", 70, 78, "cream" },
                    { "tcc", 380, "bakery", "Croissant, cheese, Turkish chicken, lettuce", null, "كرواسون جبن", "Turkish Cheese Croissant", 85, 75, "gold" },
                    { "tir", 440, "dessert", "Mascarpone, espresso, cocoa", "signature", "تيراميسو", "Italian Tiramisu", 120, 66, "coffee" },
                    { "tms", 480, "bakery", "Tuna, vegetables, mayo, cheese, brown", "new", "تونة ساندويتش", "Tuna Melt Sandwich", 90, 70, "cream" },
                    { "trh", 90, "signature", "Hibiscus, passion, lemon, soda", "new", "كركديه استوائي", "Tropical Hibiscus", 100, 2, "berry" },
                    { "tur", 5, "coffee", "Slow simmered · Brazilian + Colombian blend", null, "قهوة تركي", "Turkish Coffee", 35, 20, "ink" },
                    { "v60", 5, "signature", "Chemex-style filter · slow extraction, 4 min", "new", "V60", "V60 · Brew Bar", 120, 6, "ink" },
                    { "wat", 110, "juice", "Watermelon, sugar, ice", "new", "بطيخ", "Watermelon", 80, 56, "berry" },
                    { "wmb", 360, "blended", "White chocolate, vanilla milk, espresso", null, "وايت موكا بلند", "White Mocha Blend", 120, 33, "cream" },
                    { "wmoc", 310, "coffee", "White chocolate, espresso, milk", null, "وايت موكا", "White Mocha", 115, 10, "cream" }
                });

            migrationBuilder.InsertData(
                table: "SubscriptionPerks",
                columns: new[] { "Id", "PlanId", "SortOrder", "Text" },
                values: new object[,]
                {
                    { 1, "daily", 1, "15% off all extras" },
                    { 2, "daily", 2, "Skip days anytime" },
                    { 3, "daily", 3, "Free pastry every 7th" },
                    { 4, "beans", 1, "New origin each month" },
                    { 5, "beans", 2, "Tasting notes card" },
                    { 6, "beans", 3, "Free shipping" },
                    { 7, "brewbar", 1, "Reserved stool" },
                    { 8, "brewbar", 2, "Cupping invite" },
                    { 9, "brewbar", 3, "VIP shortcut" }
                });

            migrationBuilder.InsertData(
                table: "TierPerks",
                columns: new[] { "Id", "SortOrder", "Text", "TierId" },
                values: new object[,]
                {
                    { 1, 1, "Birthday drink", "bronze" },
                    { 2, 2, "Free Wi-Fi lounge", "bronze" },
                    { 3, 1, "10% off pastries", "silver" },
                    { 4, 2, "Free milk upgrade", "silver" },
                    { 5, 1, "Free drink weekly", "gold" },
                    { 6, 2, "Priority brew bar", "gold" },
                    { 7, 3, "Cupping invites", "gold" },
                    { 8, 1, "Concierge ordering", "vip" },
                    { 9, 2, "Reserved seat", "vip" },
                    { 10, 3, "Beans drop · first access", "vip" },
                    { 11, 4, "Annual roastery dinner", "vip" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UserId",
                table: "Addresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Items_CategoryId",
                table: "Items",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItemAddons_OrderItemId",
                table: "OrderItemAddons",
                column: "OrderItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ItemId",
                table: "OrderItems",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SubscriptionPerks_PlanId",
                table: "SubscriptionPerks",
                column: "PlanId");

            migrationBuilder.CreateIndex(
                name: "IX_TierPerks_TierId",
                table: "TierPerks",
                column: "TierId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_BadgeId",
                table: "UserBadges",
                column: "BadgeId");

            migrationBuilder.CreateIndex(
                name: "IX_UserBadges_UserId",
                table: "UserBadges",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCoupons_CouponId",
                table: "UserCoupons",
                column: "CouponId");

            migrationBuilder.CreateIndex(
                name: "IX_UserCoupons_UserId",
                table: "UserCoupons",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFavorites_ItemId",
                table: "UserFavorites",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_UserFavorites_UserId_ItemId",
                table: "UserFavorites",
                columns: new[] { "UserId", "ItemId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_GoogleSubject",
                table: "Users",
                column: "GoogleSubject",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Addons");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "Milks");

            migrationBuilder.DropTable(
                name: "OrderItemAddons");

            migrationBuilder.DropTable(
                name: "Sizes");

            migrationBuilder.DropTable(
                name: "SubscriptionPerks");

            migrationBuilder.DropTable(
                name: "TierPerks");

            migrationBuilder.DropTable(
                name: "UserBadges");

            migrationBuilder.DropTable(
                name: "UserCoupons");

            migrationBuilder.DropTable(
                name: "UserFavorites");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "SubscriptionPlans");

            migrationBuilder.DropTable(
                name: "Tiers");

            migrationBuilder.DropTable(
                name: "Badges");

            migrationBuilder.DropTable(
                name: "Coupons");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
