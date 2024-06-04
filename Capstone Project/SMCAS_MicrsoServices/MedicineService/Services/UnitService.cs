using MedicineService.DAOs;
using MedicineService.Models;

namespace MedicineService.Services
{
    public class UnitService : IUnitService
    {
        public Unit CreateUnit(Unit unit) => UnitDAO.CreateUnit(unit);

        public Unit DeleteUnit(int id) => UnitDAO.DeleteUnit(id);

        public Unit GetUnitById(int id) => UnitDAO.GetUnitById(id);

        public List<Unit> GetUnits() => UnitDAO.GetUnits();

        public List<Unit> SearchUnitByName(string name) => UnitDAO.SearchUnitByName(name);

        public Unit UpdateUnit(Unit unit) => UnitDAO.UpdateUnit(unit);
    }
}
