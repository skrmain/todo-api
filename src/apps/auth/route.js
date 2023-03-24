const { Router } = require('express');

const { validateReqBody } = require('../../shared/middleware');
const authValidation = require('./validation');
const authController = require('./controller');

const router = Router();

router.post('/register', validateReqBody(authValidation.VRegisterSchema), authController.register);
router.post('/login', validateReqBody(authValidation.VLoginSchema), authController.login);
router.post('/token/refresh', validateReqBody(authValidation.VTokenRefreshSchema), authController.refreshAccessToken);

module.exports = router;
