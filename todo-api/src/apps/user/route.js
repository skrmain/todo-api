const { Router } = require('express');

const userController = require('./controller');

const router = Router();

router.get('/search', userController.usersSearch);
router.get('/me', userController.userDetail);

module.exports = router;
