const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const Token = require('../Token');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const upload = multer({ dest: 'Pic' });

const uploadImageToImgBB = async (imagePath) => {
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
};

router.put('/:id', Token, upload.single('image'), async (req, res) => {
  try {
    const { place, title, desc } = req.body;

    // Find the post by ID
    const post = await Post.findById(req.params.id);

    // Check if the authenticated user is the owner of the post
    if (post.email !== req.userId.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update the post fields
    let updatedFields = { place, title, desc };

    if (req.file) {
      // Delete the previous image if it exists
      // if (post.public_url) {
      //   fs.unlinkSync(post.public_url);
      // }

      // Upload the new image to ImgBB
      const imgUrl = await uploadImageToImgBB(req.file.path);
      updatedFields.public_url = imgUrl;

      // Delete the local file after uploading
      fs.unlinkSync(req.file.path);
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    // Return the updated post
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
