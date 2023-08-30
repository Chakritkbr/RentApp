import express from 'express';
import {
  addPlaceController,
  editPlaceController,
  getManyPlaceContoller,
  getOurPlaceController,
  getSinglePlaceController,
  uploadByLinkController,
  uploadPhotoController,
} from '../controllers/placeControllers.js';
import multer from 'multer';

const router = express.Router();
const photoMiddleware = multer({ dest: 'uploads/' });

//upload-by-link:Post
router.post('/upload-by-link', uploadByLinkController);

//upload-photo:Post
router.post(
  '/upload',
  photoMiddleware.array('photos', 100),
  uploadPhotoController
);
//Add place
router.post('/places', addPlaceController);

//get place
router.get('/user-places', getOurPlaceController);

//get single place info
router.get('/places/:id', getSinglePlaceController);

//get many place in index
router.get('/places', getManyPlaceContoller);

//Edit place
router.put('/places', editPlaceController);

export default router;
