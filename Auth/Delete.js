const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token');
const fs = require('fs');
const axios = require('axios');


// Delete user
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
