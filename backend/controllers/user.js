const User = require("../models/users") ;
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../configuration/user') ;

// sign() fn take secret key
signToken = user =>{
return  jwt.sign({
  iss : 'codeworker', //optional
  sub : user._id,
  iat : new Date().getTime(),  // optional , current time
  exp : new Date().setDate(new Date().getDate() + 1) // optional , current time + 1 day
},JWT_SECRET) ;

}

module.exports = {

  SingUp:async(req , res , next)=>{
    // need email and password validation
    // req.value.body if using roi for validation
  const {email , password} = req.body ;

// check if user same email
const emailFound  = await User.findOne({"local.email": email  })
if(emailFound){
   return res.status(403).json({error : 'Email is already used '})
  }

   console.log("signup")

  //create new user

  const newuser = new User({
    method :'local',
    local :{
      email : email ,
      password: password
    }
   
  })
  console.log("signup") 
  await newuser.save();


  // use webtoken
 // res.json({user:"created"});

 // generate token
 const token = signToken(newuser)


// respond with token
// result as encoding
  res.status(200).json({token}) ;

  } ,

  SingIn:async(req , res , next)=>{
  //  const {email , password} = req.body ;
   // if((password != user.findOne({password}) ) && (email != user.findOne({email})) )
   // {console.log("wrong pass")
   // res.status(500).json({message:"password wrong"})
  //  else{
console.log("enter signin")
    // generate token
    const token = signToken(req.user);
    res.status(200).json({token}) ;
  //  }
  } ,



  googleOAuth: async (req, res, next) => {
    // Generate token
    const token = signToken(req.user);
    res.cookie('access_token', token, {
      httpOnly: true
    });
    res.status(200).json({ success: true });
  },


  Secret:async(req , res , next)=>{
   console.log("secret")
  }


}