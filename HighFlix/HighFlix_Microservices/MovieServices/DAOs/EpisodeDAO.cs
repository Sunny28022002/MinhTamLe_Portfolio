using MovieServices.Models;

namespace MovieServices.DAOs
{
    public class EpisodeDAO
    {
        public static List<Episode> GetEpisodes()
        {
            List<Episode> episodes = new List<Episode>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var episodeList = context.Episodes.ToList();
                    foreach (var episode in episodeList)
                    {
                        episodes.Add(episode);
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return episodes;
        }

        public static List<Episode> GetEpisodesByMovieId(int movieId)
        {
            List<Episode> episodes = new List<Episode>();
            try
            {
                using(var context = new HighFlixV4Context())
                {
                    var episodeList = context.Episodes.Where(e => e.MovieId == movieId);
                    foreach (var episode in episodeList)
                    {
                        if (episode.IsActive)
                        {
                            episodes.Add(episode);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return episodes;
        }
        public static Episode GetLastestEpisodesByMovieId(int movieId)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var episode = context.Episodes
                        .Where(e => e.MovieId == movieId && e.IsActive)
                        .OrderByDescending(e => e.EpisodeId)
                        .FirstOrDefault();

                    return episode;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }



        // Retrieve an episode by ID
        public static Episode GetEpisodeById(int episodeId)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    return context.Episodes.FirstOrDefault(e => e.EpisodeId == episodeId);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Create a new episode
        public static Episode CreateEpisode(Episode episode)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    context.Episodes.Add(episode);
                    context.SaveChanges();
                    return episode;
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Update existing episode
        public static Episode UpdateEpisode(Episode episode)
        {

            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _episode = context.Episodes.SingleOrDefault(e => e.EpisodeId == episode.EpisodeId);
                    if (_episode != null)
                    {
                        _episode.EpisodeName = episode.EpisodeName;
                        _episode.MediaLink = episode.MediaLink;
                        _episode.Description = episode.Description;
                        _episode.IsActive = episode.IsActive;

                        context.Entry(episode).CurrentValues.SetValues(_episode);
                        context.SaveChanges();
                        return _episode;
                    }
                    throw new Exception("Episode does not exist");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        // Delete Episode
        public static Episode DeleteEpisode(int episodeId)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _episode = context.Episodes.SingleOrDefault(e => e.EpisodeId == episodeId);
                    if (_episode != null)
                    {
                        _episode.IsActive = false;

                        context.Entry(_episode).CurrentValues.SetValues(_episode);
                        context.SaveChanges();
                        return _episode;
                    }
                    throw new Exception("Episode does not exist");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
