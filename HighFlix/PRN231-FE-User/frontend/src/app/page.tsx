'use client'
import { Card, Pagination } from '@douyinfe/semi-ui'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Movie_API, headerConfig } from '@/constant'
import { Movie } from '@/context/AuthContext'
import { Spin } from '@douyinfe/semi-ui'
import { IconClock } from '@douyinfe/semi-icons'
import MovieSwiper from '@/components/ActiveSlider/MovieSwiper'
import Link from 'next/link'

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [moviesNew, setMoviesNew] = useState<Movie[]>([])
  const [movieBanner, setMovieBanner] = useState<Movie>()
  const [spinner, setSpinner] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const moviesPerPage = 5

  useEffect(() => {
    //Fetch movie
    axios
      .get(`${Movie_API}/id?id=8`, {
        headers: headerConfig,
      })
      .then(response => {
        setMovieBanner(response.data.data)
        console.log(movieBanner)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })

    // Fetching movies
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

    // Fetching new movies
    axios
      .get(`${Movie_API}/new`, {
        headers: headerConfig,
      })
      .then(response => {
        setMoviesNew(response.data.data)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })
  }, [])

  const totalMovies = moviesNew.length
  const totalPages = Math.ceil(totalMovies / moviesPerPage)
  const lastMovieIndex = currentPage * moviesPerPage
  const firstMovieIndex = lastMovieIndex - moviesPerPage
  const currentMovies = moviesNew.slice(firstMovieIndex, lastMovieIndex)

  const handlePageChange = newPage => {
    setCurrentPage(newPage)
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-between bg-opacity-80'>
      <div className='relative w-[100%] mt-5 h-[31.25rem] bg-gray-300 rounded-[3.5rem]'>
        {spinner ? (
          <div className='flex mt-[20%] justify-center items-center gap-4'>
            <Spin aria-label='Spinner button example' />
          </div>
        ) : (
          <img
            src={movieBanner?.movieThumnailImage}
            className='w-full h-full object-fill rounded-[3.5rem] bg-gray-900/50'
          />
        )}
        <div className='absolute inset-0 bg-gradient-to-tr from-gray-900 to-gray rounded-[3.5rem]'></div>
        <div className='flex justify-between items-center bg-gray-900/75 rounded-[1.25rem] absolute top-12 left-16 text-white'>
          {spinner ? (
            <div className='flex justify-center items-center gap-4'>
              <Spin aria-label='Spinner button example' />
            </div>
          ) : (
            <span className='px-2'>
              {movieBanner?.totalEpisodes}XP / episode
            </span>
          )}
        </div>
        <div className='flex flex-col justify-between absolute bottom-16 left-16 text-white'>
          <div className='rounded-2xl px-2 font-bold flex-1 mb-6 text-5xl'>
            {spinner ? (
              <div className='flex justify-center items-center gap-4'>
                <Spin aria-label='Spinner button example' />
              </div>
            ) : (
              <span>{movieBanner?.movieName}</span>
            )}
          </div>
          <div className='rounded-2xl px-2 py-1 flex-1 mb-6'>
            {spinner ? (
              <div className='flex justify-center items-center gap-4'>
                <Spin aria-label='Spinner button example' />
              </div>
            ) : (
              <>
                <span>
                  {movieBanner?.aliasName} -{' '}
                  {movieBanner?.categories.map((cate, index) => cate)}
                </span>
                <div>
                  <IconClock />
                  <span className='ml-3'>
                    {movieBanner?.totalEpisodes} episode
                  </span>
                </div>
              </>
            )}
          </div>
          <div className='bg-orange-500 text-center w-fit px-7 py-3 rounded-2xl hover:scale-125 transition ease-out duration-500'>
            <Link href={'/movie/8'} replace>
              Watch
            </Link>
          </div>
        </div>
      </div>

      {/*  episode content */}
      <div className=' mb-6 mt-10 w-full h-full rounded'>
        <div className='grid grid-cols-6 mb-6 text-primary text-2xl'>
          <h3 className='col-span-1 w-fit font-bold rounded text-gray-600'>
            Lastest Episode
          </h3>
          <hr className='col-span-5 ml-2 border-2 rounded mt-4'></hr>
        </div>
        {spinner ? (
          <div className='grid col-span-5 justify-center gap-4'>
            <Spin size='middle' tip='Loading...'></Spin>
          </div>
        ) : (
          <MovieSwiper movies={movies} />
        )}
      </div>

      {/*  movie content */}
      <div className='grid grid-cols-5 gap-5 mb-6 mt-10 w-full h-full rounded'>
        <div className='col-span-5'>
          <div className='grid grid-cols-8 mb-6 text-primary text-2xl'>
            <h3 className='col-span-1 w-fit font-bold rounded text-gray-600'>
              New Movie
            </h3>
            <hr className='col-span-7 border-2 rounded mt-4'></hr>
          </div>
          <div className='grid sm:grid-cols-2 sm:justify-center md:grid-cols-3 lg:grid-cols-5 gap-x-10 mb-6 pb-4'>
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
                    className='hover:scale-125 transition ease-out duration-500 cursor-pointer'
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
    </main>
  )
}
