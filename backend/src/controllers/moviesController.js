const pool = require('../db')

// GET /api/movies — catalogue avec pagination
const getMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit

    // Total de films pour la pagination
    const countResult = await pool.query('SELECT COUNT(*) FROM movies')
    const total = parseInt(countResult.rows[0].count)

    // Films de la page courante
    const result = await pool.query(
      `SELECT m.*, 
        COALESCE(
          json_agg(g.name) FILTER (WHERE g.name IS NOT NULL), 
          '[]'
        ) as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       GROUP BY m.id
       ORDER BY m.popularity DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    )

    res.json({
      movies: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de la récupération des films' })
  }
}

// GET /api/movies/search?q=inception
const searchMovies = async (req, res) => {
  try {
    const { q } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const offset = (page - 1) * limit

    if (!q) {
      return res.status(400).json({ error: 'Paramètre de recherche manquant' })
    }

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM movies 
       WHERE title ILIKE $1 OR overview ILIKE $1`,
      [`%${q}%`]
    )
    const total = parseInt(countResult.rows[0].count)

    const result = await pool.query(
      `SELECT m.*,
        COALESCE(
          json_agg(g.name) FILTER (WHERE g.name IS NOT NULL),
          '[]'
        ) as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE m.title ILIKE $1 OR m.overview ILIKE $1
       GROUP BY m.id
       ORDER BY m.popularity DESC
       LIMIT $2 OFFSET $3`,
      [`%${q}%`, limit, offset]
    )

    res.json({
      movies: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de la recherche' })
  }
}

// GET /api/movies/:id — détail d'un film
const getMovieById = async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT m.*,
        COALESCE(
          json_agg(g.name) FILTER (WHERE g.name IS NOT NULL),
          '[]'
        ) as genres
       FROM movies m
       LEFT JOIN movie_genres mg ON m.id = mg.movie_id
       LEFT JOIN genres g ON mg.genre_id = g.id
       WHERE m.tmdb_id = $1
       GROUP BY m.id`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Film non trouvé' })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de la récupération du film' })
  }
}

module.exports = { getMovies, searchMovies, getMovieById }