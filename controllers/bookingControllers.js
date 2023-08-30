import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import imageDownloader from 'image-downloader';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Booking from '../models/Booking.js';
import Place from '../models/Place.js';
import User from '../models/User.js';

function getUserDataFromReq(req) {
  return new Promise((resolve, rejects) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
}

export const bookingPlacController = async (req, res) => {
  const userData = await getUserDataFromReq(req);
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } =
    req.body;
  Booking.create({
    place,
    checkIn,
    checkOut,
    numberOfGuests,
    name,
    phone,
    price,
    user: userData.id,
  })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      throw err;
    });
};

export const getOurBookingController = async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
};
