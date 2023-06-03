const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const Token = require('../Token');
const axios = require('axios');

// async function deleteImageFromImgBB(imageUrl) {
//   try {
//     const urlParts = imageUrl.split('/');
//     const imageId = urlParts[urlParts.length - 1].split('.')[0];
//     const response = await axios.delete(`https://api.imgbb.com/1/image/${imageId}?key=bb3c04e726776d171fb92035dfb747cf`);

//     // Check if the delete request was successful
//     if (response.data.status_code === 200) {
//       console.log('Image deleted successfully.');
//     } else {
//       console.error('Failed to delete image:', response.data.error);
//     }
//   } catch (error) {
//     console.error('Error deleting image from ImgBB:', error.message);
//     throw error;
//   }
// }

router.delete('/:id', Token, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user.email === req.userId.email || req.userId.isAdmin) {

      await User.deleteOne({ _id: req.params.id });

      return res.status(200).json({ user, message: 'User and associated files are deleted' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
