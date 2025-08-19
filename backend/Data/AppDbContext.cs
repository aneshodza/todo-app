using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Entities.Models;

namespace Backend.Data;

public class AppDbContext : IdentityDbContext<IdentityUser>
{
    public DbSet<Todo> Todos { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Todo>()
              .HasOne(t => t.Owner)
              .WithMany()
              .HasForeignKey(t => t.OwnerId)
              .IsRequired()
              .OnDelete(DeleteBehavior.Cascade);
        }
}
