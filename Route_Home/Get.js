const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');

router.get('/', async (req, res) => {
    try {
      const user = await User.find(); // Exclude password field
      await res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

  module.exports = router;