-- Création de la base
CREATE TABLE IF NOT EXISTS genres (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS movies (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  overview TEXT,
  poster_path VARCHAR(255),
  backdrop_path VARCHAR(255),
  release_date DATE,
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  popularity DECIMAL(10,3),
  original_language VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movie_genres (
  movie_id INTEGER REFERENCES movies(id) ON DELETE CASCADE,
  genre_id INTEGER REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  tmdb_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  poster_path VARCHAR(255),
  vote_average DECIMAL(3,1),
  added_at TIMESTAMP DEFAULT NOW()
);