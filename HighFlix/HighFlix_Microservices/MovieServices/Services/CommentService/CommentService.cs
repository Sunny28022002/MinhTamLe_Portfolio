using MovieServices.DAOs;
using MovieServices.Models;

namespace MovieServices.Services.CommentServices
{
    public class CommentService : ICommentService
    {
        public List<Comment> GetComments() => CommentDAO.GetComments();
        public Comment GetCommentById(int id) => CommentDAO.GetCommentById(id);
        public List<Comment> GetCommentByMovieId(int movieId) => CommentDAO.GetCommentByMovieId(movieId);
        public Comment CreateComment(Comment comment) => CommentDAO.CreateComment(comment);
        public Comment UpdateComment(Comment comment) => CommentDAO.UpdateComment(comment);

        public Comment DeleteComment(int commentId) => CommentDAO.DeleteComment(commentId);
    }
}
