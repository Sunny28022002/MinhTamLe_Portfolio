using MovieServices.Models;

namespace MovieServices.Services.CommentServices
{
    public interface ICommentService
    {
        List<Comment> GetComments();
        Comment GetCommentById(int id);
        List<Comment> GetCommentByMovieId(int movieId);
        Comment CreateComment(Comment comment);
        Comment UpdateComment(Comment comment);
        Comment DeleteComment(int commentId);
    }
}
