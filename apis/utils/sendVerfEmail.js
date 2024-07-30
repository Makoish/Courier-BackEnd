
var jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require('dotenv').config()
var ejs = require('ejs');
var fs = require('fs');


const path = require("path");

var template = fs.readFileSync(path.join(process.cwd(), './apis/htmls/confEmail.html'), { encoding: 'utf-8' });



module.exports = async (_id, recipientEmail, firstName, surName) => {
    
   
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // use SSL
        auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD
        }
      });


    const token = jwt.sign({
      id: _id,
      exp: Math.floor(Date.now() / 1000) + 3600
    }, "secret1337")
    const mailOptions = {
        "from": process.env.USER,
        "to": recipientEmail,
        html: ejs.render(template, {
          // name: `${firstName.slice(0,1).toUpperCase()}``${firstName.slice(1).toLowerCase()}` `${surName.slice(0,1).toUpperCase()}``${surName.slice(1).toLowerCase()}`,
          name: `${firstName} ${surName}`,
          verificationLink: process.env.URL +"/user/verify/?token="+ token
    }),
        
    }


    const info = await transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        console.log('Error:', error);
        } else {
        console.log('Email sent: ' + info.response);
        }
    });

};
