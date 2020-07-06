var mongoose = require('mongoose');
// for passpword encrption
const bcrypt = require('bcryptjs') ;

const Schema = mongoose.Schema ;

// create the schema for user 

var UserSchema = new Schema({

    // adding method to choose which type you will select to login
    method: {
        type: String,
       enum: ['local', 'google', 'facebook'],
        required: true
      },

      // then write 3 methods if local , google or fb

      ///////// if local as normally login
      local : {

        email: {
            type: String,
            lowercase : true   // in this case email and pass shouldn't be required and unique
        },
        password: {
            type: String,
           // minlength : [4,'Password must be at least 4 character long']
        },

      }, 
      /////////// if select login by google 
      google : {

        id :{
          type : String   // it's google id
        },
        email :{
            type: String ,
            lowercase : true 
        }

      },
      //////////// if select login by fb
      facebook :{

        id :{
            type : String   // it's fb id
          },
          email :{
              type: String ,
              lowercase : true 
          }

      }

      
    
   
    
});


UserSchema.pre('save',async function(next){
    try{
        console.log('entered');
        // for login with google or fb
        if (this.methods !=='local') {
            console.log("not local")
            next();
        }

        console.log("local")

   

// generate salt
        const salt = await bcrypt.genSalt(10);
// hashing the password of user (hash+salt)
     const hashedpass =  bcrypt.hash(this.local.password,salt)  // cause method here is local
     this.local.password = hashedpass ;
     console.log("hashedpass" + this.local.password)
       next();

    }catch(error){
        // used next(error) cause using next() as input of fn
        console.log("password not hashed")
        next(error);
    }

})

// create fn to use in passport file when validating the password
UserSchema.methods.isValidPassword = async function(newpass){

    try{
        
        console.log("newpass" );
        // will compare the plain pass with hashed pass
        // newpass : plain text pass , hashed  => this.password which reasigned the hashed pass on it
 return await bcrypt.compare(newpass , this.local.password)
    }catch(error){
        console.log("comparing pass failed")
 throw new Error(error);
    }
}


const user = mongoose.model('User', UserSchema);




module.exports = user ;
