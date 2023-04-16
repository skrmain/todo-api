import { Database } from '../../shared/database';
import { NoteModel } from './model';

class NoteService<T> extends Database<T> {}

export default new NoteService(NoteModel);
