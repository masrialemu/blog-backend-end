const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const upload = require('../Route_Home/Multer');
const Token = require('../Token');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

router.post('/:id', Token, upload.single('image'), async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id)

    // Check if the authenticated user is the owner of the post
    if (!user || user.email !== req.userId.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    };

    const post = new Post({
      email: req.body.email,
      place: req.body.place,
      title: req.body.title,
      desc: req.body.desc,
    });

    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      post.public_url = result.secure_url; // Assign the Cloudinary URL to the post
    }

    const savedPost = await post.save();
    fs.unlinkSync(req.file.path);
    return res.send(savedPost); // Send the response
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
