const express = require('express');
const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut,
} = require('../controllers/userController'); // Assuming Sequelize modifications are in userControllerSequelize
const verifyToken = require('../utils/auth');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/allusers/:id', verifyToken,getAllUsers);
router.post('/setavatar/:id',verifyToken, setAvatar);
router.get('/logout/:id',verifyToken, logOut);

module.exports = router;
