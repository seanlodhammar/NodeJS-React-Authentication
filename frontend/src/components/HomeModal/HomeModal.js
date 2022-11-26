import React, { useState } from 'react';
import './HomeModal.css';

const HomeModal = (props) => {
    const logout = () => {
        props.logout();
    }

    const [image, setImage] = useState();

    const setImageHandler = (e) => {
        setImage(e.target.files[0]);
    }

    const profilePicHandler = () => {
        const formData = new FormData();
        formData.append('avatar', image);
        props.profilePic(formData);
    }



    if(props.user) {
        return (
            <div className="HomeModalWrapper">
                <div className="HomeModal">
                    {props.user.currentProvider === 'Google' ? <img id="google-pfp" src={props.user.profilePictures.google} referrerPolicy='no-referrer'/> : ''}
                    {props.user.currentProvider === 'Facebook' ? <img id="facebook-pfp" src={props.user.profilePictures.facebook} referrerPolicy='no-referrer'/> : ''}
                    {props.user.currentProvider === 'Github' ? <img id="github-pfp" src={props.user.profilePictures.github} referrerPolicy='no-referrer' /> : ''}
                    {props.user.currentProvider === 'Custom' && props.user.profilePictures.custom !== undefined ? <img id="custom-pfp" src={props.user.profilePictures.custom} crossOrigin='anonymous' /> : ''}
                    <h2 id="email-text">{props.user.email}</h2>
                    <h3 id="current-provider">Signed in with {props.user.currentProvider}</h3>
                    {props.user.currentProvider === 'Custom' ? 
                    <div className="profile-picture">
                        <input type="file" onChange={setImageHandler} />
                    </div> : ''}
                    {props.user.currentProvider === 'Custom' ? <button id="submit-pfp" onClick={profilePicHandler}>Submit Profile Picture</button> : ''}
                    <button onClick={logout} id="logout-btn" className={props.user.currentProvider === 'Custom' ? 'custom-btn' : ''}>Logout</button>
                </div>
            </div>
        )
    } else {
        return false;
    }
}

export default HomeModal;