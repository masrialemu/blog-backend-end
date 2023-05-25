const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const upload = require('../Route_Home/Multer');
const Token = require('../Token');
const fs = require('fs');

router.post('/:id', Token, upload.single('image'), async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id);

    // Check if the authenticated user is the owner of the post
    if (!user || user.email !== req.userId.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const post = new Post({
      email: req.body.email,
      place: req.body.place,
      title: req.body.title,
      desc: req.body.desc,
    });

    if (req.file) {
      // Move the uploaded image to a permanent location on the server
      const imagePath = `Pic/${req.file.filename}`;
      fs.renameSync(req.file.path, imagePath);

      post.public_url = `http://localhost:5000/${imagePath}`; // Assign the local server URL to the post
    }

    const savedPost = await post.save();

    return res.send(savedPost); // Send the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
