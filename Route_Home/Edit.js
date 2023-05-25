const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Token = require('../Token');
const upload = require('../Route_Home/Multer');
const fs = require('fs');

const basePath = 'localhost:5000';

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
      // Delete the previous image file if it exists
      if (user.public_url) {
        fs.unlinkSync(`Pic/${user.public_url}`);
      }

      // Move the uploaded image to the "Pic" folder
      const imagePath = `Pic/${req.file.filename}`;
      fs.renameSync(req.file.path, imagePath);

      updatedFields.public_url = imagePath;
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
