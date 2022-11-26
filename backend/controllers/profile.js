const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

exports.updateProfilePicture = async(req, res, next) => {
    try {
        const token = req.header('authorization').split(' ')[1];
        const decoded = jwt.verify(token, req.session.userSecret);
        if(!decoded) {
            return;
        }
        if(!req.file) {
            res.status(200).json({message: 'No files uploaded'})
            return;
        }
        const data = await User.findById(decoded.user_id);
        if(data.profilePictures.custom && data.profilePictures.custom !== 'http://localhost:5000/uploads/defaultpfp.jpg') {
            const fileName = data.profilePictures.custom.split('uploads/')[1];
            fs.unlinkSync(path.join(__dirname, '../', 'uploads/', fileName));
        }
        const fileLocation = `http://localhost:5000/uploads/${req.file.filename}`;
        data.profilePictures = {...data.profilePictures, custom: fileLocation};
        await data.save();
        res.status(200).json({file: fileLocation});
    } catch(e) {
        console.log(e);
        res.status(200).json({message: 'No files uploaded.'});
    }

}