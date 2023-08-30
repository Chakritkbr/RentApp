import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import User from './models/User.js';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import imageDownloader from 'image-downloader';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';
import Place from './models/Place.js';
import Booking from './models/Booking.js';
import authRoutes from './routes/authRoutes.js';
import placeRoutes from './routes/placeRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

dotenv.config({ path: './.env' });
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

//routes

// routes
app.use('', authRoutes);
app.use('', placeRoutes);
app.use('', placeRoutes);
app.use('', bookingRoutes);

// app.post('/register', async (req, res) => {
//   const { name, email, password } = req.body;
//   try {
//     const userDoc = await User.create({
//       name,
//       email,
//       password: bcrypt.hashSync(password, bcryptSalt),
//     });
//     res.json(userDoc);
//   } catch (err) {
//     res.status(422).json(err);
//   }
// });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   const userDoc = await User.findOne({ email });
//   if (userDoc) {
//     const passOk = bcrypt.compareSync(password, userDoc.password);
//     if (passOk) {
//       jwt.sign(
//         { email: userDoc.email, id: userDoc._id },
//         process.env.JWT_SECRET,
//         {},
//         (err, token) => {
//           if (err) throw err;
//           res.cookie('token', token).json(userDoc);
//         }
//       );
//     } else {
//       res.status(422).json('password not Ok');
//     }
//   } else {
//     res.json('not found');
//   }
// });

// app.get('/profile', async (req, res) => {
//   const { token } = req.cookies;
//   if (token) {
//     jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
//       if (err) throw err;
//       const { name, email, _id } = await User.findById(userData.id);
//       res.json({ name, email, _id });
//     });
//   } else {
//     res.json(null);
//   }
// });

// app.post('/logout', (req, res) => {
//   res.cookie('token', '').json(true);
// });

// app.post('/upload-by-link', async (req, res) => {
//   try {
//     const { link } = req.body;
//     const newName = 'photo' + Date.now() + '.jpg';
//     await imageDownloader.image({
//       url: link,
//       dest: __dirname + '/uploads/' + newName,
//     });
//     res.json(newName);
//   } catch (error) {
//     console.log(error);
//   }
// });

// const photoMiddleware = multer({ dest: 'uploads/' });

// app.post('/upload', photoMiddleware.array('photos', 100), (req, res) => {
//   const uploadedFiles = [];
//   for (let i = 0; i < req.files.length; i++) {
//     const { path, originalname } = req.files[i]; //path for specific file
//     const parts = originalname.split('.'); //split .whatever(jpeg webp) from the original filename
//     const ext = parts[parts.length - 1]; //selecte after . part
//     let newPath = path + '.' + ext;
//     fs.renameSync(path, newPath); //rename file from path with.somthing to newpath wiht path.ext
//     newPath = newPath.replace(`uploads`, ''); //cut out upload cos double upload is not valid endpoint
//     uploadedFiles.push(newPath); //array that carry uploadded files
//     console.log(newPath);
//     console.log(uploadedFiles);
//   }
//   res.json(uploadedFiles);
// });

// app.post('/places', (req, res) => {
//   const { token } = req.cookies;
//   const {
//     title,
//     address,
//     addedPhotos,
//     description,
//     price,
//     perks,
//     extraInfo,
//     checkIn,
//     checkOut,
//     maxGuests,
//   } = req.body;
//   jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
//     if (err) throw err;
//     const placeDoc = await Place.create({
//       owner: userData.id,
//       title,
//       address,
//       photos: addedPhotos,
//       description,
//       perks,
//       extraInfo,
//       checkIn,
//       checkOut,
//       maxGuests,
//       price,
//     });
//     res.json(placeDoc);
//   });
// });

// app.get('/user-places', (req, res) => {
//   const { token } = req.cookies;
//   jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
//     const { id } = userData;
//     res.json(await Place.find({ owner: id }));
//   });
// });

// app.get('/places/:id', async (req, res) => {
//   const { id } = req.params;
//   res.json(await Place.findById(id));
// });

// app.put('/places', async (req, res) => {
//   const { token } = req.cookies;
//   const {
//     id,
//     title,
//     address,
//     addedPhotos,
//     description,
//     perks,
//     extraInfo,
//     checkIn,
//     checkOut,
//     maxGuests,
//     price,
//   } = req.body;

//   jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
//     if (err) throw err;

//     const placeDoc = await Place.findById(id);
//     // console.log(userData.id);
//     // console.log(placeDoc.owner.toString()); //id is in object
//     if (userData.id === placeDoc.owner.toString()) {
//       placeDoc.set({
//         title,
//         address,
//         photos: addedPhotos,
//         description,
//         perks,
//         extraInfo,
//         checkIn,
//         checkOut,
//         maxGuests,
//         price,
//       });
//       await placeDoc.save();
//       res.json('ok');
//     }
//   });
// });

// app.get('/places', async (req, res) => {
//   res.json(await Place.find());
// });

app.post('/bookings', async (req, res) => {
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
});

app.get('/bookings', async (req, res) => {
  const userData = await getUserDataFromReq(req);
  res.json(await Booking.find({ user: userData.id }).populate('place'));
});

//port connection
const PORT = process.env.PORT || 6001;
await mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  })
  .catch((error) => console.log(`${error} did not connect`));
