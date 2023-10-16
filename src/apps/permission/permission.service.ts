import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';

import { PermissionModel } from './permission.models';

class PermissionService<T> extends MongooseOperationsWrapper<T> {}

export default new PermissionService(PermissionModel);
