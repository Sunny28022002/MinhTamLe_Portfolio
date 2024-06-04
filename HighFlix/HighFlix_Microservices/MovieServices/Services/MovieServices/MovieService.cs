using AutoMapper;
using MovieServices.DAOs;
using MovieServices.DTOs.MovieDTOs.ResponseDTO;
using MovieServices.Models;
using System;
using System.Collections.Generic;

namespace MovieServices.Services.MovieServices
{
    public class MovieService : IMovieService
    {
        public Movie GetMovieById(int id) => MovieDAO.GetMovieById(id);

        public List<Movie> GetMovieList() => MovieDAO.GetMovieList();

        public List<Movie> GetMovieListNew() => MovieDAO.GetMovieListNew();

        public List<Movie> GetMovieListByCategory(int categoryId) => MovieDAO.GetListMovieByCategory(categoryId);

        public Movie CreateMovie(Movie movie, List<int> cates) => MovieDAO.CreateMovie(movie, cates);

        public Movie UpdateMovie(Movie movie, List<int> cates) => MovieDAO.UpdateMovie(movie, cates);

        public Movie DeleteMovie(int id) => MovieDAO.DeleteMovie(id);

        public List<Movie> SearchMovies(string searchMovieName) => MovieDAO.SearchMovies(searchMovieName);

        public List<Movie> GetMoviesByCategoryId(int categoryId) => MovieDAO.GetMoviesByCategoryId(categoryId);
    }
}
