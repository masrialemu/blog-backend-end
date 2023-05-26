const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const upload = require('../Route_Home/Multer');
const Token = require('../Token');
const path = require('path');

router.use('/static', express.static(path.join(__dirname, '..', 'static')));

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
      post.public_url = `/static/Pic/${req.file.filename}`; // Assign the correct image URL to the post
    }

    const savedPost = await post.save();

    return res.send(savedPost); // Send the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
