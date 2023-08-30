import express from 'express';
import {
  bookingPlacController,
  getOurBookingController,
} from '../controllers/bookingControllers.js';

const router = express.Router();

//booking place
router.post('/bookings', bookingPlacController);

//get our booking
router.get('/bookings', getOurBookingController);

export default router;
