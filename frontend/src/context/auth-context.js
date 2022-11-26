import React from 'react';
import { postLogin, postSignup, postLogout, getUser, postProfilePicture } from '../api/auth';

const AuthContext = React.createContext({
    login: () => {},
    signup: () => {},
    logout: () => {},
    isAuthenticated: () => {},
    changeProfilePicture: () => {},
})

export const AuthContextProvider = (props) => {
    const login = async(email, password) => {
        const res = await postLogin(email, password)
        if(res.data.errors) {
            return [...res.data.errors];
        }
        if(res.data.message === 'User is already authentiated') {
            return {msg: 'You are already authenticated.'};
        }
        if(!res.data.userToken && res.status !== (200 || 201)) {
            return {msg: 'Internal Server Error'}
        }
        if(res.data.userToken) {
            localStorage.setItem('token', res.data.userToken);
            return true;
        }
    }

    const signup = async(email, password) => {
        const res = await postSignup(email, password);
        if(res.data.errors) {
            return [...res.data.errors];
        }
        if(!res.data.userToken && res.status !== (200 || 201)) {
            return {msg: 'Internal Server Error'}
        }
        if(res.data.userToken) {
            localStorage.setItem('token', res.data.userToken);
            return true;
        }

    }

    const logout = async() => {
        if(localStorage.getItem('token') === 'undefined') {
            const res = await postLogout();
            if(res.data.message === 'Logout unsuccessful') {
                return false;
            }
            return true;
        }
        const res = await postLogout(localStorage.getItem('token'));
        if(res.data.message === 'Logout unsuccessful') {
            localStorage.setItem('token', 'undefined');
            return false;
        }
        return true;
    }

    const isAuthenticated = async() => {
        if(localStorage.getItem('token') === 'undefined') {
            const res = await getUser();
            if(!res) {
                return false;
            }
            if(res.data.message === 'User is not authenticated') {
                return false;
            }
            return res.data;
        }
        const res = await getUser(localStorage.getItem('token'));
        if(!res) {
            return false;
        }
        if(res.data.message === 'User is not authenticated') {
            localStorage.setItem('token', 'undefined');
            return false;
        }
        if(res.data.message === 'Token invalid.') {
            localStorage.setItem('token', 'undefined');
            return false;
        }
        return res.data;
    }

    const changeProfilePicture = async(formData) => {
        const token = localStorage.getItem('token');
        const res = await postProfilePicture(token, formData);
        if(res.data.message === 'Token invalid.') {
            return 'Token invalid.'
        }
        if(res.status !== 200) {
            return false;
        }
        return true;
    }

    return (
        <AuthContext.Provider value={{ login: login, signup: signup, logout: logout, isAuthenticated: isAuthenticated, changeProfilePicture: changeProfilePicture }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContext;