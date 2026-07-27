import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'

function SearchBar({ onSearch, onReset }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  const handleReset = () => {
    setQuery('')
    onReset()
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-input"
        type="text"
        placeholder="Rechercher un film..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button className="search-btn" type="submit">
        <SearchIcon style={{ fontSize: 18, verticalAlign: 'middle' }} /> Rechercher
      </button>
      {query && (
        <button className="reset-btn" type="button" onClick={handleReset}>
          <CloseIcon style={{ fontSize: 18, verticalAlign: 'middle' }} />
        </button>
      )}
    </form>
  )
}

export default SearchBar