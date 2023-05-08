const Movies = require('../models/movies');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movies.find({ owner: _id })
    .then((movies) => {
      const userMovies = movies.filter((card) => req.user._id === card.owner.toString());
      return res.send(userMovies);
    })
    .catch(next);
};

module.exports.postMovies = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;

  const { _id } = req.user;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: _id,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovies = (req, res, next) => {
  const { _id } = req.user;
  Movies.findOne({ movieId: req.params.movieId, owner: _id })
    .orFail()
    .then((movie) => {
      if (req.user._id !== movie.owner._id.toString()) {
        return next(new ForbiddenError('Отсутствуют права на удаление фильма'));
      }

      return movie.remove()
        .then(() => res.send({
          message: 'Фильм удалён',
        }));
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Фильм с указанным id не найден'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id фильма'));
      } else {
        next(err);
      }
    });
};