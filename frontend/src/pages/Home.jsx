import { useState, useEffect } from 'react'
import { getMovies, searchMovies } from '../services/api'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'

function Home() {
  const [movies, setMovies] = useState([])
  const [pagination, setPagination] = useState({})
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMovies()
  }, [page, query])

  const fetchMovies = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = query
        ? await searchMovies(query, page)
        : await getMovies(page)
      setMovies(res.data.movies)
      setPagination(res.data.pagination)
    } catch (err) {
      setError('Erreur lors du chargement des films')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (q) => {
    setQuery(q)
    setPage(1)
  }

  const handleReset = () => {
    setQuery('')
    setPage(1)
  }

  return (
    <div className="home">
      <h1 className="home-title">🎬 CinéApp</h1>
      <SearchBar onSearch={handleSearch} onReset={handleReset} />

      {query && (
        <p className="search-info">
          {pagination.total} résultat(s) pour "{query}"
        </p>
      )}

      {loading && <div className="loading">Chargement...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && movies.length === 0 && (
        <div className="no-results">Aucun film trouvé</div>
      )}

      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
      />
    </div>
  )
}

export default Home