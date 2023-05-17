const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Auth = require('../Mongoose/Auth')
const Token =require('../Token')
// Delete user

  

router.delete('/:id',Token,async (req, res) => {
    try {
          const userx= await User.findById(req.params.id)
          if(userx.email===req.userId.email ||req.userId.isAdmin){
            await User.findByIdAndDelete(req.params.id)
            return res.status(200).json({userx:userx, message: 'User is deleted' });

          } 
          return res.status(404).json({ message: 'User not found' });

        
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
module.exports = router;