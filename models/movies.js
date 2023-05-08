const mongoose = require('mongoose');
const { isUrl } = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },

  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (url) => isUrl(url),
      message: 'Неверный формат url',
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (url) => isUrl(url),
        message: 'Неверный формат url',
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (url) => isUrl(url),
        message: 'Неверный формат url',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  }
}, { versionKey: false });
module.exports = mongoose.model('movie', movieSchema);