using MedicineService.Models;
using System.Net.WebSockets;

namespace MedicineService.DAOs
{
    public class MedicineExaminatedRecordDAO
    {
        public static List<MedicineExaminatedRecord> GetAllMedicineRecord()
        {
            List<MedicineExaminatedRecord> examinatedRecords = new List<MedicineExaminatedRecord>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var records = context.MedicineExaminatedRecords.ToList();
                    foreach (var record in records)
                    {
                        examinatedRecords.Add(record);
                    }
                }
                return examinatedRecords;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineExaminatedRecord GetRecordById(int id)
        {
            var record = new MedicineExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.MedicineExaminatedRecords.FirstOrDefault(r => r.Meid == id);
                    if (recordCheck != null)
                    {
                        record = recordCheck;
                    } else
                    {
                        return null;
                    }
                }
                return record;
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineExaminatedRecord CreateMedicineRecord(MedicineExaminatedRecord record)
        {
            var createdRecord = new MedicineExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var quantity = record.Quantity;
                    var medicine = context.Medicines.FirstOrDefault(r => r.MedicineId == record.MedicineId);
                    if (medicine.Quantity < quantity)
                    {
                        return null;
                    } else
                    {
                        var medicineNew = new Medicine();
                        createdRecord = record;
                        createdRecord.IsActive = true;
                        context.MedicineExaminatedRecords.Add(createdRecord);
                        medicineNew = medicine;
                        medicineNew.Quantity -= quantity;
                        context.Entry(medicine).CurrentValues.SetValues(medicineNew);
                        context.SaveChanges();
                    }
                }
                return createdRecord;
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineExaminatedRecord UpdateMedicineRecord(MedicineExaminatedRecord record)
        {
            var updatedRecord = new MedicineExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.MedicineExaminatedRecords.FirstOrDefault(r => r.Meid == record.Meid);
                    var medicine = context.Medicines.FirstOrDefault(r => r.MedicineId == record.MedicineId);
                    if (recordCheck != null)
                    {
                        updatedRecord = record;
                        context.Entry(recordCheck).CurrentValues.SetValues(updatedRecord);
                        var medicineUpdated = new Medicine();
                        medicineUpdated = medicine;
                        medicineUpdated.Quantity -= record.Quantity;
                        context.Entry(medicine).CurrentValues.SetValues(medicineUpdated);
                        context.SaveChanges();
                    } else
                    {
                        return null;
                    }
                }
                return updatedRecord;
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static MedicineExaminatedRecord DeleteMedicineRecord(int id)
        {
            var deletedRecord = new MedicineExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.MedicineExaminatedRecords.FirstOrDefault(r => r.Meid == id && r.IsActive);
                    if (recordCheck != null)
                    {
                        deletedRecord = recordCheck;
                        deletedRecord.IsActive = false;
                        context.Entry(recordCheck).CurrentValues.SetValues(deletedRecord);
                        context.SaveChanges();
                    }
                    else
                    {
                        return null;
                    }
                }
                return deletedRecord;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<MedicineExaminatedRecord> SearchByRecordId(int id)
        {
            var records = new List<MedicineExaminatedRecord>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.MedicineExaminatedRecords.Where(r => r.RecordId == id);
                    foreach (var record in recordCheck)
                    {
                        records.Add(record);
                    }
                }
                return records;
            } catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
