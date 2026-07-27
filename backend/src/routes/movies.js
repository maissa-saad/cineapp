const express = require('express')
const router = express.Router()
const { getMovies, searchMovies, getMovieById } = require('../controllers/moviesController')

router.get('/', getMovies)
router.get('/search', searchMovies)
router.get('/:id', getMovieById)

module.exports = router