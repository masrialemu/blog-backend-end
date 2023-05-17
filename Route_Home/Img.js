const express = require('express');
const multer = require('../Route_Home/Multer');
const router = express.Router();
const path=require('path')
const Cloudinary =require('../Mongoose/Cloude')
const Post = require('../Mongoose/Post');
// Set storage engine
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null,  Date.now() + path.extname(file.originalname));
//   }
// });

// Init upload
//const uploads = multer({storage: storage}).single('image');
router.post('/',multer.single('image'), async(req, res) => {
    const result = await Cloudinary.uploader.upload(req.file.path)
    // const post=new Post({
    //     img:req.file.path
    //   })
    await res.status(200).json(result)

  });
  

module.exports=router
