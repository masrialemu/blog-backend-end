const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');
const Token = require('../Token')
const upload=require('../Route_Home/Multer')

const fs=require('fs')
  router.put('/:id',Token,upload.single('image'), async (req, res) => {
    try {
       const {place, title, desc, public_url } = req.body;
       let post
       const userx= await User.findById(req.params.id)
        if(userx.email===req.userId.email){
       post = await User.findByIdAndUpdate(req.params.id, { place,title, desc}, { new: true });
       if (req.file) {
        if (post.public_url) {
          fs.unlinkSync(`${post.public_url}`);
        }
        const public_url=post.public_url = req.file.path;
        post = await User.findByIdAndUpdate(req.params.id, { place, title, desc,public_url}, { new: true });
       
      }
  
      
       await res.json(post);
      // Hash the new password if it was included in the request
      // Save the updated user information
      const updatedUser = await user.save();
      res.json({ message: 'User information updated', user: updatedUser });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  module.exports = router;
  
