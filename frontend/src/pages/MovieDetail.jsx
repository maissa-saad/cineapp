import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import StarIcon from '@mui/icons-material/Star'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LanguageIcon from '@mui/icons-material/Language'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { getMovieById, getImageUrl, addFavorite, removeFavorite, getFavorites } from '../services/api'

function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [movie, setMovie] = useState(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, favsRes] = await Promise.all([
          getMovieById(id),
          getFavorites()
        ])
        setMovie(movieRes.data)
        setIsFavorite(favsRes.data.some(f => f.tmdb_id === movieRes.data.tmdb_id))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const toggleFavorite = async () => {
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
    }
  }

  if (loading) return <div className="loading">Chargement...</div>
  if (!movie) return <div className="error">Film non trouvé</div>

  return (
    <div className="movie-detail">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowBackIcon style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }} />
        Retour
      </button>
      <div className="detail-content">
        <img className="detail-poster" src={getImageUrl(movie.poster_path)} alt={movie.title} />
        <div className="detail-info">
          <h1>{movie.title}</h1>
          <div className="detail-meta">
            <span>
              <StarIcon style={{ fontSize: 16, verticalAlign: 'middle', color: '#f5a623' }} />
              {' '}{Number(movie.vote_average).toFixed(1)}/10
            </span>
            <span>
              <HowToVoteIcon style={{ fontSize: 16, verticalAlign: 'middle', color: '#888' }} />
              {' '}{movie.vote_count} votes
            </span>
            <span>
              <CalendarTodayIcon style={{ fontSize: 16, verticalAlign: 'middle', color: '#888' }} />
              {' '}{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            <span>
              <LanguageIcon style={{ fontSize: 16, verticalAlign: 'middle', color: '#888' }} />
              {' '}{movie.original_language?.toUpperCase()}
            </span>
          </div>
          <div className="detail-genres">
            {movie.genres?.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
          <p className="detail-overview">{movie.overview || 'Aucun synopsis disponible.'}</p>
          <button className={`favorite-btn-large ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
            {isFavorite
              ? <><FavoriteIcon style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }} />Retirer des favoris</>
              : <><FavoriteBorderIcon style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }} />Ajouter aux favoris</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default MovieDetail