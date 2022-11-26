import axios from 'axios';

export const postLogin = async(email, password) => {
    const token = localStorage.getItem('token');
    if(token === 'undefined') {
        const res = await axios.post('http://localhost:5000/auth/login', { email: email, password: password }, { withCredentials: true });
        return res;
    }
    const res = await axios.post('http://localhost:5000/auth/login', { email: email, password: password }, { withCredentials: true, headers: { 'Authorization': `Bearer ${token}`} });
    return res;
}

export const postSignup = async(email, password) => {
    const token = localStorage.getItem('token');
    if(token === 'undefined') {
        const res = await axios.post('http://localhost:5000/auth/signup', { email: email, password: password }, { withCredentials: true });
        return res;
    }
    const res = await axios.post('http://localhost:5000/auth/signup', { email: email, password: password }, { withCredentials: true, headers: {'Authorization': `Bearer ${token}`}})
    return res;
}

export const getUser = async(token) => {
    try {
        if(!token || token === 'undefined') {
            try {
                const res = await axios.get('http://localhost:5000/auth/passport/user', { withCredentials: true });
                return res;
            } catch(e) {
                return false;
            }
    
        }
        try {
            const res = await axios.get('http://localhost:5000/auth/user', { withCredentials: true, headers: { 'Authorization': `Bearer ${token}` }});
            return res;
        } catch(e) {
            return false;
        }
    } catch (e) {
        return false;
    }
}

export const postProfilePicture = async(token, formData) => {
    if(!token || token === 'undefined') {
        return;
    }
    const res = await axios.post('http://localhost:5000/profile/update-pic', formData, { withCredentials: true, headers: {'Authorization': `Bearer ${token}` } });
    return res;
}

export const postLogout = async(token) => {
    if(!token || token === 'undefined') {
        const res = await axios.post('http://localhost:5000/auth/passport/logout', { logout: true }, { withCredentials: true });
        return res;
    }
    const res = await axios.post('http://localhost:5000/auth/logout', { logout: true }, { withCredentials: true, headers: { 'Authorization': `Bearer ${token}` }});
    return res;
}