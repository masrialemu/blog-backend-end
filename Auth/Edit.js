const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const Token = require('../Token')
const bcrypt=require('bcrypt')
const upload=require('../Route_Home/Multer')
const fs=require('fs')
// Edit user
  
  // Edit user info
  router.put('/:id',Token,upload.single('image'), async (req, res) => {
    try {
      const { name, password, public_url,isAdmin,email } = req.body;
      let post
      const userx= await User.findById(req.params.id)
       if(userx.email===req.userId.email ||req.userId.isAdmin){
        if (password) {
          const passwords=await bcrypt.hash(password, 10);
          post = await User.findByIdAndUpdate(req.params.id, { name, password:passwords}, { new: true });

        }
        if(req.userId.isAdmin){
          post = await User.findByIdAndUpdate(req.params.id, {isAdmin,email}, { new: true });
 
        }
      if (req.file) {
       if (post.public_url) {
         fs.unlinkSync(`${post.public_url}`);
       }
       const public_url=post.public_url = req.file.path;
       post = await User.findByIdAndUpdate(req.params.id, {public_url}, { new: true });
      
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
 
   
   
   
   
   
   
   
   
   
  //   try {
  //     let post
  //     const { name, password} = req.body;
  //      const userx= await User.findById(req.params.id)
  //      if(userx.name===req.userId.name){
  //       post = await User.findByIdAndUpdate(req.params.id, { name}, { new: true });
 
        
  //     }
  //     // if (req.file) {
  //     //   if (post.public_url) {
  //     //     fs.unlinkSync(`${post.public_url}`);
  //     //   }
  //     //   const pic=post.public_url = req.file.path;
  //     //   post = await User.findByIdAndUpdate(req.params.id, { name,password,pic}, { new: true });
       
  //     // }
      
  
  //     // Only allow admins or the user themselves to edit their information
  //     if (req.userId.userId !== user.id && !req.userId.isAdmin) {
  //       return res.status(403).json({ message: 'Access denied' });
  //     }
  //     if (!userx) {
  //       return res.status(404).json({ message: 'User not found' });
  //     }
  
  
  //     // Save the updated user information
  //     const updatedUser = await post.save();
  //     res.json({ message: 'User information updated', user: updatedUser });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: 'Internal server error' });
  //   }
  // });
  
  module.exports = router;
  
