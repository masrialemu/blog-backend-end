const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv/config')
const app = express();
const PORT = 5000;
const core=require('cors')
// MongoDB setup
// app.use(express.json());
app.use(core())
mongoose.connect(process.env.Pass, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model('UserZ', {
  username: String,
  password: String,
});

// Session store setup
const store = new MongoStore({
  uri: 'mongodb://localhost:27017/sessionstore',
  collection: 'sessions',
});

app.use(express.json());
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({ username, password: hashedPassword });
  await user.save();
  req.session.userId = user._id;
  res.send('Signup successful!');
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).send('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send('Invalid password');
  }
  req.session.userId = user._id;
  res.send('Login successful!');
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
