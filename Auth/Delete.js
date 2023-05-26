const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token');
const fs = require('fs');

// Delete user
router.delete('/:id', Token, async (req, res) => {
  try {
    if (req.userId.isAdmin || req.userId.userId === req.params.id) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Delete the local image file
      if (user.public_url) {
        const fileName = user.public_url.split('/').pop();
        const imagePath = `Pic/${fileName}`;
        fs.unlinkSync(imagePath);
      }

      // Delete the user from the database
      await User.findByIdAndDelete(req.params.id);

      return res.status(200).json({ message: 'User and associated files are deleted' });
    }
    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;