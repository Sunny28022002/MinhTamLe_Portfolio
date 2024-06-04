using MovieServices.DAOs;
using MovieServices.Models;

namespace MovieServices.Services.StatisticServices
{
    public class StatisticService : IStatisticService
    {
        public List<Statistic> GetStatisticByDateToDate(DateTime startDate, DateTime endDate) => StatisticDAO.GetStatiisticByDateToDate(startDate, endDate);
    }
}
