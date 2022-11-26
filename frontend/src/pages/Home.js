import React, { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import HomeModal from '../components/HomeModal/HomeModal';

const Home = () => {
    const authContext = useContext(AuthContext);

    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        const retrieveUser = async() => {
            const res = await authContext.isAuthenticated();
            if(!res) {
                navigate('/login');
            }
            setUser(res);
        }
        retrieveUser();
    }, [])

    const logoutHandler = async() => {
        const res = await authContext.logout();
        if(!res) {
            console.log(res);
        }
        navigate('/login');
    }

    const profilePicHandler = async(formData) => {
        const res = await authContext.changeProfilePicture(formData);
        if(!res) {
            console.log('Server error');
            return;
        }
        if(res === 'Token invalid.') {
            navigate('/login');
            return;
        }
    }

    return (
        <div className="Home">
            <HomeModal user={user} logout={logoutHandler} profilePic={profilePicHandler} />
        </div>
    )

}

export default Home;