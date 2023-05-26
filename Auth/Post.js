const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Multer = require('../Route_Home/Multer');
const path = require('path');

// Signup route
router.post('/', Multer.single('image'), async (req, res) => {
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
      const imagePath = `Pic/${req.file.filename}`;

      // Move the uploaded image to the "Pic" folder
      fs.renameSync(req.file.path, imagePath);

      // Use localhost URL for image path
      user.public_url = `http://localhost:5000/${imagePath}`;
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