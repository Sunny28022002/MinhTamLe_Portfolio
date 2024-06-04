using MovieServices.Models;

namespace MovieServices.DAOs
{
    public class StatisticDAO
    {
        public static List<Statistic> GetStatiisticByDateToDate(DateTime startDate, DateTime endDate)
        {
            List<Statistic> statistics = new List<Statistic>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    statistics = context.Statistics.Where(movie => movie.Date >= startDate && movie.Date <= endDate)
                        .OrderByDescending(movie => movie.View)
                        .ToList();
                }
            }
             catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return statistics;
        }
    }
}
