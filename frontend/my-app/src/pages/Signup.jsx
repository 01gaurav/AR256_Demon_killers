import React, { useState, useContext }  from 'react';

import { Redirect, Link } from 'react-router-dom';

import md5 from 'md5';

import axios from 'axios';
import config from '../config.json';

import Store from '../store/store';

import './login.css';

import Avatar from '../images/avatar.svg';
import LoginMobile from '../images/login-bg.svg';
import Wavebg from '../images/wave.png';

import './pages.css';


import CONTENT from '../Lang/login.json';

const Signup = () => {
    const{ state } = useContext(Store);
    const [data, setData] = useState({
        _id: '',
        password: '',
        confirmPassword: '', 
        name: '',
        
    });
    const [firstVerify, setFirst] = useState(false);

    const [userOTP, setUserOTP] = useState('');

    const [backOTP, setBackOTP] = useState('');

    const [verified, setVerified] = useState(false);

    const [load, setLoad] = useState(false);

    const [errors, setError] = useState(0); 
    //0 no error
    //1 is empty
    //2 not a email
    //3 password does not match
    const handleChange = e =>{
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const otpChange = e =>{
        setUserOTP(e.target.value);
    }

    const otpSent = async() => {
        const postData = {
            email : data._id,
        }
        try{
            
            const res = await axios({
                url: `${config.BASE}/sendEmail/`,
                method: "POST",
                data: postData
            });
            
            if(res.data)
            {
                if(res.data.status === "already registered"){
                    setLoad(false);
                    window.alert("Email already registered");
                }else{
                    setBackOTP(res.data.status);
                    setFirst(true);
                    setLoad(false);
                }
                //console.log(res.data);
            }            
        }catch(error){
            
            console.log(error);
        }   
    }


    const isEmail = (email) => {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.match(regEx)) 
            return true;
        else 
            return false;
      };

    const onSubmit = e =>{

        e.preventDefault();
        if(data.password === data.confirmPassword){
            if(data._id !== '' && data.password !== '' && data.confirmPassword !== '' && data.name !== ''  ){
                if(isEmail(data._id)){
                    setLoad(true);
                    otpSent();
                }else{
                    setError(2);
                }
            }else{
                setError(1);
            }
        }else{
            setError(3);
        }
        
        console.log("hello in submit");
    }

    

    

    const verifyOTP = async() => {
        const postData= {
            _id : data._id,
            password: data.password,
            name: data.name,
            recent: [],
            query: []
        }
        try{
            const res = await axios({
                url: `${config.BASE}/signUp/`,
                method: "POST",
                data: postData
            })
            if(res.data){
                //console.log(res.data);
                setLoad(false);
                setVerified(true);
            }

        }catch(error){
            if(error.response.data.status === "email already exist"){
                setLoad(false);
                setFirst(false);
            }
            setFirst(false);
            window.alert("Please try again");
            console.log(error);
        }
    }
    //console.log(userOTP);

    if(verified){
        return <Redirect to='/login' />;
    }


    const resendOTP= (e) => {
        e.preventDefault();
        setLoad(true);
        otpSent();
        //dataUpload();
    }
    console.log(firstVerify);
    console.log(data);

    
    
    const submitOTP = (e) => {
        e.preventDefault();
        if(backOTP === md5(userOTP))
        {
            setLoad(true);
            verifyOTP();
        }else{
            console.log(md5(userOTP));
            window.alert("OTP does not match");
        }
    }

    let content = CONTENT;
  
    if(state.lang ==="Hindi"){
        content = content.Hindi
    }else{
        content = content.English
    }

    if(state.isAuth){
        return <Redirect to='/login' />;
    }
    return(
        

        <>
            {!firstVerify ? ( 
                <>
                    <img className="wave" alt="background" src={Wavebg}></img>
                    <div className="container_login">
                        <div className="img">
                            <img src={LoginMobile} alt="side"></img>
                        </div>
                        <div className="login-content">
                            <form>
                                <img src={Avatar} alt="avatar img"></img>
                                <h2 className="title">{content.wel}</h2>
                                <div className="input-div one focus">
                                    <div className="i">
                                            <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="div">
                                            <h4>{content.email}</h4>
                                            <input 
                                                type="email" 
                                                name='_id'
                                                onChange={handleChange}
                                                required='required'
                                                className="input" 
                                            />
                                    </div>
                                </div>
                                <div className="input-div pass focus">
                                    <div className="i"> 
                                            <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="div">
                                            <h4>{content.pass}</h4>
                                            <input 
                                                type="password"  
                                                name='password'
                                                onChange={handleChange}
                                                required='required'
                                                className="input" 
                                            />
                                    </div>
                                </div>
                                <div className="input-div pass focus">
                                    <div className="i"> 
                                            <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="div">
                                            <h4>{content.copass}</h4>
                                            <input 
                                                type="password"  
                                                name='confirmPassword'
                                                onChange={handleChange}
                                                required='required'
                                                className="input" 
                                            />
                                    </div>
                                </div>
                                <div className="input-div pass focus">
                                    <div className="i"> 
                                            <i className="fas fa-user"></i>
                                    </div>
                                    <div className="div">
                                            <h4>{content.name}</h4>
                                            <input 
                                                type="text"  
                                                name='name'
                                                onChange={handleChange}
                                                required='required'
                                                className="input" 
                                            />
                                    </div>
                                </div>
                                {load ? 
                                    (
                                        <input type="button" className="btn_login" value="Loading..." />
                                    ):(
                                        <input type="submit" className="btn_login" onClick={onSubmit} value={content.signupb} />
                                    )
                                }
                                
                                <br></br>
                                <p>{content.noacc}<Link to = '/login'>{content.clkh}</Link></p>
                                {/* {samp} */}
                                {errors=== 1 && 
                                    <p className="error">Please fill all credentials</p>
                                }
                                {errors === 2 &&
                                    <p className="error">Email is not valid</p>
                                }
                                {errors === 3 &&
                                    <p  className="error">Password doesnot match with Confirm Password</p>
                                }
                            </form>
                            
                        </div>
                    </div>
        
                </>
                
            ): (
                <>
                    <img className="wave" alt="background" src={Wavebg}></img>
                    <div className="container_login">
                        <div className="img">
                            <img src={LoginMobile} alt="side"></img>
                        </div>

                        <div className="login-content">
                            <form>
                                <img src={Avatar} alt="avatar img"></img>
                                <h2 className="title">Verify</h2>
                                <div className="input-div one focus">
                                    <div className="i">
                                            <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="div">
                                            <h4>Enter Verification Code</h4>
                                            <input 
                                                type = "text"
                                                onChange = {otpChange}
                                                required='required'
                                                className="input"
                                                value = {userOTP}
                                            />
                                    </div>
                                </div>
                                {load ? 
                                    <input type="button" className="btn_login"  value="Loading..." />
                                    :
                                    <input type="submit" className="btn_login" onClick={submitOTP} value="Confirm" />

                                }
                                <br/>
                                {load ? 
                                    <input type="button" className="btn_login"  value="Loading..." />
                                    :
                                    <input type="submit" className="btn_login" onClick={resendOTP} value="Resend" />

                                }
                                
                                <br></br>
                                <p>We have sent a Verification code to your registered email Id.</p>
                            </form>
                            
                        </div>
                    </div>
                </>
                        
            )}

           
            
        </>
    );
}

export default Signup;