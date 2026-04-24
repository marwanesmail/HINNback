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
        public DbSet<AuditLog> AuditLogs { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<DoctorAvailability> DoctorAvailabilities { get; set; }
        public DbSet<PharmacyInventory> PharmacyInventories { get; set; }
        public DbSet<DrugExchange> DrugExchanges { get; set; }
        public DbSet<PharmacyOrder> PharmacyOrders { get; set; }
        public DbSet<CompanyMedicine> CompanyMedicines { get; set; }

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

            // Prescription -> Doctor (الطبيب اللي كتب الروشتة)
            builder.Entity<Prescription>()
                .HasOne(p => p.Doctor)
                .WithMany()
                .HasForeignKey(p => p.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

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

            // Index للبحث السريع في سجلات التدقيق
            builder.Entity<AuditLog>()
                .HasIndex(a => a.UserId);
            
            builder.Entity<AuditLog>()
                .HasIndex(a => new { a.EntityType, a.EntityId });
            
            builder.Entity<AuditLog>()
                .HasIndex(a => a.CreatedAt);

            // Appointment -> Patient
            builder.Entity<Appointment>()
                .HasOne(a => a.Patient)
                .WithMany()
                .HasForeignKey(a => a.PatientId)
                .OnDelete(DeleteBehavior.Cascade);

            // Appointment -> Doctor (optional)
            builder.Entity<Appointment>()
                .HasOne(a => a.Doctor)
                .WithMany()
                .HasForeignKey(a => a.DoctorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for Appointments
            builder.Entity<Appointment>()
                .HasIndex(a => a.PatientId);
            
            builder.Entity<Appointment>()
                .HasIndex(a => a.DoctorId);
            
            builder.Entity<Appointment>()
                .HasIndex(a => new { a.PatientId, a.Status });
            
            builder.Entity<Appointment>()
                .HasIndex(a => a.AppointmentDate);

            // DoctorAvailability -> Doctor
            builder.Entity<DoctorAvailability>()
                .HasOne(da => da.Doctor)
                .WithMany()
                .HasForeignKey(da => da.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            // DoctorAvailability -> Patient (optional)
            builder.Entity<DoctorAvailability>()
                .HasOne(da => da.BookedByPatient)
                .WithMany()
                .HasForeignKey(da => da.BookedByPatientId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for DoctorAvailability
            builder.Entity<DoctorAvailability>()
                .HasIndex(da => da.DoctorId);
            
            builder.Entity<DoctorAvailability>()
                .HasIndex(da => da.Date);
            
            builder.Entity<DoctorAvailability>()
                .HasIndex(da => new { da.DoctorId, da.Date, da.IsAvailable });

            // PharmacyInventory -> Pharmacy
            builder.Entity<PharmacyInventory>()
                .HasOne(pi => pi.Pharmacy)
                .WithMany()
                .HasForeignKey(pi => pi.PharmacyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Indexes for PharmacyInventory
            builder.Entity<PharmacyInventory>()
                .HasIndex(pi => pi.PharmacyId);
            
            builder.Entity<PharmacyInventory>()
                .HasIndex(pi => pi.MedicineName);
            
            builder.Entity<PharmacyInventory>()
                .HasIndex(pi => pi.ExpiryDate);

            // DrugExchange relationships
            builder.Entity<DrugExchange>()
                .HasOne(de => de.FromPharmacy)
                .WithMany()
                .HasForeignKey(de => de.FromPharmacyId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<DrugExchange>()
                .HasOne(de => de.ToPharmacy)
                .WithMany()
                .HasForeignKey(de => de.ToPharmacyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for DrugExchange
            builder.Entity<DrugExchange>()
                .HasIndex(de => de.FromPharmacyId);
            
            builder.Entity<DrugExchange>()
                .HasIndex(de => de.ToPharmacyId);
            
            builder.Entity<DrugExchange>()
                .HasIndex(de => de.Status);

            // PharmacyOrder relationships
            builder.Entity<PharmacyOrder>()
                .HasOne(po => po.Pharmacy)
                .WithMany()
                .HasForeignKey(po => po.PharmacyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<PharmacyOrder>()
                .HasOne(po => po.Company)
                .WithMany()
                .HasForeignKey(po => po.CompanyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Indexes for PharmacyOrder
            builder.Entity<PharmacyOrder>()
                .HasIndex(po => po.PharmacyId);
            
            builder.Entity<PharmacyOrder>()
                .HasIndex(po => po.CompanyId);
            
            builder.Entity<PharmacyOrder>()
                .HasIndex(po => po.Status);
            
            builder.Entity<PharmacyOrder>()
                .HasIndex(po => po.MedicineName);

            // CompanyMedicine → Company
            builder.Entity<CompanyMedicine>()
                .HasOne(cm => cm.Company)
                .WithMany()
                .HasForeignKey(cm => cm.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<CompanyMedicine>()
                .Property(cm => cm.UnitPrice)
                .HasPrecision(18, 2);

            // Indexes for CompanyMedicine
            builder.Entity<CompanyMedicine>()
                .HasIndex(cm => cm.CompanyId);

            builder.Entity<CompanyMedicine>()
                .HasIndex(cm => cm.MedicineName);

            builder.Entity<CompanyMedicine>()
                .HasIndex(cm => cm.IsAvailable);

            builder.Entity<CompanyMedicine>()
                .HasIndex(cm => cm.Category);
        }
    }
}
