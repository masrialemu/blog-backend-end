const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const token = require('../Token')
// In routes/auth.js

router.get('/:id',token,async (req, res) => {
  try {
    if(req.userId.isAdmin||req.userId.userId===req.params.id){
      const user = await User.findById(req.params.id);
      await res.json(user);
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

  