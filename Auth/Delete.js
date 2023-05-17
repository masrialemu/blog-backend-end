const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token =require('../Token')
// Delete user

  

router.delete('/:id',Token, async (req, res) => {
    try {
      if(req.userId.isAdmin||req.userId.userId===req.params.id){
        const user =await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({user:user, message: 'User is deleted' });
      }
        return res.status(404).json({ message: 'User not found' });
      // res.json(deletedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;