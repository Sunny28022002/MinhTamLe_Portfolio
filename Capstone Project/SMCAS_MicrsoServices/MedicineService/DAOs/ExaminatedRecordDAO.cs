using MedicineService.Models;
using System.Security.Cryptography.Xml;

namespace MedicineService.DAOs
{
    public class ExaminatedRecordDAO
    {
        public static List<ExaminatedRecord> GetAll()
        {
            List<ExaminatedRecord> examinatedRecords = new List<ExaminatedRecord>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var records = context.ExaminatedRecords.ToList();
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

        public static ExaminatedRecord GetRecordById(int id)
        {
            var record = new ExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.ExaminatedRecords.SingleOrDefault(r => r.RecordId == id);
                    if (recordCheck != null)
                    {
                        record = recordCheck;
                    }
                    else
                    {
                        record = null;
                    }
                }
                return record;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static ExaminatedRecord CreateRecord(ExaminatedRecord record)
        {
            var createdRecord = new ExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    createdRecord = record;
                    context.ExaminatedRecords.Add(createdRecord);
                    context.SaveChanges();
                }
                return createdRecord;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static ExaminatedRecord UpdateRecord(ExaminatedRecord record)
        {
            var updatedRecord = new ExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.ExaminatedRecords.SingleOrDefault(r => r.RecordId == record.RecordId);
                    if (recordCheck != null)
                    {
                        updatedRecord = record;
                        context.Entry(recordCheck).CurrentValues.SetValues(updatedRecord);
                        context.SaveChanges();
                    }
                    else
                    {
                        updatedRecord = null;
                    }
                }
                return updatedRecord;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static ExaminatedRecord DeleteRecord(int id)
        {
            var deletedRecord = new ExaminatedRecord();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var recordCheck = context.ExaminatedRecords.FirstOrDefault(r => r.RecordId == id && r.IsActive);
                    if (recordCheck == null)
                    {
                        return null;
                    }
                    else
                    {
                        deletedRecord = recordCheck;
                        deletedRecord.IsActive = false;
                        var medicineRecord = context.MedicineExaminatedRecords.Where(r => r.RecordId == id).ToList();
                        foreach (var record in medicineRecord)
                        {
                            record.IsActive = false;
                            context.MedicineExaminatedRecords.Update(record);
                        }
                        context.Entry(deletedRecord).CurrentValues.SetValues(recordCheck);
                        context.SaveChanges();
                    }
                }
                return deletedRecord;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static List<ExaminatedRecord> SearchRecordByPeopleId(int id)
        {
            List<ExaminatedRecord> examinatedRecords = new List<ExaminatedRecord>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var records = context.ExaminatedRecords.Where(r => (r.DoctorId == id || r.PatientId == id));
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

        public static List<ExaminatedRecord> SearchRecordByName(string name)
        {
            List<ExaminatedRecord> examinatedRecords = new List<ExaminatedRecord>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    var records = context.ExaminatedRecords.ToList();
                    var nameList = context.Users.Where(u => u.FirstName.ToLower() == name.ToLower() || u.LastName.ToLower() == name.ToLower()).ToList();
                    foreach (var item in nameList)
                    {
                        for (int i = 0; i < records.Count; i++)
                        {
                            if (records[i].DoctorId == item.UserId || records[i].PatientId == item.UserId)
                            {
                                examinatedRecords.Add(records[i]);
                            }
                        }
                    }
                }
                return examinatedRecords;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static User GetPeopleInfo(int id)
        {
            var user = new User();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    user = context.Users.FirstOrDefault(user => (user.UserId == id));
                    if (user != null)
                    {
                        return user;
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public static List<User> GetDoctorList()
        {
            List<User> users = new List<User>();
            try
            {
                using (var context = new SepprojectDbV7Context())
                {
                    users = context.Users.Where(u => u.RoleId == 1).ToList();
                    return users;
                }
            } catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
