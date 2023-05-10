const Movie = require('../models/movies');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => {
      const userMovies = movies.filter((card) => req.user._id === card.owner.toString());
      return res.send(userMovies);
    })
    .catch(next);
};

module.exports.postMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(201).send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

module.exports.deleteMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.findOne({ movieId: req.params.movieId, owner: _id })
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