const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token');
const bcrypt = require('bcrypt');
const Multer = require('../Route_Home/Multer');
const fs = require('fs');
const path = require('path');
const multer=require('multer')

const upload = multer({ dest: 'Pic' });

async function uploadImageToImgBB(imagePath) {
  const uploadImageToImgBB = async (imagePath) => {
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
  };
}
// Edit user info
router.put('/:id', Token, upload.single('image'), async (req, res) => {
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
      const imgUrl = await uploadImageToImgBB(req.file.path);
      updatedFields.public_url = imgUrl;

      // Delete the local file after uploading
      fs.unlinkSync(req.file.path);
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