const router = require('express').Router();
const {
  updateUser, getMe,
} = require('../controllers/user');

const {
   userInfoValidation,
} = require('../middlewares/validation');

router.get('/users/me', getMe);
router.patch('/users/me', userInfoValidation, updateUser);

module.exports = router;