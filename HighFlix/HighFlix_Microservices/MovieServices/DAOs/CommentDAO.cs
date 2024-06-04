using MovieServices.Models;

namespace MovieServices.DAOs
{
    public class CommentDAO
    {
        public static List<Comment> GetComments()
        {
            List<Comment> comments = new List<Comment>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var commentList = context.Comments.ToList();
                    foreach (var comment in commentList)
                    {
                        if (comment.IsActive)
                        {
                            comments.Add(comment);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return comments;
        }
        public static Comment GetCommentById(int id)
        {
            Comment comment = new Comment();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    comment = context.Comments.SingleOrDefault(cv => (cv.CommentId == id) && cv.IsActive);
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return comment;
        }

        public static List<Comment> GetCommentByMovieId(int movieId)
        {
            List<Comment> comments = new List<Comment>();
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var commentList = context.Comments.Where(e => e.MovieId == movieId);
                    foreach (var comment in commentList)
                    {
                        if (comment.IsActive)
                        {
                            comments.Add(comment);
                        }
                    }
                }

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
            return comments;
        }
        public static Comment CreateComment(Comment comment)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    // Check if the user has already submitted a comment for the same movie
                    var existingComment = context.Comments
                        .FirstOrDefault(c => c.UserId == comment.UserId && c.MovieId == comment.MovieId);

                    if (existingComment != null)
                    {
                        // Update the existing comment and rating
                        existingComment.CommentContent = comment.CommentContent;
                        existingComment.Rating = comment.Rating;
                        existingComment.CommentedDate = DateTime.Now;

                        context.SaveChanges();
                        return existingComment;
                    }

                    // If no existing comment, create a new one
                    comment.IsActive = true;
                    comment.CommentedDate = DateTime.Now;

                    if (comment.Rating > 0 && comment.Rating <= 5)
                    {
                        context.Comments.Add(comment);
                        context.SaveChanges();
                        return comment;
                    }
                    else
                    {
                        throw new ArgumentException("Rating must be greater than 0 and less than or equal to 5.");
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }



        public static Comment UpdateComment(Comment comment)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _comment = context.Comments.SingleOrDefault(c => c.CommentId == comment.CommentId);
                    if (_comment != null)
                    {
                        _comment.CommentContent = comment.CommentContent;
                        _comment.CommentedDate = DateTime.Now;

                        context.Entry(comment).CurrentValues.SetValues(_comment);
                        context.SaveChanges();
                        return _comment;
                    }
                    throw new Exception("Comment does not exist");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
        public static Comment DeleteComment(int commentId)
        {
            try
            {
                using (var context = new HighFlixV4Context())
                {
                    var _comment = context.Comments.SingleOrDefault(c => c.CommentId == commentId);
                    if (_comment != null)
                    {
                        _comment.IsActive = false;

                        context.Entry(_comment).CurrentValues.SetValues(_comment);
                        context.SaveChanges();
                        return _comment;
                    }
                    throw new Exception("Comment does not exist");
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}
