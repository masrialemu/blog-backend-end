const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const Token = require('../Token');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

router.delete('/:id', Token, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user.email === req.userId.email || req.userId.isAdmin) {
      // Delete the user's post from Cloudinary if it exists
      if (user.public_url) {
        await cloudinary.uploader.destroy(user.public_url);
      }

      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ user, message: 'User is deleted' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
