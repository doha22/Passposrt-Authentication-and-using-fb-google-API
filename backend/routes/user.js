// to avoid using try and catch
const router = require('express-promise-router')();
var express = require("express");
//const router = express.Router();
//var mongoose = require('mongoose');
//let user = require('../models/user');

// from validation schema  
const {validateBody , schemas} = require('../models/users');

const UsersControllers = require('../controllers/user');
const passport = require('passport')
const passportConfig = require('../passport');



router.route('/signup').post(UsersControllers.SingUp);

// here using local strategy
router.route('/signin').post(passport.authenticate('local',{ session : false}),UsersControllers.SingIn);

// here user is already logged in 
router.route('/secret').get(passport.authenticate('jwt',{ session : false}),UsersControllers.Secret);


//usign google auth 
router.route('/auth/google').post(passport.authenticate('googleToken',{ session : false}), UsersControllers.googleOAuth)


module.exports = router;