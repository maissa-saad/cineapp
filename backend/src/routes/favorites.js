const express = require('express')
const router = express.Router()
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoritesController')

router.get('/', getFavorites)
router.post('/', addFavorite)
router.delete('/:tmdb_id', removeFavorite)

module.exports = router