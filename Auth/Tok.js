const express = require('express');
const router = express.Router();
const verifyToken = require('../Token');

router.get('/', verifyToken, (req, res) => {
    // This route is protected, so only authenticated users can access it
    console.log(req.userId.userId);
    res.send({ message: `Hello, ${req.userId}!` });
  });
module.exports = router