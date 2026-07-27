const pool = require('../db')

// GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorites ORDER BY added_at DESC'
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de la récupération des favoris' })
  }
}

// POST /api/favorites
const addFavorite = async (req, res) => {
  try {
    const { tmdb_id, title, poster_path, vote_average } = req.body

    if (!tmdb_id || !title) {
      return res.status(400).json({ error: 'tmdb_id et title sont requis' })
    }

    // Vérifie si déjà en favori
    const existing = await pool.query(
      'SELECT id FROM favorites WHERE tmdb_id = $1',
      [tmdb_id]
    )

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Film déjà dans les favoris' })
    }

    const result = await pool.query(
      `INSERT INTO favorites (tmdb_id, title, poster_path, vote_average)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tmdb_id, title, poster_path, vote_average]
    )

    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de l\'ajout aux favoris' })
  }
}

// DELETE /api/favorites/:tmdb_id
const removeFavorite = async (req, res) => {
  try {
    const { tmdb_id } = req.params

    const result = await pool.query(
      'DELETE FROM favorites WHERE tmdb_id = $1 RETURNING *',
      [tmdb_id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Favori non trouvé' })
    }

    res.json({ message: 'Favori supprimé', film: result.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite }