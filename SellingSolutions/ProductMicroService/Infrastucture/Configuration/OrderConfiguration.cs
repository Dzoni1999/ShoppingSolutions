using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProductsMicroService.Models;

namespace ProductsMicroService.Infrastucture.Configuration
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            builder.Property(x => x.UserId).IsRequired();
            builder.Property(x => x.DelivererId);
            builder.Property(x => x.UserName).IsRequired().HasMaxLength(30).HasDefaultValue("");
            builder.Property(x => x.DelivererName).IsRequired().HasMaxLength(30).HasDefaultValue("");
            builder.Property(x => x.DeliveryStatus).IsRequired();
            builder.Property(x => x.Address).IsRequired().HasMaxLength(30);
            builder.Property(x => x.Comment).IsRequired().HasMaxLength(200);
            builder.HasMany(x => x.ProductOrders)
                .WithOne(x => x.Order);
            builder.Property(x => x.TimeOfDelivery).IsRequired();
            builder.Property(x => x.TotalPrice).IsRequired();
        }
    }
}
