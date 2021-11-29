//jshint esversion:6
require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const port = 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

//set up the mongoose-encryption to encrypt the password from userSchema
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

/* -------------------- Get Requests -------------------- */

app.get('/', function(req, res) {
  res.render('home.ejs');
});

app.get('/login', function(req, res) {
  res.render('login.ejs');
});

app.get('/register', function(req, res) {
  res.render('register.ejs');
});

/* -------------------- Post Requests -------------------- */

app.post('/register', function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (err) {
      res.render(err);
    } else {
      res.render('secrets.ejs');
    }
  });
});

app.post('/login', function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  //check the db for the entered user
  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      //if user is found check the password and display the secrets page
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('secrets.ejs');
        }
      }
    }
  });

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
