const router = require('express').Router();
const { userInfoValidation } = require('../middlewares/validation');
const {
  updateUser, getMe,
} = require('../controllers/users');

router.get('/api/users/me', getMe);
router.patch('/api/users/me', userInfoValidation, updateUser);

module.exports = router;
