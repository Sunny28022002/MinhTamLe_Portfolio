import React, { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Link from 'next/link'
import axios from 'axios'
import { Episode_API, headerConfig } from '@/constant'
import { useRouter } from 'next/navigation'

const MovieSwiper = ({ movies }) => {
  const router = useRouter()
  const swiperOptions = {
    slidesPerView: 4,
    spaceBetween: 15,
    freeMode: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  }
  const swiperRef = useRef(null)

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext()
    }
  }

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev()
    }
  }

  const handleRouterPageEpisode = movieId => {
    // Fetching new movies
    axios
      .get(`${Episode_API}/latestByMovie/${movieId}`, {
        headers: headerConfig,
      })
      .then(response => {
        console.log(response)
        router.push(
          `/movie/${response.data.data.movieId}/episode/${response.data.data.episodeId}`,
        )
      })
      .catch(error => {
        console.log('An error occurred:', error.response)
      })
  }

  return (
    <div className='h-[300px] w-full mx-auto'>
      <Swiper
        {...swiperOptions}
        onSwiper={swiper => (swiperRef.current = swiper)}
      >
        {movies.map(movie => (
          <SwiperSlide key={movie.movieId}>
            <div className='group relative shadow-lg text-white rounded-xl p-6 w-full h-[300px] overflow-hidden cursor-pointer'>
              <a
                type='button'
                //href={`/movie/${movie.movieId}/episode/${movie.totalEpisodes}`}
                onClick={() => handleRouterPageEpisode(movie.movieId)}
                className='hover:text-blue-600 text-white font-bold'
              >
                <div
                  className='absolute inset-0 bg-cover bg-center'
                  style={{ backgroundImage: `url(${movie.moviePoster})` }}
                />
                <div className='absolute inset-0 group-hover:opacity-30' />
                <div className='absolute bottom-0 left-0 p-4'>
                  <h1 className='text-xl font-bold'>{movie.movieName}</h1>
                  <p className='text-lg'>{movie.aliasName}</p>
                </div>
                <div className='absolute top-0 right-0 p-4'>
                  <div className='w-[35px] h-[35px] text-white group-hover:text-blue-500 group-hover:rotate-45 duration-100'>
                    &rarr;
                  </div>
                </div>
                <div className='absolute top-1 left-1 p-2 text-lg font-bold bg-black opacity-60 text-white rounded-full'>
                  Lastest Ep
                </div>
              </a>
            </div>
          </SwiperSlide>
        ))}
        <div className='swiper-button-prev' onClick={handlePrev}></div>
        <div className='swiper-button-next' onClick={handleNext}></div>
      </Swiper>
    </div>
  )
}

export default MovieSwiper
