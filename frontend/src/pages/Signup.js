import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupModal from '../components/SignupModal/SignupModal';
import AuthContext from '../context/auth-context';

const Signup = () => {
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
        <div className="Signup">
            <SignupModal />
        </div>
    )
}

export default Signup;