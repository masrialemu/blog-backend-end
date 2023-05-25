const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Delete user
router.delete('/:id', Token, async (req, res) => {
  try {
    if (req.userId.isAdmin || req.userId.userId === req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete the uploaded file from Cloudinary
      if (user.public_url) {
        const publicId = user.cloudinary_id;
        await cloudinary.uploader.destroy(publicId);
      }

      // Delete the local file
      if (user.public_url) {
        fs.unlinkSync(user.public_url);
      }

      // Delete the user from the database
      await User.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: 'User and associated files are deleted' });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
