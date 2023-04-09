import { Router } from 'express';

import { validateRequestBody } from '../../shared/middleware';
import { UserUpdateDetailValidator } from './validator';
import { deleteUser, searchUsers, updateUserDetails, userDetails } from './controller';

const router = Router();

router.get('/me', userDetails);
router.get('/search', searchUsers);
router.patch('/me', UserUpdateDetailValidator, validateRequestBody, updateUserDetails);
router.delete('/me', deleteUser);

export default router;
