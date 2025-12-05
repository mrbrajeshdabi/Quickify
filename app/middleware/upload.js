import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary' ;
import cloudinary from './config.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "quickify_profiles",       // 🔥 Cloud folder name
    allowed_formats: ["jpg", "png", "jpeg"],
    // transformation: [{ width: 300, height: 300, crop: "fill" }] // optional
  },
});

export const upload = multer({ storage });

