const router = require('express').Router();
const { userInfoValidation } = require('../middlewares/validation');
const {
  updateUser, getMe,
} = require('../controllers/users');

router.get('/users/me', getMe);
router.patch('/users/me', userInfoValidation, updateUser);

module.exports = router;
