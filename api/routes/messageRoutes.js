const express = require('express');
const {
    addMessage,
    getMessages,
} = require('../controllers/messageController'); // Assuming Sequelize modifications are in messageControllerSequelize

const router = express.Router();

router.post('/addmsg/', addMessage);
router.post('/getmsg/', getMessages);

module.exports = router;
