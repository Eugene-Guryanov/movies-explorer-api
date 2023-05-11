const Movie = require('../models/movies');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.postMovies = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные фильма.'));
      } else {
        next(err);
      }
    });
};
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (req.user._id.toString() !== movie.owner.toString()) {
        return next(new ForbiddenError('Отсутствуют права на удаление фильма'));
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then(
          res.status(201).send(movie),
        );
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
