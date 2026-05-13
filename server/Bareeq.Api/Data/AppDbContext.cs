using Bareeq.Api.Entities;
using Microsoft.EntityFrameworkCore;

namespace Bareeq.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(user => user.Id);
            entity.HasIndex(user => user.Email).IsUnique();
            entity.HasIndex(user => user.GoogleSubject).IsUnique();
            entity.Property(user => user.Email).HasMaxLength(256);
            entity.Property(user => user.FullName).HasMaxLength(256);
            entity.Property(user => user.Role).HasMaxLength(32);
        });
    }
}
