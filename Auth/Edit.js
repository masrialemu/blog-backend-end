const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token');
const bcrypt = require('bcrypt');
const upload = require('../Route_Home/Multer');
const fs = require('fs');

// Edit user info
router.put('/:id', Token, upload.single('image'), async (req, res) => {
  try {
    const { name, password, isAdmin, email } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.email !== req.userId.email || req.userId.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update user fields
    let updatedFields = {};

    if (name) {
      updatedFields.name = name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    if (req.file) {
      // Delete the previous profile image if it exists
      if (user.image) {
        fs.unlinkSync(user.image);
      }

      // Move the uploaded image to the "Pic" folder
      const imagePath = `Pic/${req.file.filename}`;
      fs.renameSync(req.file.path, imagePath);

      updatedFields.image = imagePath;
    }

    if (req.userId.isAdmin) {
      if (isAdmin !== undefined) {
        updatedFields.isAdmin = isAdmin;
      }
      if (email) {
        updatedFields.email = email;
      }
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    res.json({ message: 'User information updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
