namespace MovieServices.DTOs.MovieDTOs.ResponseDTO
{
    public class StatisticMovieResponse
    {
        public string MovieName { get; set; } = null!;
        public string MovieThumnailImage { get; set; } = null!;
        public string ReleasedYear { get; set; } = null!;
        public int View { get; set; }
    }
}
