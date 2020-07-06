const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy;
//const {Extractjwt} = require('passport-jwt')
const { ExtractJwt } = require('passport-jwt')
const {JWT_SECRET} = require('./configuration/user')

const localStrategy = require('passport-local').Strategy;
const user = require('./models/users')

// use google auth
const GooglePlusTokenStrategy = require('passport-google-plus-token');


// json web token strategy
passport.use(new jwtStrategy({

    jwtFromRequest: ExtractJwt.fromHeader('autheriation'),  // from where the token will be comming
    secretOrKey : JWT_SECRET                      // token used to decoded 

}, async (payload , done) =>{

    // got sub from here :  signToken = user =>{
                                            // return  jwt.sign({
                                            //     iss : 'codeworker', //optional
                                            //     sub : user._id,
                                            //     iat : new Date().getTime(),  // optional , current time
                                            //     exp : new Date().setDate(new Date().getDate() + 1) // optional , current time + 1 day
                                            //   },JWT_SECRET) ;
    try{
        // find the users who has token 
        const users = await user.findById(payload.sub)
        // if user not exit
        if(!users){
            console.log("user hasnot token");
            return done(null , false);
        }
        

        //otherwise return the user 
        console.log("user with token");
        done(null , users);

    }catch(error){
        done(error , false );
    }
}
) );

//use google OAUTH strategy

// client_id =195266261830-g5g6hlppot1gcnbndskl3t72ccp99m1g.apps.googleusercontent.com
// client_secret = Fh_DjPBimcSl_JVtExwmTnSX

passport.use('googleToken',new GooglePlusTokenStrategy({
 
// get clientid , clientSecret from creating project when using google plus api
// clientID: config.oauth.google.clientID,
// clientSecret: config.oauth.google.clientSecret
clientID :'195266261830-g5g6hlppot1gcnbndskl3t72ccp99m1g.apps.googleusercontent.com'  ,
clientSecret : 'Fh_DjPBimcSl_JVtExwmTnSX'

} , async(accessToken , refreshToken ,profile , done)=>{
   
    try {

    console.log('access token : '+accessToken)
    console.log('refresh token :'+refreshToken)
    console.log('profile : '+ profile)
 

// check if current user is exist in db
const existUser = await user.findOne({"google.id":profile.id});
if(existUser){
    console.log("user already exist ")
    return done(null,existUser);
}

console.log("creating new user ")

// if new user account
const newUser = new User({
    // these data will be shown when testing on postman
    method: 'google',
    google: {
      id: profile.id,
      email: profile.emails[0].value
    }
  });
await newUser.save();
done(null , newUser);


    }catch(error){
done(error,false,error.message)

    }


}

))





// used for sign in
// use local strategy
passport.use( new localStrategy({
usernameField :'email'
} , async(email,password,done)=>{

    try{

// find the user given the email and password
const users = await user.findOne({"local.email":email })

// if not user
if(!users){
    console.log("not user")
    return done(null , false);
}

//check if password is correct
// call function from model
const isMatch = users.isValidPassword(password)

if(!isMatch){
    console.log("not match")
    return done(null,false);
    
}

// otherwise return the user
done(null,users)


    } catch(error){
      
 done(error,false);
    }

}))