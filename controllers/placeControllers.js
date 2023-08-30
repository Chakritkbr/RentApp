import jwt from 'jsonwebtoken';
import imageDownloader from 'image-downloader';
import fs from 'fs';
import Place from '../models/Place.js';
import { __dirname } from '../index.js';

export const uploadByLinkController = async (req, res) => {
  try {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
      url: link,
      dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
  } catch (error) {
    console.log(error);
  }
};

export const uploadPhotoController = (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i]; //path for specific file
    const parts = originalname.split('.'); //split .whatever(jpeg webp) from the original filename
    const ext = parts[parts.length - 1]; //selecte after . part
    let newPath = path + '.' + ext;
    fs.renameSync(path, newPath); //rename file from path with.somthing to newpath wiht path.ext
    newPath = newPath.replace(`uploads`, ''); //cut out upload cos double upload is not valid endpoint
    uploadedFiles.push(newPath); //array that carry uploadded files
    console.log(newPath);
    console.log(uploadedFiles);
  }
  res.json(uploadedFiles);
};

export const addPlaceController = (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    price,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
};

export const getOurPlaceController = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
};

export const getSinglePlaceController = async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
};

export const editPlaceController = async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;

    const placeDoc = await Place.findById(id);
    // console.log(userData.id);
    // console.log(placeDoc.owner.toString()); //id is in object
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json('ok');
    }
  });
};

export const getManyPlaceContoller = async (req, res) => {
  res.json(await Place.find());
};
