import { Card } from '@douyinfe/semi-ui'
import React, { useEffect, useState } from 'react'
import { Movie } from '@/context/AuthContext'

const MovieEpisodeList = movie => {
  const [movieEpisodes, setMovieEpisodes] = useState<Movie>()

  useEffect(() => {
    setMovieEpisodes(movie.movie)
    console.log(movieEpisodes)
  })
  const { Meta } = Card
  return (
    <Card
      style={{ maxWidth: 300 }}
      cover={
        <img
          alt='example'
          src='https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo2.jpeg'
        />
      }
    >
      <Meta title='Title' />
    </Card>
  )
}

export default MovieEpisodeList
