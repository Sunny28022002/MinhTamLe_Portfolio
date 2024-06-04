using MedicineService.Models;

namespace MedicineService.Services
{
    public interface IUnitService
    {
        List<Unit> GetUnits();
        Unit GetUnitById(int id);
        Unit CreateUnit(Unit unit);
        Unit UpdateUnit(Unit unit);
        Unit DeleteUnit(int id);
        List<Unit> SearchUnitByName(string name);
    }
}
