using AutoMapper;
using MedicineService.DTOs;
using MedicineService.Models;
using MedicineService.Services;
using MedicineService.Services.ExaminatedRecordFolder;
using MedicineService.Services.MedicineExaminatedRecordFolder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MedicineService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicineExaminatedRecordController : ControllerBase
    {
        private IMedicineExaminatedRecordService recordService = new MedicineExaminatedRecordService();
        private IExaminatedRecordService examinatedService = new ExaminatedRecordService();
        private IMedicineService medicineService = new Services.MedicineService();

        public readonly IMapper _mapper;
        public readonly IConfiguration _configuration;
        public MedicineExaminatedRecordController(IMapper mapper, IConfiguration configuration)
        {
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet("ListAdmin")]
        [Authorize(Policy = "ExaminatedRecordFullAccess")]
        public ActionResult<ServiceResponse<List<MedicineExaminatedRecordResponse>>> GetAll()
        {
            var response = new ServiceResponse<List<MedicineExaminatedRecordResponse>>();
            var recordList = new List<MedicineExaminatedRecordResponse>();
            var records = recordService.GetAllMedicineRecord();
            foreach (var record in records)
            {
                MedicineExaminatedRecordResponse examinatedRecord = _mapper.Map<MedicineExaminatedRecordResponse>(record);
                if (examinatedRecord.MedicineId != null)
                {
                    examinatedRecord.MedicineName = medicineService.GetMedicineById(examinatedRecord.MedicineId).MedicineName;
                }
                else
                {
                    examinatedRecord.MedicineName = "None";
                }
                recordList.Add(examinatedRecord);
            }
            response.Data = recordList;
            response.Status = 200;
            response.Message = "Get All Examinated Record";
            response.TotalDataList = recordList.Count;
            return response;
        }

        [HttpGet]
        [Authorize(Policy = "ExaminatedRecordViewOrFullAccess")]
        public ActionResult<ServiceResponse<List<MedicineExaminatedRecordResponse>>> GetAllActive()
        {
            var response = new ServiceResponse<List<MedicineExaminatedRecordResponse>>();
            var recordList = new List<MedicineExaminatedRecordResponse>();
            var records = recordService.GetAllMedicineRecord();
            foreach (var record in records)
            {
                if (record.IsActive)
                {
                    MedicineExaminatedRecordResponse examinatedRecord = _mapper.Map<MedicineExaminatedRecordResponse>(record);
                    if (examinatedRecord.MedicineId != null)
                    {
                        examinatedRecord.MedicineName = medicineService.GetMedicineById(examinatedRecord.MedicineId).MedicineName;
                    } else
                    {
                        examinatedRecord.MedicineName = "None";
                    }
                    recordList.Add(examinatedRecord);
                }
            }
            response.Data = recordList;
            response.Status = 200;
            response.Message = "Get All Examinated Record";
            response.TotalDataList = recordList.Count;
            return response;
        }

        [HttpGet("id")]
        [Authorize(Policy = "ExaminatedRecordViewOrFullAccess")]
        public ActionResult<ServiceResponse<MedicineExaminatedRecordResponse>> GetRecordById(int id)
        {
            var response = new ServiceResponse<MedicineExaminatedRecordResponse>();
            var record = recordService.GetRecordById(id);
            if (record == null)
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Record not found.";
                response.TotalDataList = 0;
            }
            else
            {
                var recordResponse = _mapper.Map<MedicineExaminatedRecordResponse>(record);
                if (recordResponse.MedicineId != null)
                {
                    recordResponse.MedicineName = medicineService.GetMedicineById(recordResponse.MedicineId).MedicineName;
                }
                else
                {
                    recordResponse.MedicineName = "None";
                }
                response.Data = recordResponse;
                response.Status = 200;
                response.Message = "Get examinated record by id = " + id;
                response.TotalDataList = 1;
            }
            return response;
        }

        [HttpGet("GetList/id")]
        [Authorize(Policy = "ExaminatedRecordViewOrFullAccess")]
        public ActionResult<ServiceResponse<ListUpdateMedicine>> GetListMedicineByRecordId(int id)
        {
            var response = new ServiceResponse<ListUpdateMedicine>();
            var recordList = new ListUpdateMedicine();
            var list = new List<UpdateMedicine>();
            var records = recordService.SearchByRecordId(id);
            foreach (var record in records)
            {
                var medicine = new UpdateMedicine();
                recordList.RecordId = record.RecordId;
                medicine.Meid = record.Meid;
                medicine.MedicineId = record.MedicineId;
                medicine.Quantity = record.Quantity;
                medicine.MedicationGuide = record.MedicationGuide;
                medicine.IsActive = record.IsActive;
                list.Add(medicine);
            }
            recordList.medicineUpdatedList = list;
            if (recordList.medicineUpdatedList.Count > 0)
            {
                response.Data = recordList;
                response.Status = 200;
                response.Message = "Get list medicine by record id: " + id;
                response.TotalDataList = recordList.medicineUpdatedList.Count;
                return response;
            }
            else
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Get list medicine by record id: " + id;
                response.TotalDataList = 0;
                return response;
            }
        }

        [HttpPost]
        [Authorize(Policy = "ExaminatedRecordFullAccess")]
        public ActionResult<ServiceResponse<MedicineExaminatedRecordResponse>> CreateMedicineExaminatedRecord(CreateMedicineExaminatedRecordRequest request)
        {
            var response = new ServiceResponse<MedicineExaminatedRecordResponse>();
            var record = _mapper.Map<MedicineExaminatedRecord>(request);
            var recordIdCheck = examinatedService.GetRecordById(record.RecordId);
            var medicineIdCheck = medicineService.GetMedicineById(record.MedicineId);
            if (recordIdCheck == null || medicineIdCheck == null)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Create examinated record failed. RecordId or MedicineId not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else if (medicineIdCheck.Quantity < request.Quantity)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Failed. The number of " + medicineIdCheck.MedicineName + " in the drug warehouse is not enough.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var createdRecord = recordService.CreateRecord(record);
                response.Data = _mapper.Map<MedicineExaminatedRecordResponse>(createdRecord);
                response.Status = 200;
                response.Message = "Create examinated record successful.";
                response.TotalDataList = 1;
            }
            return response;
        }

        [HttpPut("Update")]
        [Authorize(Policy = "ExaminatedRecordFullAccess")]
        public ActionResult<ServiceResponse<MedicineExaminatedRecordResponse>> UpdateMedicineExaminatedRecord(UpdateMedicineExaminatedRecordRequest request)
        {
            var response = new ServiceResponse<MedicineExaminatedRecordResponse>();
            var recordMap = _mapper.Map<MedicineExaminatedRecord>(request);
            var recordIdCheck = examinatedService.GetRecordById(request.RecordId);
            var medicineIdCheck = medicineService.GetMedicineById(request.MedicineId);
            if (recordIdCheck == null || medicineIdCheck == null)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Updated examinated record failed. RecordId or MedicineId not found.";
                response.TotalDataList = 0;
            }
            else if (medicineIdCheck.Quantity < request.Quantity)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Failed. The number of " + medicineIdCheck.MedicineName + " in the drug warehouse is not enough.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            else
            {
                var updatedRecord = recordService.UpdateRecord(recordMap);
                if (updatedRecord != null)
                {
                    response.Data = _mapper.Map<MedicineExaminatedRecordResponse>(updatedRecord);
                    response.Status = 200;
                    response.Message = "Updated record successful.";
                    response.TotalDataList = 1;
                }
                else
                {
                    response.Data = null;
                    response.Status = 404;
                    response.Message = "Record not found.";
                    response.TotalDataList = 0;
                    return BadRequest(response);
                }
            }
            return response;
        }

        [HttpPut("Delete")]
        [Authorize(Roles = "Admin")]
        public ActionResult<ServiceResponse<MedicineExaminatedRecordResponse>> DeleteMedicineExaminatedRecord(int id)
        {
            var response = new ServiceResponse<MedicineExaminatedRecordResponse>();
            var updatedRecord = recordService.DeleteRecord(id);
            if (updatedRecord != null)
            {
                response.Data = _mapper.Map<MedicineExaminatedRecordResponse>(updatedRecord);
                response.Status = 200;
                response.Message = "Delete record successful.";
                response.TotalDataList = 1;
                return response;
            }
            else
            {
                response.Data = null;
                response.Status = 404;
                response.Message = "Record not found.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
        }

        [HttpGet("SearchAdmin/id")]
        [Authorize(Policy = "ExaminatedRecordViewOrFullAccess")]
        public ActionResult<ServiceResponse<List<MedicineExaminatedRecordResponse>>> SearchRecordByRecordId(int id)
        {
            var response = new ServiceResponse<List<MedicineExaminatedRecordResponse>>();
            var recordList = new List<MedicineExaminatedRecordResponse>();
            var records = recordService.SearchByRecordId(id);
            foreach (var record in records)
            {
                var recordMap = _mapper.Map<MedicineExaminatedRecordResponse>(record);
                if (recordMap.MedicineId != null)
                {
                    recordMap.MedicineName = medicineService.GetMedicineById(recordMap.MedicineId).MedicineName;
                }
                else
                {
                    recordMap.MedicineName = "None";
                }
                recordList.Add(recordMap);
            }
            if (recordList.Count > 0)
            {
                response.Data = recordList;
                response.Status = 200;
                response.Message = "Search record by record id: " + id;
                response.TotalDataList = recordList.Count;
                return response;
            }
            else
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Search record by record id: " + id;
                response.TotalDataList = 0;
                return response;
            }
        }

        [HttpGet("Search/id")]
        [Authorize(Policy = "ExaminatedRecordViewOrFullAccess")]
        public ActionResult<ServiceResponse<List<MedicineExaminatedRecordResponse>>> SearchRecordActiveByRecordId(int id)
        {
            var response = new ServiceResponse<List<MedicineExaminatedRecordResponse>>();
            var recordList = new List<MedicineExaminatedRecordResponse>();
            var records = recordService.SearchByRecordId(id);
            foreach (var record in records)
            {
                if (record.IsActive)
                {
                    var recordMap = _mapper.Map<MedicineExaminatedRecordResponse>(record);
                    if (recordMap.MedicineId != null)
                    {
                        recordMap.MedicineName = medicineService.GetMedicineById(recordMap.MedicineId).MedicineName;
                    }
                    else
                    {
                        recordMap.MedicineName = "None";
                    }
                    recordList.Add(recordMap);
                }
            }
            if (recordList.Count > 0)
            {
                response.Data = recordList;
                response.Status = 200;
                response.Message = "Search record by record id: " + id;
                response.TotalDataList = recordList.Count;
                return response;
            }
            else
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "Search record by record id: " + id;
                response.TotalDataList = 0;
                return response;
            }
        }

        [HttpPost("CreateList")]
        [Authorize(Policy = "ExaminatedRecordFullAccess")]
        public ActionResult<ServiceResponse<ListMedicine>> CreateListMedicine(ListMedicine listMedicine)
        {
            var response = new ServiceResponse<ListMedicine>();
            var message = new List<string>();
            var list = new ListMedicine();
            foreach (var me in listMedicine.medicineCreatedLists)
            {
                if (me.Quantity == 0)
                {
                    response.Data = null;
                    response.Status = 400;
                    response.Message = "List medicine is null.";
                    response.TotalDataList = 0;
                    return BadRequest(response);
                }
                else
                {
                    var recordIdCheck = examinatedService.GetRecordById(listMedicine.RecordId);
                    var medicineIdCheck = medicineService.GetMedicineById(me.MedicineId);
                    if (recordIdCheck == null || medicineIdCheck == null)
                    {
                        response.Data = null;
                        response.Status = 400;
                        response.Message = "Create examinated record failed. RecordId or MedicineId not found.";
                        response.TotalDataList = 0;
                        return BadRequest(response);
                    }
                    else if (medicineIdCheck.Quantity < me.Quantity)
                    {
                        response.Status = 400;
                        message.Add(medicineIdCheck.MedicineName);
                    }
                    else
                    {
                        var tempME = new MedicineExaminatedRecord();
                        tempME.RecordId = listMedicine.RecordId;
                        tempME.MedicineId = me.MedicineId;
                        tempME.Quantity = me.Quantity;
                        tempME.MedicationGuide = me.MedicationGuide;
                        recordService.CreateRecord(tempME);
                    }
                }
            }
            if (message.Count == 1)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "The number of " + message[0] + " in the drug warehouse is not enough.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            if (message.Count > 1)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "The number of ";
                foreach (var mess in message)
                {
                    response.Message += mess + " and ";
                }
                response.Message += "in the drug warehouse are not enough.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            response.Data = listMedicine;
            response.Status = 200;
            response.Message = "Create list medicine successful.";
            response.TotalDataList = 0;
            return response;
        }

        [HttpPut("UpdateList")]
        [Authorize(Policy = "ExaminatedRecordFullAccess")]
        public ActionResult<ServiceResponse<ListUpdateMedicine>> UpdateListMedicine(ListUpdateMedicine listMedicine)
        {
            var response = new ServiceResponse<ListUpdateMedicine>();
            var message = new List<string>();
            var list = new ListMedicine();
            foreach (var me in listMedicine.medicineUpdatedList)
            {
                if (me.Quantity == 0)
                {
                    response.Data = null;
                    response.Status = 400;
                    response.Message = "List medicine is null.";
                    response.TotalDataList = 0;
                    return BadRequest(response);
                }
                else
                {
                    var recordIdCheck = examinatedService.GetRecordById(listMedicine.RecordId);
                    var medicineIdCheck = medicineService.GetMedicineById(me.MedicineId);
                    if (recordIdCheck == null || medicineIdCheck == null)
                    {
                        response.Data = null;
                        response.Status = 400;
                        response.Message = "Update examinated record failed. RecordId or MedicineId not found.";
                        response.TotalDataList = 0;
                        return BadRequest(response);
                    }
                    else if (medicineIdCheck.Quantity < me.Quantity)
                    {
                        response.Status = 400;
                        message.Add(medicineIdCheck.MedicineName);
                    }
                    else if (!me.IsActive)
                    {
                        recordService.DeleteRecord(me.Meid);
                    }
                    else
                    {
                        var tempME = new MedicineExaminatedRecord();
                        tempME.Meid = me.Meid;
                        tempME.RecordId = listMedicine.RecordId;
                        tempME.MedicineId = me.MedicineId;
                        tempME.Quantity = me.Quantity;
                        tempME.MedicationGuide = me.MedicationGuide;
                        tempME.IsActive = me.IsActive;
                        recordService.UpdateRecord(tempME);
                    }
                }
            }
            if (message.Count == 1)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "The number of " + message[0] + " in the drug warehouse is not enough.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            if (message.Count > 1)
            {
                response.Data = null;
                response.Status = 400;
                response.Message = "The number of ";
                foreach (var mess in message)
                {
                    response.Message += mess + " and ";
                }
                response.Message += "in the drug warehouse are not enough.";
                response.TotalDataList = 0;
                return BadRequest(response);
            }
            response.Data = listMedicine;
            response.Status = 200;
            response.Message = "Update list medicine successful.";
            response.TotalDataList = 0;
            return response;
        }
    }
}
