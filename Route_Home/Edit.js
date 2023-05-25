const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Token = require('../Token');
const upload = require('../Route_Home/Multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

router.put('/:id', Token, upload.single('image'), async (req, res) => {
  try {
    const { place, title, desc } = req.body;

    // Find the user by ID
    const user = await User.findById(req.params.id);

    // Check if the authenticated user is the owner of the post
    if (user.email !== req.userId.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update the post fields
    let updatedFields = { place, title, desc };

    if (req.file) {
      // Delete the previous image from Cloudinary if it exists
      if (user.public_url) {
        await cloudinary.uploader.destroy(user.public_url);
      }

      // Upload the new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      updatedFields.public_url = result.secure_url;
      
      // Remove the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }

    // Update the user's post
    const updatedPost = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    // Return the updated post
    res.json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
