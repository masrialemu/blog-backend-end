const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const mongoose = require('mongoose');

// Connect to MongoDB using Mongoose
// mongoose.connect('mongodb://localhost:27017/imageapp', { useNewUrlParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;

// // Define a schema for storing image details in MongoDB
// const ImageSchema = new mongoose.Schema({
//   name: String,
//   url: String,
// });

// // Create a model for the image schema
// const Image = mongoose.model('Image', ImageSchema);

// Multer configuration for handling file uploads
const upload = multer({ dest: 'Pic' });

async function uploadImageToImgBB(imagePath) {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    formData.append('key', 'bb3c04e726776d171fb92035dfb747cf');

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
    });

    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error.message);
    throw error;
  }
}

// Route for handling image upload
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await uploadImageToImgBB(req.file.path);
    const imageName = req.file.originalname;

    // Save image name and URL to MongoDB
    

    // Delete the uploaded file after saving to MongoDB
  

    res.status(200).json({ message: 'Image uploaded and saved successfully',image:imageUrl ,imagename:imageName});
    fs.unlinkSync(req.file.path); 
} catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
