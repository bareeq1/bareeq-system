using Bareeq.Api.Data.Seeds;
using Bareeq.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<Addon> Addons => Set<Addon>();
    public DbSet<Milk> Milks => Set<Milk>();
    public DbSet<SizeOption> Sizes => Set<SizeOption>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderItemAddon> OrderItemAddons => Set<OrderItemAddon>();
    public DbSet<OrderPayment> OrderPayments => Set<OrderPayment>();
    public DbSet<Tier> Tiers => Set<Tier>();
    public DbSet<TierPerk> TierPerks => Set<TierPerk>();
    public DbSet<Badge> Badges => Set<Badge>();
    public DbSet<UserBadge> UserBadges => Set<UserBadge>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<UserCoupon> UserCoupons => Set<UserCoupon>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<UserFavorite> UserFavorites => Set<UserFavorite>();
    public DbSet<SubscriptionPlan> SubscriptionPlans => Set<SubscriptionPlan>();
    public DbSet<SubscriptionPerk> SubscriptionPerks => Set<SubscriptionPerk>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.HasIndex(user => user.Email).IsUnique();
            entity.HasIndex(user => user.GoogleSubject).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(256);
            entity.Property(user => user.FullName).HasMaxLength(256);
            entity.Property(user => user.Role).HasMaxLength(32);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(category => category.Id);
            entity.Property(category => category.LabelEn).HasMaxLength(128);
            entity.Property(category => category.LabelAr).HasMaxLength(128);
            entity.Property(category => category.Glyph).HasMaxLength(8);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(item => item.Id);
            entity.HasOne(item => item.Category)
                .WithMany(category => category.Items)
                .HasForeignKey(item => item.CategoryId);
            entity.Property(item => item.NameEn).HasMaxLength(256);
            entity.Property(item => item.NameAr).HasMaxLength(256);
            entity.Property(item => item.Description).HasMaxLength(512);
            entity.Property(item => item.Tone).HasMaxLength(32);
            entity.Property(item => item.Flag).HasMaxLength(32);
        });

        modelBuilder.Entity<Addon>(entity =>
        {
            entity.HasKey(addon => addon.Id);
            entity.Property(addon => addon.Label).HasMaxLength(128);
        });

        modelBuilder.Entity<Milk>(entity =>
        {
            entity.HasKey(milk => milk.Id);
            entity.Property(milk => milk.Label).HasMaxLength(128);
        });

        modelBuilder.Entity<SizeOption>(entity =>
        {
            entity.HasKey(size => size.Id);
            entity.Property(size => size.Label).HasMaxLength(128);
        });

        modelBuilder.Entity<Branch>(entity =>
        {
            entity.HasKey(branch => branch.Id);
            entity.Property(branch => branch.Id).HasMaxLength(64);
            entity.Property(branch => branch.Label).HasMaxLength(128);
            entity.Property(branch => branch.Address).HasMaxLength(256);
            entity.Property(branch => branch.Phone).HasMaxLength(32);
            entity.Property(branch => branch.Hours).HasMaxLength(256);
        });

        modelBuilder.Entity<OrderPayment>(entity =>
        {
            entity.HasKey(payment => payment.Id);
            entity.Property(payment => payment.Status).HasMaxLength(32);
            entity.Property(payment => payment.ImageUrl).HasMaxLength(1024);
            entity.Property(payment => payment.RejectionReason).HasMaxLength(512);
            entity.HasOne(payment => payment.Order)
                .WithOne(order => order.Payment)
                .HasForeignKey<OrderPayment>(payment => payment.OrderId);
            entity.HasOne(payment => payment.Reviewer)
                .WithMany()
                .HasForeignKey(payment => payment.ReviewedBy)
                .IsRequired(false);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(order => order.Id);
            entity.Property(order => order.Status).HasMaxLength(32);
            entity.Property(order => order.Source).HasMaxLength(32);
            entity.Property(order => order.DeliveryMethod).HasMaxLength(32);
            entity.Property(order => order.DeliveryAddress).HasMaxLength(512);
            entity.HasOne(order => order.User)
                .WithMany()
                .HasForeignKey(order => order.UserId);
            entity.HasOne(order => order.Branch)
                .WithMany()
                .HasForeignKey(order => order.BranchId)
                .IsRequired(false);
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(orderItem => orderItem.Id);
            entity.HasOne(orderItem => orderItem.Order)
                .WithMany(order => order.Items)
                .HasForeignKey(orderItem => orderItem.OrderId);
            entity.HasOne(orderItem => orderItem.Item)
                .WithMany()
                .HasForeignKey(orderItem => orderItem.ItemId);
            entity.Property(orderItem => orderItem.SizeId).HasMaxLength(32);
            entity.Property(orderItem => orderItem.MilkId).HasMaxLength(32);
            entity.Property(orderItem => orderItem.Notes).HasMaxLength(512);
        });

        modelBuilder.Entity<OrderItemAddon>(entity =>
        {
            entity.HasKey(orderItemAddon => orderItemAddon.Id);
            entity.HasOne(orderItemAddon => orderItemAddon.OrderItem)
                .WithMany(orderItem => orderItem.Addons)
                .HasForeignKey(orderItemAddon => orderItemAddon.OrderItemId);
            entity.Property(orderItemAddon => orderItemAddon.AddonId).HasMaxLength(32);
            entity.Property(orderItemAddon => orderItemAddon.AddonLabel).HasMaxLength(128);
        });

        modelBuilder.Entity<Tier>(entity =>
        {
            entity.HasKey(tier => tier.Id);
            entity.Property(tier => tier.Label).HasMaxLength(64);
        });

        modelBuilder.Entity<TierPerk>(entity =>
        {
            entity.HasKey(perk => perk.Id);
            entity.HasOne(perk => perk.Tier)
                .WithMany(tier => tier.Perks)
                .HasForeignKey(perk => perk.TierId);
            entity.Property(perk => perk.Text).HasMaxLength(256);
        });

        modelBuilder.Entity<Badge>(entity =>
        {
            entity.HasKey(badge => badge.Id);
            entity.Property(badge => badge.Label).HasMaxLength(128);
            entity.Property(badge => badge.Description).HasMaxLength(256);
            entity.Property(badge => badge.Glyph).HasMaxLength(8);
        });

        modelBuilder.Entity<UserBadge>(entity =>
        {
            entity.HasKey(userBadge => userBadge.Id);
            entity.HasOne(userBadge => userBadge.User)
                .WithMany()
                .HasForeignKey(userBadge => userBadge.UserId);
            entity.HasOne(userBadge => userBadge.Badge)
                .WithMany(badge => badge.UserBadges)
                .HasForeignKey(userBadge => userBadge.BadgeId);
        });

        modelBuilder.Entity<Coupon>(entity =>
        {
            entity.HasKey(coupon => coupon.Id);
            entity.Property(coupon => coupon.Label).HasMaxLength(128);
            entity.Property(coupon => coupon.Description).HasMaxLength(256);
            entity.Property(coupon => coupon.ExpiryText).HasMaxLength(64);
            entity.Property(coupon => coupon.Flavor).HasMaxLength(32);
        });

        modelBuilder.Entity<UserCoupon>(entity =>
        {
            entity.HasKey(userCoupon => userCoupon.Id);
            entity.HasOne(userCoupon => userCoupon.User)
                .WithMany()
                .HasForeignKey(userCoupon => userCoupon.UserId);
            entity.HasOne(userCoupon => userCoupon.Coupon)
                .WithMany(coupon => coupon.UserCoupons)
                .HasForeignKey(userCoupon => userCoupon.CouponId);
        });

        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasKey(address => address.Id);
            entity.HasOne(address => address.User)
                .WithMany()
                .HasForeignKey(address => address.UserId);
            entity.Property(address => address.Label).HasMaxLength(64);
            entity.Property(address => address.Detail).HasMaxLength(256);
        });

        modelBuilder.Entity<UserFavorite>(entity =>
        {
            entity.HasKey(favorite => favorite.Id);
            entity.HasOne(favorite => favorite.User)
                .WithMany()
                .HasForeignKey(favorite => favorite.UserId);
            entity.HasOne(favorite => favorite.Item)
                .WithMany()
                .HasForeignKey(favorite => favorite.ItemId);
            entity.HasIndex(favorite => new { favorite.UserId, favorite.ItemId }).IsUnique();
        });

        modelBuilder.Entity<SubscriptionPlan>(entity =>
        {
            entity.HasKey(plan => plan.Id);
            entity.Property(plan => plan.Label).HasMaxLength(128);
            entity.Property(plan => plan.Description).HasMaxLength(256);
        });

        modelBuilder.Entity<SubscriptionPerk>(entity =>
        {
            entity.HasKey(perk => perk.Id);
            entity.HasOne(perk => perk.Plan)
                .WithMany(plan => plan.Perks)
                .HasForeignKey(perk => perk.PlanId);
            entity.Property(perk => perk.Text).HasMaxLength(128);
        });

        modelBuilder.Entity<Branch>().HasData(BranchSeed.Branches());
        modelBuilder.Entity<Category>().HasData(CatalogSeed.Categories());
        modelBuilder.Entity<Item>().HasData(CatalogSeed.Items());
        modelBuilder.Entity<Addon>().HasData(CatalogSeed.Addons());
        modelBuilder.Entity<Milk>().HasData(CatalogSeed.Milks());
        modelBuilder.Entity<SizeOption>().HasData(CatalogSeed.Sizes());
        modelBuilder.Entity<Tier>().HasData(LoyaltySeed.Tiers());
        modelBuilder.Entity<TierPerk>().HasData(LoyaltySeed.TierPerks());
        modelBuilder.Entity<Badge>().HasData(LoyaltySeed.Badges());
        modelBuilder.Entity<Coupon>().HasData(LoyaltySeed.Coupons());
        modelBuilder.Entity<SubscriptionPlan>().HasData(SubscriptionSeed.Plans());
        modelBuilder.Entity<SubscriptionPerk>().HasData(SubscriptionSeed.Perks());
    }
}
