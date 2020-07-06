const http = require('http') ;


var mongoose = require('mongoose');



bodyParser = require('body-parser');

// import express
const express = require('express') ;

const app = express();



app.use(bodyParser.urlencoded({extended: true})  );
app.use(bodyParser.json()) ;






// mongodb connection 



try{

const uri = "mongodb+srv://admin:1234@cluster0-14764.mongodb.net/user_auth?retryWrites=true&w=majority";

mongoose.connect(uri, { useUnifiedTopology: true ,useNewUrlParser: true, useCreateIndex: true }
  );
  const connection = mongoose.connection;
  connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
  });

}catch (err) {
    console.error(err.message);
}

//use the files
//const materialRouter = require('./routes/material');
//const usersRouter = require('./routes/user');



const users = require('./routes/user');




app.use('/users',users);


//for errors , it will return the status
app.use(function (err, req, res) {
  console.error("you have error is "+err.message);
  if (!err.statusCode) err.statusCode = 500;
  //res.status(err.statusCode).send(err.message);
  console.error("status error code is "+err.statusCode +" "+ err.messag );
 
});








const server = http.createServer(app);

server.listen(8888);