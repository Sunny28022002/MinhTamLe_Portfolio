import { createContext, useContext } from 'react'

export const AuthContext = createContext({
  user: undefined,
  isLoading: false,
  setUser: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

//type movie
export type Movie = {
  movieId: number
  postedByUser: number
  movieName: string
  categories: string[]
  movieThumnailImage: string
  moviePoster: string
  listEpisode: string
  totalEpisodes: number
  description: string
  releasedYear: string
  aliasName: string
  director: string
  mainCharacters: string
  trailer?: string
  comments?: string
  isActive: boolean
}
