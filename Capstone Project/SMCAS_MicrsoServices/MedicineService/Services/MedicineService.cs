using MedicineService.DAOs;
using MedicineService.DTOs;
using MedicineService.Models;

namespace MedicineService.Services
{
    public class MedicineService : IMedicineService
    {
        public Medicine CreateMedicine(Medicine Medicine) => MedicineDAO.CreateMedicine(Medicine);

        public Medicine DeleteMedicine(int id) => MedicineDAO.DeleteMedicine(id);

        public Medicine GetMedicineById(int id) => MedicineDAO.GetMedicineById(id);

        public Medicine GetMedicineByIdAdmin(int id) => MedicineDAO.GetMedicineByIdAdmin(id);

        public List<Medicine> GetMedicines() => MedicineDAO.GetMedicines();

        public List<Medicine> GetMedicinesAdmin() => MedicineDAO.GetMedicinesAdmin();

        public Medicine UpdateMedicine(Medicine Medicine) => MedicineDAO.UpdateMedicine(Medicine);

        public List<Medicine> GetMedicinesByname(string name) => MedicineDAO.SearchMedicineByName(name);

        public List<Medicine> GetMedicinesBynameAdmin(string name) => MedicineDAO.SearchMedicineByNameAdmin(name);

        public int CountActiveMedicine() => MedicineDAO.CountActiveMedicine();
        
        public int CountInActiveMedicine()=> MedicineDAO.CountInActiveMedicine();

        public List<StatisticNumberOfMedicine> StatisticNumberOfMedicine() => MedicineDAO.StatisticNumberOfMedicine();
    }
}
