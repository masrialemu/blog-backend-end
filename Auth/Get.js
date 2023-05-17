const express = require('express');
const router = express.Router();
const User = require('../Mongoose/Auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Signin route

// const Data=[
//   {
//     "id":1,
//     "name":"Masri",
//     "email":"masri@gmail.com",
//     "pass":"123456",
//     "isAdmin":true
//   },
//   {
//     "id":2,
//     "name":"Masri404",
//     "email":"masri1@gmail.com",
//     "pass":"123456",
//     "isAdmin":false
//   },
//   {
//     "id":3,
//     "name":"Henok",
//     "email":"henok@gmail.com",
//     "pass":"123456",
//     "isAdmin":false
//   },
//   {
//     "id":4,
//     "name":"Lidiya",
//     "email":"lidiya@gmail.com",
//     "pass":"123456",
//     "isAdmin":false
//   },
  
// ]
router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid login credentials' });
    }

    // Create and sign token
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin,  name:user.name ,email:user.email},
      '@Masri404', 
      { expiresIn: '1h' }
    );

    // Return token and user data
    res.status(200).json({ token, user: { id: user._id, email: user.email, name:user.name ,pic:user.public_url, isadmin:user.isAdmin} });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
