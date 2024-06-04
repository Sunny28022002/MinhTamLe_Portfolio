'use client'
import { API, Category_API, Movie_API, headerConfig } from '@/constant'
import { Movie } from '@/context/AuthContext'
import { Card, Pagination, Select, Spin } from '@douyinfe/semi-ui'
import axios from 'axios'
import Link from 'next/link'
import { type } from 'os'
import { useEffect, useState } from 'react'

export type Categories = {
  categoryId: number
  categoryName: string
}

const MoviePage = () => {
  const [movies, setMovies] = useState<Movie[]>([])
  const [spinner, setSpinner] = useState(true)
  const [categories, setCategories] = useState()
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 10
  let listCategory: any = [{ value: 1, labe: 'All' }]

  useEffect(() => {
    // Fetching movies
    handleGetAllMovies()

    //Fetching categories
    axios
      .get(`${Category_API}`, {
        headers: headerConfig,
      })
      .then(response => {
        console.log(response.data)
        listCategory = response.data.data.map(item => ({
          value: item.categoryId,
          label: item.categoryName,
        }))
        setCategories(listCategory)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })
  }, [])

  const totalMovies = movies.length
  const totalPages = Math.ceil(totalMovies / moviesPerPage)
  const lastMovieIndex = currentPage * moviesPerPage
  const firstMovieIndex = lastMovieIndex - moviesPerPage
  const currentMovies = movies.slice(firstMovieIndex, lastMovieIndex)

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
  }

  const handleFilterCategory = categoriesId => {
    console.log(categoriesId)
    setSpinner(true)
    axios
      .get(`${Movie_API}/category/${categoriesId}`, {
        headers: headerConfig,
      })
      .then(response => {
        console.log(response.data.data)
        setMovies(response.data.data)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })
  }

  const handleGetAllMovies = () => {
    setSpinner(true)
    axios
      .get(`${Movie_API}`, {
        headers: headerConfig,
      })
      .then(response => {
        console.log(response.data.data)
        setMovies(response.data.data)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })
  }

  // Render UI
  return (
    <>
      {/*  movie content */}
      <div className='grid grid-cols-5 gap-5 mb-6 mt-10 w-full h-full rounded'>
        <div className='col-span-5'>
          <div className='grid grid-cols-8 mb-6 text-primary text-2xl'>
            <h3 className='col-span-1 w-fit font-bold rounded text-gray-600'>
              All Movie
            </h3>
            <Select
              className='col-span-6'
              style={{ width: 320 }}
              optionList={categories}
              insetLabel='Category'
              onChange={handleFilterCategory}
            ></Select>
          </div>
          <hr className='col-span-5 border-2 rounded mb-8'></hr>
          <div className='grid sm:grid-cols-2 sm:justify-center md:grid-cols-3 lg:grid-cols-5 gap-6 mb-6 pb-4'>
            {spinner ? (
              <div className='grid col-span-5 justify-center gap-4'>
                <Spin size='middle' tip='Loading...'></Spin>
              </div>
            ) : (
              currentMovies.map((movie, index) => (
                <Link
                  href={`/movie/${movie?.movieId}`}
                  replace
                  className='hover:text-blue-600 text-gray-800 font-bold'
                >
                  <Card
                    style={{ maxWidth: 200 }}
                    cover={
                      <img
                        alt='example'
                        src={movie?.moviePoster}
                        className='h-48 object-cover'
                      />
                    }
                    className='hover:scale-110 transition ease-out duration-500 cursor-pointer'
                  >
                    <p className='truncate'>{movie?.movieName}</p>

                    <p className='mt-3 text-xs'>{movie?.aliasName}</p>
                  </Card>
                </Link>
              ))
            )}
          </div>
          <div className='flex justify-center'>
            <Pagination
              total={totalMovies}
              pageSize={moviesPerPage}
              onChange={handlePageChange}
              style={{ marginBottom: 12 }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default MoviePage
