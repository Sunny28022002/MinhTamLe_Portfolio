using MedicineService.DTOs;
using MedicineService.Models;
using Microsoft.EntityFrameworkCore;

namespace MedicineService.DAOs
{
    public class MedicineCodeDAO
    {
        public static List<MedicineCode> GetCodes()
        {
            List<MedicineCode> medicines = new List<MedicineCode>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var codeList = context.MedicineCodes.ToList();
                    foreach (var MedicineCode in codeList)
                    {
                        medicines.Add(MedicineCode);
                    }
                }
                return medicines;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<MedicineCode> GetCodesAdmin()
        {
            List<MedicineCode> medicines = new List<MedicineCode>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var codeList = context.MedicineCodes.ToList();
                    return codeList;
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineCode GetCodeById(int id)
        {
            var medicineCode = new MedicineCode();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    medicineCode = context.MedicineCodes.FirstOrDefault(m => m.CodeId == id);
                }
                return medicineCode;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineCode GetCodeByIdAdmin(int id)
        {
            var medicineCode = new MedicineCode();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    medicineCode = context.MedicineCodes.FirstOrDefault(m => m.CodeId == id);
                }
                return medicineCode;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineCode CreateMedicineCode(MedicineCode medicineCode)
        {
            var createMedicineCode = new MedicineCode();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var medicineCodeCheck = context.MedicineCodes.FirstOrDefault(m => m.CodeName == medicineCode.CodeName);
                    if (medicineCodeCheck != null)
                    {
                        return null;
                    }
                    else
                    {
                        createMedicineCode = medicineCode;
                        createMedicineCode.IsActive = true;
                        context.MedicineCodes.Add(createMedicineCode);
                        context.SaveChanges();
                    }
                }
                return medicineCode;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineCode UpdateMedicineCode(MedicineCode medicineCode)
        {
            var updatedMedicineCode = new MedicineCode();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var medicineCodeCheck = context.MedicineCodes.FirstOrDefault(m => m.CodeId == medicineCode.CodeId);
                    if (medicineCodeCheck != null)
                    {
                        updatedMedicineCode = medicineCode;
                        updatedMedicineCode.IsActive = medicineCodeCheck.IsActive;
                        context.Entry(medicineCodeCheck).CurrentValues.SetValues(updatedMedicineCode);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }
                }
                return updatedMedicineCode;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineCode DeleteMedicineCode(int id)
        {
            var deletedMedicineCode = new MedicineCode();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var medicineCodeCheck = context.MedicineCodes.FirstOrDefault(m => m.CodeId == id);
                    if (medicineCodeCheck != null)
                    {
                        deletedMedicineCode = medicineCodeCheck;
                        deletedMedicineCode.IsActive = false;
                        context.MedicineCodes.Update(deletedMedicineCode);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }
                }
                return deletedMedicineCode;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<MedicineCode> SearchMedicineCodeByName(string name)
        {
            List<MedicineCode> medicineCodes = new List<MedicineCode>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    medicineCodes = context.MedicineCodes
                        .Where(m => m.IsActive && (m.CodeName.Contains(name)))
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return medicineCodes;
        }

        public static List<MedicineCode> SearchMedicineCodeByNameAdmin(string name)
        {
            List<MedicineCode> medicineCodes = new List<MedicineCode>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    medicineCodes = context.MedicineCodes
                        .Where(m => (m.CodeName.Contains(name)))
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return medicineCodes;
        }
    }
}
