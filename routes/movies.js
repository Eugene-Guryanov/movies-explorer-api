const router = require('express').Router();
const { deleteMovieValidation, postMovieValidation } = require('../middlewares/validation');
const {
  getMovies, postMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/movies', getMovies);
router.post('/movies', postMovieValidation, postMovies);
router.delete('/movies/_id', deleteMovieValidation, deleteMovies);

module.exports = router;
