
import React, { Component } from 'react';
import axios from 'axios';
import 'mdbreact/dist/css/mdb.css' ;
import FacebookLogin from 'react-facebook-login';
//import ReactDOM from 'react-dom';

import '../App.css';
import {MDBRow,  MDBCol, MDBInput, MDBBtn, MDBCard, MDBCardBody} from 'mdbreact';

export default class Register extends Component {

   constructor(props) {
       super(props);
        this.routeChange = this.routeChange.bind(this)

       
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

   //     this.onSubmitLogin = this.onSubmitLogin.bind(this);

        this.state = {
            email : '',
            password: ''
        }
   }

// to redirect to anther page 
    // history = useHistory();

     routeChange = () =>{ 
    
    this.props.history.push("/list_upload_info");
  }

    onChangeEmail(e) {
        this.setState({ 
            email: e.target.value 
        })
    }

    onChangePassword(e) {
        this.setState({ 
            password: e.target.value 
        })
    }


    onSubmit(e) {
        e.preventDefault()
        const result = {
               email: this.state.email,
               password : this.state.password
 
             }
         

        axios.post("http://localhost:8888/login", (result)) 
        .then(
          res => {
            console.log(res);
        })
    }


responseFacebook(response) {
      console.log(response);
      axios({
        method:"POST",
        url:"http://localhost:8888/login",
        data : {tokenId:response.tokenId}
       })
        .then(
          res => {
            console.log("Google Login Success",res);
        })
    }


    render() {
        return (

          <MDBRow className="card_s">
             <MDBCol md="7"></MDBCol>
   
        <MDBCol md="4">
          <MDBCard className="card_l">
         
            <MDBCardBody>
              <form onSubmit={this.onSubmit} action="/" method="post">
                <p className="h4 text-center ">Login</p>
                <div className="grey-text">
                 
                  <MDBInput
                    label="Your email"
                    icon="envelope"
                    group
                    type="email"
                   
                    validate
                    error="wrong"
                    success="right"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                  />
            
                  <MDBInput
                    label="Your password"
                    icon="lock"
                    group
                  
                    type="password"
                    validate
                    value={this.state.password}
                    onChange={this.onChangePassword}
                  />
                </div>
               
               
                <div className="text-center ">
                 
<MDBBtn color="primary" 
               onClick={this.routeChange}
                  >
                  Login
                  </MDBBtn>
             

                </div>
                
              
              
              </form>
              <hr></hr>
<p>OR</p>
              <div>
              <FacebookLogin
          appId="746368379437165"
          autoLoad={false}
          scope="public_profile,user_friends,user_actions.books"
          callback={this.responseFacebook}
        />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

      </MDBRow>
 );
}
}

// export default FormPage;
