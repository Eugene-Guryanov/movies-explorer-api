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
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(201).send(movies))
    .catch((err) => next(err));
};

module.exports.deleteMovies = (req, res, next) => {
  Movie.findById(req.params._id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным id не найден.');
      }
      if (req.user._id.toString() !== movie.owner.toString()) {
        throw new ForbiddenError('Отсутствуют права на удаление фильма');
      }
      return Movie.findByIdAndRemove(req.params._id)
        .then(() => res.status(200).send(movie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный id фильма'));
      }
      return next(err);
    });
};
