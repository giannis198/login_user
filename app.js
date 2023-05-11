//jshint esversion:6


require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")

var encrypt = require('mongoose-encryption');


const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"))

mongoose.connect('mongodb://127.0.0.1:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
})

const secret = process.env.SECRET


userSchema.plugin(encrypt, { secret: secret , encryptedFields: ['password'] } )

const User = new mongoose.model("User", userSchema)

app.use(bodyParser.urlencoded({extended: true}));


app.get('/', function (req, res) {
    res.render('home')
  })
///////////////////////// Login Route /////////////////////////////////////////////////////////
app.route('/login')
  .get(function (req, res) {
    res.render('login')
  })

  
  .post(async function (req, res) {

    const loggedUsername = req.body.username
    const loggedPassword = req.body.password
    const foundUser = await User.findOne({email : loggedUsername})

    if (foundUser) {
      if (foundUser.password === loggedPassword) {
        res.render('secrets')
      } else {
        res.send("Login Failed Try Again!!") }
    } else (
      res.send("Login Failed Try Again!!")
      // res.render('login')
    )
  })

//////////////////////// Register Route ////////////////////////////////////////////////////////
app.route('/register')
  .get(function (req, res) {
    res.render('register')
  })

  .post(function (req, res) {

    const newUser = new User({
      email : req.body.username,
      password: req.body.password
    })

    if (newUser.save()) {
      res.render('secrets')
    } else {
      res.send("ERROR IN REGISTATION TRY AGAIN!!")
    }
    
  })









app.listen(3000,function() {
    console.log("Server Started at localhost:3000");
  })