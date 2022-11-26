import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal/LoginModal';
import AuthContext from '../context/auth-context';

const Login = () => {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const userStatus = async() => {
            const res = await authContext.isAuthenticated();
            if(!res) {
                return;
            }
            navigate('/');
        }
        userStatus();
    }, [])

    return (
        <div className="Login">
            <LoginModal />
        </div>
    )
}

export default Login;