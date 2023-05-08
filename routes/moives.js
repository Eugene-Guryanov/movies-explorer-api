const router = require('express').Router();
const {
  getMovies, postMovies, deleteMovies
} = require('../controllers/movies');

const {
   userInfoValidation,
} = require('../middlewares/validation');

router.get('/movies',  getMovies);
router.post('/movies', userInfoValidation, postMovies);
router.delete('/movies/_id', deleteMovies);

module.exports = router;