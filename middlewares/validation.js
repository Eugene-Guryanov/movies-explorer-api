const { celebrate, Joi } = require('celebrate');

// eslint-disable-next-line no-useless-escape
module.exports.urlRegExp = /(http:\/\/|https:\/\/)(www)*[a-z0-9\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+\.(ru|com)(:\d{2,5})?((\/.+)+)?\/?#?/;

module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.postMovieValidation = celebrate({
    body: Joi.object().keys({
        country: Joi.string().required(),
        director: Joi.string().required(),
        duration: Joi.number().required(),
        year: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required().pattern(this.urlRegExp),
        trailerLink: Joi.string().required().pattern(this.urlRegExp),
        thumbnail: Joi.string().required().pattern(this.urlRegExp),
        nameRU: Joi.string().required(),
        nameEN: Joi.string().required(),
        movieId: Joi.number().required(),
  }),
});

module.exports.userInfoValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.deleteMovieValidation = celebrate({
    params: Joi.object().keys({
        movieId: Joi.number().required(),
  }),
});

module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});
