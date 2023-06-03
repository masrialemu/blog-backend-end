const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const multer = require('multer');
const Token = require('../Token');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

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

router.post('/:id', Token, upload.single('image'), async (req, res) => {
  try {
    const userId = req.userId;
    const user = await Auth.findById(req.params.id);

    if (!user || user.email !== userId.email) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { email, place, title, desc } = req.body;

    const post = new Post({
      email,
      place,
      title,
      desc,
    });

    if (req.file) {
      const imageUrl = await uploadImageToImgBB(req.file.path);
      const imageName = req.file.originalname;
      post.public_url = imageUrl;
      post.public_name = imageName;

      fs.unlinkSync(req.file.path);
    }

    const savedPost = await post.save();

    return res.send(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
