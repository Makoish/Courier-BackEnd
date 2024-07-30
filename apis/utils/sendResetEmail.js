
var jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
require('dotenv').config()
var ejs = require('ejs');
var fs = require('fs');

const { promisify } = require('util');

const path = require("path");
const readFile = promisify(fs.readFile);
var template = fs.readFileSync(path.join(process.cwd(), './apis/htmls/resetEmail.html'), { encoding: 'utf-8' });



module.exports = async (_id, recipientEmail) => {
    

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
      exp: Math.floor(Date.now() / 1000) + 1
    }, "secret1337")
    const mailOptions = {
        "from": process.env.USER,
        "to": recipientEmail,
        html: ejs.render(template, {
          resetUrl: process.env.URL + "/" + token
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
