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
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderItemAddon> OrderItemAddons => Set<OrderItemAddon>();

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

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(order => order.Id);
            entity.Property(order => order.Status).HasMaxLength(32);
            entity.HasOne(order => order.User)
                .WithMany()
                .HasForeignKey(order => order.UserId);
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

        modelBuilder.Entity<Category>().HasData(CatalogSeed.Categories());
        modelBuilder.Entity<Item>().HasData(CatalogSeed.Items());
        modelBuilder.Entity<Addon>().HasData(CatalogSeed.Addons());
        modelBuilder.Entity<Milk>().HasData(CatalogSeed.Milks());
        modelBuilder.Entity<SizeOption>().HasData(CatalogSeed.Sizes());
    }
}
