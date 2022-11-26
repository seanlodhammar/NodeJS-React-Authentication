import React, { useRef, useContext, useState } from 'react';
import './SignupForm.css';
import InputField from '../InputField/InputField';
import { Link, useNavigate } from 'react-router-dom';
import google from '../../images/googlesignin.jpg';
import github from '../../images/githubsignin.jpg';
import facebook from '../../images/facebooksignin.jpg';
import AuthContext from '../../context/auth-context';

const SignupForm = () => {
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    const emailRef = useRef();
    const passwordRef = useRef();
    const authContext = useContext(AuthContext);

    const preventFormSubmissionHandler = (e) => {
        e.preventDefault();
    }

    const inputValHandler = async(e) => {
        e.preventDefault();
        const signupOutcome = await authContext.signup(emailRef.current.value, passwordRef.current.value);
        if(signupOutcome !== true) {
            setErrors(signupOutcome);
            return;
        }
        setErrors(false);
        navigate('/');
    }

    const googleProvHandler = () => {
        window.location = 'http://localhost:5000/auth/google';
    }

    const githubProvHandler = () => {
        window.location = 'http://localhost:5000/auth/github'
    }

    const facebookProvHandler = () => {
        window.location = 'http://localhost:5000/auth/facebook';
    }


    return (
        <form className="SignupForm" onSubmit={preventFormSubmissionHandler}>
            <h2 id="signup-title">Signup</h2>
            <div className="input-fields">
                <InputField inputId="email-field" inputType="text" labelId="email-label" label="Email" ref={emailRef} errors={errors}/>
                <InputField inputId="password-field" inputType="text" labelId="password-label" label="Password" ref={passwordRef} errors={errors}/>
            </div>

            <div className="BottomForm">
                <button id="submit-btn" onClick={inputValHandler}>Signup</button>
                <h4 id="alt-options-text">or signup with</h4>
                <div className="providers">
                    <input type="image" id="google" src={google} onClick={googleProvHandler}/>
                    <input type="image" id="facebook" src={facebook} onClick={facebookProvHandler}/>
                    <input type="image" id="github" src={github} onClick={githubProvHandler}/>
                </div>
                <Link id="alt-option" to='/login'>or Login</Link>
            </div>
        </form>
    )
}

export default SignupForm;