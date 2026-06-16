const router = require('express').Router();
const { protect } = require('../Middleware/Auth');
const { registerValidation, loginValidation } = require('../Middleware/Validator');
const { upload } = require('../Middleware/Multer');
const {
  registration,
  login,
  logout,
  get_user,
  update_Profile,
  Update_Password,
  Forgot_Password,
  reset_Password,
  delete_Account,
} = require('../Controllers/Auth_Controller');

router.post('/register', upload.single('ProfilePicture'), registerValidation, registration);
router.post('/login', loginValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, get_user);
router.put('/profile', protect, upload.single('ProfilePicture'), update_Profile);
router.put('/password', protect, Update_Password);
router.post('/forgot-password', Forgot_Password);
router.post('/reset-password/:resetToken', reset_Password);
router.delete('/account', protect, delete_Account);

module.exports = router;
