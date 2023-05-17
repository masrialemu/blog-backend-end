const express = require("express");
const app = express.Router();
const nodemailer=require('nodemailer')
require('dotenv/config')

app.post('/',async(req, res) => {
  const { email, title, description, recipientEmail } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.User, // replace with your Gmail email address
      pass: process.env.UPass // replace with your Gmail password or App Password
    }
  });
  const transporter1 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.User, // replace with your Gmail email address
      pass: process.env.UPass // replace with your Gmail password or App Password
    }
  });

  const mailOptions = {
    from: process.env.User,
    to: process.env.TUser,
    subject: title,
    text: description + '\n\nFrom: ' + email
  };
  
  const mailOptions1 = {
    from: process.env.User,
    to: `${email}`,
    subject: `Masresha Alemu`,
    // text: `Thank you so much for taking the time to provide me with feedback on my personal website. I really appreciate your input and insights. As a full stack developer, I am constantly looking for ways to improve the user experience of my website and your feedback will be incredibly valuable in helping me do that.
    // I will definitely take your suggestions into consideration and work to implement them as soon as possible. Please do not hesitate to reach out if you have any further thoughts or suggestions in the future. I am always looking for ways to improve my website and welcome any feedback you might have.
    // Thank you again for your time and input. It means a lot to me as I strive to make my website the best it can be.
    // Best regards`,
    html: `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            color: #333;
          }
          h1 {
            font-size: 24px;
            font-weight: bold;
            color: #0070f3;
            margin-bottom: 20px;
          }
          p {
            margin-bottom: 16px;
          }
          .btn {
            display: inline-block;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            color: #fff;
            background-color: #0070f3;
            border-radius: 4px;
            padding: 10px 20px;
          }
        </style>
      </head>
      <body>
        <h1>Thank you for your feedback!</h1>
        <p>Dear ${email},</p>
        <p>Thank you so much for taking the time to provide me with feedback on my personal website. I really appreciate your input and insights. As a full stack developer, I am constantly looking for ways to improve the user experience of my website and your feedback will be incredibly valuable in helping me do that.</p>
        <p>I will definitely take your suggestions into consideration and work to implement them as soon as possible. Please do not hesitate to reach out if you have any further thoughts or suggestions in the future. I am always looking for ways to improve my website and welcome any feedback you might have.</p>
        <p>Thank you again for your time and input. It means a lot to me as I strive to make my website the best it can be.</p>
        <p>Best regards,</p>
        <p>Masresha Alemu</p>
        <p><a href="https://masri.onrender.com" class="btn">Visit my website</a></p>
      </body>
    </html>
  `

  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (info) {
      res.status(200).send('sent email successfully');
      transporter1.sendMail(mailOptions1,()=>{
        res.status(200).send('feedback sent successfully'); 
      })
    } else {
      res.status(400).send('not sent email successfully'); 
    
    }
  });


  
});



module.exports= app