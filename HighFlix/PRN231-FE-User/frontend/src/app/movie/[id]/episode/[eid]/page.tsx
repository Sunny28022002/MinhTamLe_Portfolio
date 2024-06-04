'use client'
import { Episode_API, Movie_API, headerConfig } from '@/constant'
import axios from 'axios'
import { Button, Card, Spinner } from 'flowbite-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const EpisodePage = () => {
  const [episode, setEpisode] = useState(null)
  const [episodes, setEpisodes] = useState(null)
  const [movie, setMovie] = useState(null)
  const [spinner, setSpinner] = useState(true)
  // const currentUrl = typeof window == 'undefined' ? '' : window.location.href
  // const parts = currentUrl.split('/')
  let urlParams = useParams();
  let movieId = urlParams.id;
  let episodeId = urlParams.eid;

  useEffect(() => {
    axios
      .get(`${Movie_API}/id?id=${movieId}`, {
        headers: headerConfig,
      })
      .then(response => {
        console.log(movie)
        setMovie(response.data.data)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })

    axios
      .get(`${Episode_API}/id?id=${episodeId}`, {
        headers: headerConfig,
      })
      .then(response => {
        console.log(response.data.data.mediaLink)
        setEpisode(response.data.data)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })

    axios
      .get(`${Episode_API}/movie/movieId?movieId=${movieId}`, {
        headers: headerConfig,
      })
      .then(response => {
        setEpisodes(response.data.data)
        setSpinner(false)
      })
      .catch(error => {
        setSpinner(true)
        console.log('An error occurred:', error.response)
      })
  }, [])

  if (spinner)
    return (
      <div className='w-full h-[100vh] flex justify-center items-center'>
        <Spinner className='' aria-label='Spinner button example' />
      </div>
    )
  return (
    <div className='flex flex-col gap-4 my-4'>
      {episode == null || movie == null ? (
        <Spinner aria-label='Spinner button example' />
      ) : (
        <>
          <div className='text-center font-semibold text-2xl'>
            {movie.movieName}: {episode.episodeName}
          </div>
          <iframe
            width='854'
            height='480'
            className='!w-full'
            src={`${episode.mediaLink}`}
            title='YouTube video player'
            //frameborder='0'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
            //allowfullscreen='true'
          ></iframe>
        </>
      )}
      <div className='flex gap-4 items-center'>
        <p className='font-semibold'>Danh sách tập: </p>
        <div className='flex gap-4 flex-wrap'>
          {episodes == null ? (
            <Spinner aria-label='Spinner button example' />
          ) : (
            episodes?.map((item, idx) => (
              <Link href={`${item.episodeId}`}>
                <Button key={idx} color='failure'>
                  {idx + 1}
                </Button>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default EpisodePage
