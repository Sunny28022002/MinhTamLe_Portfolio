using MovieServices.Models;

namespace MovieServices.Services.StatisticServices
{
    public interface IStatisticService
    {
        List<Statistic> GetStatisticByDateToDate(DateTime startDate, DateTime endDate);
    }
}
