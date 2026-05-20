namespace MyHealthcareApi.DTOs
{
    /// <summary>
    /// إحصائيات داشبورد الشركة
    /// </summary>
    public class CompanyDashboardStatsDto
    {
        // ═══════════════════════════════════════════════════════
        // المنتجات
        // ═══════════════════════════════════════════════════════

        /// <summary>إجمالي المنتجات المسجلة</summary>
        public int TotalProducts { get; set; }

        /// <summary>المنتجات المتاحة للطلب (متوفر)</summary>
        public int AvailableProducts { get; set; }

        /// <summary>المنتجات ذات المخزون المنخفض</summary>
        public int LowStockProducts { get; set; }

        /// <summary>المنتجات غير المتوفرة (نفد مخزونها أو معطلة)</summary>
        public int OutOfStockProducts { get; set; }

        // ═══════════════════════════════════════════════════════
        // الطلبات
        // ═══════════════════════════════════════════════════════

        /// <summary>إجمالي الطلبات</summary>
        public int TotalOrders { get; set; }

        /// <summary>طلبات جديدة في الانتظار (Pending)</summary>
        public int NewOrders { get; set; }

        /// <summary>طلبات قيد التجهيز (Processing + Confirmed + Shipped)</summary>
        public int ProcessingOrders { get; set; }

        /// <summary>طلبات تم تسليمها (Delivered)</summary>
        public int CompletedOrders { get; set; }

        /// <summary>طلبات ملغاة أو مرفوضة</summary>
        public int CancelledOrders { get; set; }

        // ═══════════════════════════════════════════════════════
        // العملاء والمبيعات
        // ═══════════════════════════════════════════════════════

        /// <summary>عدد الصيدليات النشطة (طلبت مرة واحدة على الأقل)</summary>
        public int ActivePharmacies { get; set; }

        /// <summary>مبيعات اليوم (الطلبات المكتملة)</summary>
        public decimal TodaySales { get; set; }

        /// <summary>مبيعات الشهر الحالي</summary>
        public decimal MonthlySales { get; set; }

        /// <summary>إجمالي المبيعات الكلية</summary>
        public decimal TotalSales { get; set; }
    }
}
