import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StarIcon from '@mui/icons-material/Star'
import { getImageUrl, addFavorite, removeFavorite, getFavorites } from '../services/api'

function MovieCard({ movie }) {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getFavorites().then(res => {
      setIsFavorite(res.data.some(f => f.tmdb_id === movie.tmdb_id))
    })
  }, [movie.tmdb_id])

  const toggleFavorite = async (e) => {
    e.stopPropagation()
    setLoading(true)
    try {
      if (isFavorite) {
        await removeFavorite(movie.tmdb_id)
        setIsFavorite(false)
      } else {
        await addFavorite({
          tmdb_id: movie.tmdb_id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        })
        setIsFavorite(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="movie-card" onClick={() => navigate(`/movies/${movie.tmdb_id}`)}>
      <div className="movie-poster">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          onError={e => { e.target.src = '/no-image.png' }}
        />
        <button className="favorite-btn" onClick={toggleFavorite} disabled={loading}>
          {isFavorite
            ? <FavoriteIcon style={{ fontSize: 18, color: 'red' }} />
            : <FavoriteBorderIcon style={{ fontSize: 18, color: '#333' }} />
          }
        </button>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <StarIcon style={{ fontSize: 14, color: '#f5a623' }} />
            {Number(movie.vote_average).toFixed(1)}
          </span>
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
        </div>
      </div>
    </div>
  )
}

export default MovieCard