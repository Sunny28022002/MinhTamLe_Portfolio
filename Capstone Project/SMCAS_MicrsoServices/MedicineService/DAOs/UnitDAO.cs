using MedicineService.Models;

namespace MedicineService.DAOs
{
    public class UnitDAO
    {
        public static List<Unit> GetUnits()
        {
            List<Unit> units = new List<Unit>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var unitList = context.Units.ToList();
                    foreach (var unit in unitList)
                    {
                        units.Add(unit);
                    }
                }
                return units;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Unit GetUnitById(int id)
        {
            var unit = new Unit();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    unit = context.Units.FirstOrDefault(u => u.UnitId == id);
                }
                return unit;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Unit CreateUnit(Unit unit)
        {
            var createdUnit = new Unit();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var unitCheck = context.Units.FirstOrDefault(u => u.UnitName == unit.UnitName);
                    if (unitCheck != null)
                    {
                        return null;
                    }
                    else
                    {
                        createdUnit = unit;
                        createdUnit.IsActive = true;
                        context.Units.Add(createdUnit);
                        context.SaveChanges();
                    }
                }
                return unit;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Unit UpdateUnit(Unit unit)
        {
            var updatedUnit = new Unit();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var unitCheck = context.Units.FirstOrDefault(u => u.UnitId == unit.UnitId);
                    var unitNameCheck = context.Units.FirstOrDefault(u => u.UnitName.ToLower() == unit.UnitName.ToLower());
                    if (unitCheck != null && unitNameCheck == null)
                    {
                        updatedUnit = unit;
                        context.Entry(unitCheck).CurrentValues.SetValues(updatedUnit);
                        context.SaveChanges();
                    } else
                    {
                        return null;
                    }
                }
                return updatedUnit;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static Unit DeleteUnit(int id)
        {
            var deletedUnit = new Unit();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var unitCheck = context.Units.FirstOrDefault(u => u.UnitId == id);
                    if (unitCheck != null)
                    {
                        deletedUnit = unitCheck;
                        deletedUnit.IsActive = false;
                        context.Units.Update(deletedUnit);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }
                }
                return deletedUnit;
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<Unit> SearchUnitByName(string name)
        {
            var unitList = new List<Unit>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var unitCheck = context.Units.Where(u => u.UnitName.ToLower().Contains(name.ToLower())).ToList();
                    if (unitCheck != null)
                    {
                        foreach (var item in unitCheck)
                        {
                            unitList.Add(item);
                        }
                        return unitList;
                    } else
                    {
                        return null;
                    }
                }
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
