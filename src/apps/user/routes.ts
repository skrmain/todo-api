import { Router } from 'express';

import { MyRequest, MyResponse } from '../../shared/types';
import { sendFailResponse, sendSuccessResponse } from '../../shared/utils';

const router = Router();

router.get('/', async (req: MyRequest, res: MyResponse) => {
  try {
    sendSuccessResponse(res, {
      data: { user: req.user },
      message: 'User Detail',
    });
  } catch (error: any) {
    sendFailResponse(res, {
      error: error.toString(),
      message: 'Try Login Again',
    });
  }
});

export default router;
