import { Database } from '../../shared/database';
import { TodoModel } from './model';

class TodoService<T> extends Database<T> {}

export default new TodoService(TodoModel);
