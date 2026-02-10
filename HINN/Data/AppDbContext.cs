using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyHealthcareApi.Models;

namespace MyHealthcareApi.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Pharmacy> Pharmacies { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PharmacyResponse> PharmacyResponses { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Doctor ↔ AppUser
            builder.Entity<Doctor>()
                .HasOne(d => d.AppUser)
                .WithMany()
                .HasForeignKey(d => d.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Pharmacy ↔ AppUser
            builder.Entity<Pharmacy>()
                .HasOne(p => p.AppUser)
                .WithMany()
                .HasForeignKey(p => p.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Company ↔ AppUser
            builder.Entity<Company>()
                .HasOne(c => c.AppUser)
                .WithMany()
                .HasForeignKey(c => c.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Message Sender
            builder.Entity<Message>()
                .HasOne(m => m.Sender)
                .WithMany()
                .HasForeignKey(m => m.SenderId)
                .OnDelete(DeleteBehavior.Restrict); // مهم جدًا

            // Message Receiver
            builder.Entity<Message>()
                .HasOne(m => m.Receiver)
                .WithMany()
                .HasForeignKey(m => m.ReceiverId)
                .OnDelete(DeleteBehavior.Cascade);

            // Prescription -> Patient
            builder.Entity<Prescription>()
                .HasOne(p => p.Patient)
                .WithMany()
                .HasForeignKey(p => p.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            // PharmacyResponse -> Prescription
            builder.Entity<PharmacyResponse>()
                .HasOne(pr => pr.Prescription)
                .WithMany(p => p.Responses)
                .HasForeignKey(pr => pr.PrescriptionId)
                .OnDelete(DeleteBehavior.NoAction);

            // PharmacyResponse Price precision
            builder.Entity<PharmacyResponse>()
                .Property(pr => pr.Price)
                .HasPrecision(18, 2);

            // Rating -> User
            builder.Entity<Rating>()
                .HasOne(r => r.User)
                .WithMany()
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Index للتأكد إن المستخدم يقيّم مرة واحدة بس
            builder.Entity<Rating>()
                .HasIndex(r => new { r.UserId, r.EntityType, r.EntityId })
                .IsUnique();
        }
    }
}
