const router = require('express').Router();
const AuthStatus = require('../middleware/isAuth');
const profileController = require('../controllers/profile')
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../', '/uploads'));
    },
    filename: (req, file, cb) => {
        const buffer = crypto.randomBytes(16)
        const fileName = `${buffer.toString('hex')}.${file.mimetype.split("/")[1]}`
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage });

router.post('/update-pic', AuthStatus.isAuth, upload.single('avatar'), profileController.updateProfilePicture);

module.exports = router;