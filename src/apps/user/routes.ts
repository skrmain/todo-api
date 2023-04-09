import { Router } from 'express';

import { validateRequestBody } from '../../shared/middleware';
import { UserUpdateDetailValidator } from './validator';
import { deleteUser, updateUserDetails, userDetails } from './controller';

const router = Router();

router.get('/', userDetails);
router.patch('/', UserUpdateDetailValidator, validateRequestBody, updateUserDetails);
router.delete('/', deleteUser);

export default router;
