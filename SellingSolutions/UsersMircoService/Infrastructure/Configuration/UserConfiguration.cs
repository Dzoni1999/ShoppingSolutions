using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UsersMicroService.Models;

namespace UsersMicroService.Infrastructure.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.HasIndex(x => x.Username).IsUnique();
            builder.HasIndex(x => x.Email).IsUnique();
            builder.Property(x => x.Password).IsRequired().HasMaxLength(100);
            builder.Property(x => x.Firstname).IsRequired().HasMaxLength(30);
            builder.Property(x => x.Lastname).IsRequired().HasMaxLength(30);
            builder.Property(x => x.BirthDate).IsRequired();
            builder.Property(x => x.Address).IsRequired().HasMaxLength(30);
            builder.Property(x => x.UserType).IsRequired();
            builder.Property(x => x.PhotoUrl).IsRequired().HasDefaultValue("NO_PHOTO").HasMaxLength(100);
            builder.Property(x => x.IsVerified).IsRequired();
            builder.Property(x => x.IsGoogle).IsRequired().HasDefaultValue(false);
        }
    }
}
