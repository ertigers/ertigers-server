const express = require('express');
const router = express.Router();
const userController = require("../controllers/user") 

// 用户操作
router.get('/login', userController.login);
router.get('/get', userController.getUser);

module.exports = router;
