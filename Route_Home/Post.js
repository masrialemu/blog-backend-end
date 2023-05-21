const express = require('express');
const router = express.Router();
const Post = require('../Mongoose/Post');
const cloudinary=require('../Mongoose/Cloude')
const fs= require('fs')
const upload=require('../Route_Home/Multer')


router.post('/',upload.single('image'), async (req, res) => {
  try {
    const post = new Post({
      email:req.body.email,
      place:req.body.place,
      title: req.body.title,
      desc: req.body.desc,

      // img_url: result.url,
      // img_id:result.public_id,
    });
    if (req.file) {
      // If an image is uploaded
      // const result = await cloudinary.uploader.upload(req.file.path);
      // post.cloudinary_id = result.public_id;
      post.public_url = req.file.path;
    }

    const save=await post.save();
    await res.send(save);
    // fs.unlinkSync(req.file.path)
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

module.exports = router