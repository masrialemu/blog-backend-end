const express = require('express');
const app = express();
const core=require('cors')
const mongoose = require('mongoose');
const Post =require('./Route_Home/Post')
const GetEdit = require('./Route_Home/Edit')
const getPost =require('./Route_Home/Get')
const sgetPost =require('./Route_Home/Single')
const Signup=require('./Auth/Post')
const Signin=require('./Auth/Get')
const ADelete=require('./Auth/Delete')
const AEdit=require('./Auth/Edit')
const AallUser=require('./Auth/AllUser')
const Aid=require('./Auth/SingleId')
const Tok=require('./Auth/Tok')
const Img =require('./Route_Home/Img');
const path = require('path');
const PostDelete= require('./Route_Home/Delete')
const Contact =require('./Auth/Contact')
require('dotenv/config')
app.use('/Pic',express.static(path.join(__dirname,'/Pic')))
// Set up middleware
app.use(express.json());
app.use(core())
mongoose.connect(process.env.Pass,
 { useNewUrlParser: true }).then(console.log('db is connected'));
app.use('/posts', Post);
app.use('/getpost', getPost);
app.use('/getdelete', PostDelete);
app.use('/sgetpost/', sgetPost);
app.use('/getedit/', GetEdit);
app.use('/signup',Signup)
app.use('/signin',Signin)
app.use('/signin/delete/',ADelete)
app.use('/signin/edit/',AEdit)
app.use('/signin/all',AallUser)
app.use('/signin/id/',Aid)
app.use('/contact',Contact)
// app.use('/signin/token',Tok)
//users/:id
app.listen(5000, () => {
    console.log(`Server started on port 5000`);
});