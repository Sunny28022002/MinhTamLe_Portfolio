using MedicineService.DTOs;
using MedicineService.Models;

namespace MedicineService.Services
{
    public interface IMedicineService
    {
        List<Medicine> GetMedicines();
        List<Medicine> GetMedicinesAdmin();
        Medicine GetMedicineById(int id);
        Medicine GetMedicineByIdAdmin(int id);
        Medicine CreateMedicine(Medicine medicine);
        Medicine UpdateMedicine(Medicine medicine);
        Medicine DeleteMedicine(int id);
        List<Medicine> GetMedicinesByname(string name);
        List<Medicine> GetMedicinesBynameAdmin(string name);
        int CountActiveMedicine();
        int CountInActiveMedicine();
        List<StatisticNumberOfMedicine> StatisticNumberOfMedicine();
    }
}
