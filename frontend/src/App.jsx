import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import MovieIcon from '@mui/icons-material/Movie'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Home from './pages/Home'
import MovieDetail from './pages/MovieDetail'
import Favorites from './pages/Favorites'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="nav-logo">
          <MovieIcon style={{ verticalAlign: 'middle', marginRight: 6 }} />
          CinéApp
        </Link>
        <div className="nav-links">
          <Link to="/">Catalogue</Link>
          <Link to="/favorites">
            <FavoriteIcon style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4, color: 'red' }} />
            Favoris
          </Link>
        </div>
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App