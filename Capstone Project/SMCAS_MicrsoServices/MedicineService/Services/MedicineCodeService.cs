using MedicineService.DAOs;
using MedicineService.Models;

namespace MedicineService.Services
{
    public class MedicineCodeService : IMedicineCodeService
    {
        public MedicineCode CreateMedicineCode(MedicineCode medicineCode) => MedicineCodeDAO.CreateMedicineCode(medicineCode);

        public MedicineCode DeleteMedicineCode(int id) => MedicineCodeDAO.DeleteMedicineCode(id);

        public MedicineCode GetMedicineCodeById(int id) => MedicineCodeDAO.GetCodeById(id);

        public MedicineCode GetMedicineCodeByIdAdmin(int id) => MedicineCodeDAO.GetCodeByIdAdmin(id);

        public List<MedicineCode> GetMedicineCodes() => MedicineCodeDAO.GetCodes();
        
        public List<MedicineCode> GetMedicineCodesAdmin() => MedicineCodeDAO.GetCodesAdmin();

        public MedicineCode UpdateMedicineCode(MedicineCode medicineCode) => MedicineCodeDAO.UpdateMedicineCode(medicineCode);

        public List<MedicineCode> GetMedicineCodesByName(string name) => MedicineCodeDAO.SearchMedicineCodeByName(name);

        public List<MedicineCode> GetMedicineCodesByNameAdmin(string name) => MedicineCodeDAO.SearchMedicineCodeByNameAdmin(name);
    }
}
