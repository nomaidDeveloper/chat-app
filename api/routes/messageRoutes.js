const express = require('express');
const {
    addMessage,
    getMessages,
} = require('../controllers/messageController'); // Assuming Sequelize modifications are in messageControllerSequelize
const verifyToken = require('../utils/auth');

const router = express.Router();

router.post('/addmsg/', verifyToken,addMessage);
router.post('/getmsg/',verifyToken, getMessages);

module.exports = router;
