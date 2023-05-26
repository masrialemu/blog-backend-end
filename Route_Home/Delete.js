const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth');
const Token = require('../Token');
const fs = require('fs');
const path = require('path');

router.delete('/:id', Token, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user.email === req.userId.email || req.userId.isAdmin) {
      // Delete the user's post
      await User.findByIdAndDelete(req.params.id);

      // Delete the associated image file
      if (user.public_url) {
        // Extract the file name from the public_url
        const fileName = path.basename(user.public_url);
        
        // Delete the previous image file if it exists
        fs.unlinkSync(`Pic/${fileName}`);
      }

      return res.status(200).json({ user, message: 'User is deleted' });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
