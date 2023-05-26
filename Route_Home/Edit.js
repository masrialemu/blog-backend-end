const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const Token = require('../Token');
const upload = require('../Route_Home/Multer');
const fs = require('fs');
const path = require('path');

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
      if (post.public_url) {
        // Extract the file name from the public_url
        const fileName = path.basename(post.public_url);
        
        // Delete the previous image file if it exists
        fs.unlinkSync(`Pic/${fileName}`);
      }
      
      const public_url = req.file.path;
      updatedFields.public_url = `http://localhost:5000/${public_url}`;
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
