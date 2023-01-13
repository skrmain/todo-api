const { Router } = require('express');

const utils = require('../../shared/utils');
const userController = require('./user.controllers');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const user = await userController.getOne({ _id: req.user._id });
        return res.send(utils.successResponse({ data: user }));
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
