const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const upload = require('../Route_Home/Multer');

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

// Signup route
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, email, password, admin } = req.body;
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(409).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      admin
    });
    
    if (req.file) {
      // If an image is uploaded
      const result = await cloudinary.uploader.upload(req.file.path);
      user.public_url = result.secure_url;
      
      // Remove the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);
    }
    
    await user.save();

    const token = jwt.sign({ email: user.email, userId: user._id, isAdmin: admin, name: user.name }, '@Masri404', { expiresIn: '1h' });
    res.status(201).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;
