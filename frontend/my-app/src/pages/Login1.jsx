import React, { useState, useContext }  from 'react';

import { Redirect, Link } from 'react-router-dom';

import axios from 'axios';
import config from '../config.json';

import Store from '../store/store';

import './login.css';

import Avatar from '../images/avatar.svg';
import LoginMobile from '../images/login-bg.svg';
import Wavebg from '../images/wave.png'; 

import Footer from '../util/Footer';

import CONTENT from '../Lang/login.json';

import './pages.css';
const Login = () =>{
    const{ state, dispatch } = useContext(Store);
    const [data, setData] = useState({
        email: '',
        password: ''
    });

    const[load, setLoad] = useState(false);
    const [errors, setError] = useState(0); 
    //0 no error
    //1 is empty
    //2 not email
    //4 wrong password
    const handleChange = e =>{
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const verify = async() => {
        try{
            const res = await axios.post(
                `${config.BASE}/login/` , 
                data
            );
            console.log(res);
            if(res.data)
            {
                console.log(res.data);
                if(res.data.status === "True"){
                    localStorage.setItem('FBIdToken', `${res.data.token}`);
                    dispatch({
                        type: 'ONBOARD',
                        payload: res.data.token
                    });
                }
                if(res.data.status === "False"){
                    setError(4);
                    setLoad(false);
                }
            }            
        }catch(error){    
            console.log(error.response);
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
        if(data.email !== '' && data.password !== ''){
            if(isEmail(data.email)){
                setError(0);
                setLoad(true);
                verify();
            }else{
                setError(2);
            }
            
        }else{
            setError(1);
        }
        console.log("hello in submit");
    }

    //console.log(state.isAuth); 

    let content = CONTENT;
  
    if(state.lang ==="Hindi"){
        content = content.Hindi
    }else{
        content = content.English
    }

    if(state.isAuth){
        return <Redirect to='/' />;
    }
    return(
        <>
            <img className="wave" alt="wave" src={Wavebg}></img>
            <div className="container_login">
                <div className="img">
                    <img alt="mobile" src={LoginMobile}></img>
                </div>
                <div className="login-content">
                    <form >
                        <img alt="avatar" src={Avatar}></img>
                        <h2 className="title">{content.wel}</h2>
                        <div className="input-div one focus">
                            <div className="i">
                                    <i className="fas fa-user"></i>
                            </div>
                            <div className="div">
                                    <h4>{content.email}</h4>
                                    <input 
                                        type="email" 
                                        name='email'
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
                        <Link to='/forgotPassword'>{content.forpass}</Link>
                        {load ?
                            <input type="submit" className="btn_login" value="Loading" />
                            :
                            <input type="submit" className="btn_login" onClick={onSubmit} value={content.loginb} />
                        }
                        

                        <br></br>
                        <p>{content.noacc}<Link to = '/signup'> {content.clkh}</Link></p>
                        {/* {samp} */}
                        {errors=== 1 && 
                            <p>Please fill all credentials</p>
                        }
                        {errors === 2 &&
                            <p>Email is not valid</p>
                        }
                        {errors === 4 &&
                            <p>Wrong Credentials</p>
                        }
                    </form>
                    
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Login;