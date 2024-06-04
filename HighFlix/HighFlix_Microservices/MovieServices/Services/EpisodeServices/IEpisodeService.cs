using MovieServices.Models;

namespace MovieServices.Services.EpisodeServices
{
    public interface IEpisodeService
    {
        List<Episode> GetEpisodes();
        List<Episode> GetEpisodesByMovieId(int movieId);
        Episode GetLastestEpisodesByMovieId(int movieId);
        Episode GetEpisodeById(int episodeId);
        Episode CreateEpisode(Episode episode);
        Episode UpdateEpisode(Episode episode);
        Episode DeleteEpisode(int episodeId);
    }
}
