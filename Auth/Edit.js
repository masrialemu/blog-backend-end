const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token');
const bcrypt = require('bcrypt');
const Multer = require('../Route_Home/Multer');
const fs = require('fs');
const path = require('path');

// Edit user info
// Edit user info
// Edit user info
router.put('/:id', Token, Multer.single('image'), async (req, res) => {
  try {
    const { name, password, isAdmin, email } = req.body;
    const userId = req.userId;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() !== userId.userId && !userId.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedFields = {};

    if (name) {
      updatedFields.name = name;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    if (req.file) {
      if (user.public_url) {
        const fileName = path.basename(user.public_url);
        const filePath = path.join(__dirname, '..', 'Pic', fileName);

        // Check if the file exists before deleting
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const imagePath = `Pic/${req.file.filename}`;
      const public_url = `http://localhost:5000/${imagePath}`;
      fs.renameSync(req.file.path, imagePath);

      updatedFields.public_url = public_url;
    }

    if (userId.isAdmin) {
      if (isAdmin !== undefined) {
        updatedFields.admin = isAdmin;
      }
      if (email) {
        updatedFields.email = email;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

    res.json({ message: 'User information updated', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;
