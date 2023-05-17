const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');

// In routes/auth.js

router.get('/:id',async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      await res.json({user:user, name:user.name})
  } catch (error) {
    res.status(400).json({ message: error});
  }
});

module.exports = router;

  