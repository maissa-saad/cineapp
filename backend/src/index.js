const express = require('express')
const cors = require('cors')
require('dotenv').config()

const moviesRouter = require('./routes/movies')
const favoritesRouter = require('./routes/favorites')

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/movies', moviesRouter)
app.use('/api/favorites', favoritesRouter)

// Route de santé (utile pour Docker)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '✅ API opérationnelle' })
})

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Erreur serveur interne' })
})

app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`)
})