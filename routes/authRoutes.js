import express from 'express';
import {
  getProfileController,
  loginController,
  logoutController,
  registerController,
} from '../controllers/authControllers.js';

const router = express.Router();

//register:Post
router.post('/register', registerController);

//login:Post
router.post('/login', loginController);

//get profile
router.get('/profile', getProfileController);

//logout
router.post('/logout', logoutController);

export default router;
