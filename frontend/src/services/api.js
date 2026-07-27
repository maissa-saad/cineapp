import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const api = axios.create({
  baseURL: API_BASE_URL,
})

export const getImageUrl = (path) => {
  if (!path) return '/no-image.png'
  return `${TMDB_IMAGE_BASE}${path}`
}

export const getMovies = (page = 1, limit = 20) =>
  api.get(`/movies?page=${page}&limit=${limit}`)

export const searchMovies = (query, page = 1) =>
  api.get(`/movies/search?q=${query}&page=${page}`)

export const getMovieById = (id) =>
  api.get(`/movies/${id}`)

export const getFavorites = () =>
  api.get('/favorites')

export const addFavorite = (movie) =>
  api.post('/favorites', movie)

export const removeFavorite = (tmdbId) =>
  api.delete(`/favorites/${tmdbId}`)