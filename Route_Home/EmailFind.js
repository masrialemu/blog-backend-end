const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Post');

router.get('/:email', async (req, res) => {
  
        const userEmail = req.params.email;
      
        try {
          const posts = await User.find({ email: userEmail }).exec();
          res.json(posts);
        } catch (err) {
          console.error(err);
          res.status(500).send('An error occurred');
        }

});

module.exports = router;
