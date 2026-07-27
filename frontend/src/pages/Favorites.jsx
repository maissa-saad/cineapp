import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import StarIcon from '@mui/icons-material/Star'
import { getFavorites, removeFavorite, getImageUrl } from '../services/api'

function Favorites() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getFavorites()
      .then(res => setFavorites(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (tmdbId, e) => {
    e.stopPropagation()
    await removeFavorite(tmdbId)
    setFavorites(prev => prev.filter(f => f.tmdb_id !== tmdbId))
  }

  if (loading) return <div className="loading">Chargement...</div>

  return (
    <div>
      <h1 className="favorites-title">
        <FavoriteIcon style={{ verticalAlign: 'middle', marginRight: 8, color: 'red' }} />
        Mes Favoris
      </h1>
      {favorites.length === 0 ? (
        <div className="no-results">
          <p>Aucun favori pour le moment.</p>
          <button className="search-btn" style={{ marginTop: 10 }} onClick={() => navigate('/')}>
            Découvrir des films
          </button>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map(movie => (
            <div key={movie.id} className="movie-card" onClick={() => navigate(`/movies/${movie.tmdb_id}`)}>
              <div className="movie-poster">
                <img src={getImageUrl(movie.poster_path)} alt={movie.title} />
                <button className="favorite-btn" onClick={e => handleRemove(movie.tmdb_id, e)}>
                  <FavoriteIcon style={{ fontSize: 18, color: 'red' }} />
                </button>
              </div>
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <span className="movie-meta">
                  <StarIcon style={{ fontSize: 14, verticalAlign: 'middle', color: '#f5a623' }} />
                  {' '}{Number(movie.vote_average).toFixed(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites