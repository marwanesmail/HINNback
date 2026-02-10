using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace MyHealthcareApi.Services
{
    public static class FileHelper
    {
        public static async Task<string> SaveFileAsync(IFormFile file, string webRootPath, string subFolder)
        {
            if (file == null || file.Length == 0) return string.Empty;

            var folder = Path.Combine(webRootPath, "uploads", subFolder);
            if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var fullPath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // return relative path from wwwroot
            var relative = Path.Combine("uploads", subFolder, fileName).Replace("\\", "/");
            return relative;
        }
    }
}
