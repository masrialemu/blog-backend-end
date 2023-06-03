const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, admin } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = new User({
      name,
      email,
      password: hashedPassword,
      admin
    });

    if (req.file) {
      const imageUrl = await uploadImageToImgBB(req.file.path);
      const imageName = req.file.originalname;
      user.public_url = imageUrl; 
      user.public_name = imageName;
      fs.unlinkSync(req.file.path);
    }

    await user.save();

    const token = jwt.sign(
      { email: user.email, userId: user._id, isAdmin: admin, name: user.name },
      '@Masri404',
      { expiresIn: '1h' }
    );

    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
