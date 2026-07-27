const pool = require('./db')
require('dotenv').config()

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

// Importe les genres depuis TMDB
async function importGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=fr-FR`)
  const data = await res.json()

  for (const genre of data.genres) {
    await pool.query(
      `INSERT INTO genres (tmdb_id, name)
       VALUES ($1, $2)
       ON CONFLICT (tmdb_id) DO NOTHING`,
      [genre.id, genre.name]
    )
  }
  console.log(`✅ ${data.genres.length} genres importés`)
}

// Importe les films populaires depuis TMDB
async function importMovies(totalPages = 10) {
  let count = 0

  for (let page = 1; page <= totalPages; page++) {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    )
    const data = await res.json()

    for (const movie of data.results) {
      // Insère le film
      const result = await pool.query(
        `INSERT INTO movies 
          (tmdb_id, title, overview, poster_path, backdrop_path, release_date, vote_average, vote_count, popularity, original_language)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT (tmdb_id) DO NOTHING
         RETURNING id`,
        [
          movie.id,
          movie.title,
          movie.overview,
          movie.poster_path,
          movie.backdrop_path,
          movie.release_date || null,
          movie.vote_average,
          movie.vote_count,
          movie.popularity,
          movie.original_language
        ]
      )

      // Insère les genres du film
      if (result.rows.length > 0) {
        const movieId = result.rows[0].id
        for (const genreId of movie.genre_ids) {
          const genre = await pool.query(
            'SELECT id FROM genres WHERE tmdb_id = $1',
            [genreId]
          )
          if (genre.rows.length > 0) {
            await pool.query(
              `INSERT INTO movie_genres (movie_id, genre_id)
               VALUES ($1, $2)
               ON CONFLICT DO NOTHING`,
              [movieId, genre.rows[0].id]
            )
          }
        }
        count++
      }
    }
    console.log(` Page ${page}/${totalPages} importée`)
  }
  console.log(` ${count} films importés`)
}

// Lance l'import
async function main() {
  try {
    console.log('Début de l\'import...')
    await importGenres()
    await importMovies(10)
    console.log('Import terminé !')
  } catch (err) {
    console.error('Erreur:', err)
    process.exit(1)
  } finally {
    pool.end().catch(err => console.error('Erreur fermeture pool:', err))
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))