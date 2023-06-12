const router = require('express').Router();
const { deleteMovieValidation, postMovieValidation } = require('../middlewares/validation');
const {
  getMovies, postMovies,
  deleteMovies,
} = require('../controllers/movies');

router.get('/api/movies', getMovies);
router.post('/api/movies', postMovieValidation, postMovies);
router.delete('/api/movies/:_id', deleteMovieValidation, deleteMovies);

module.exports = router;
