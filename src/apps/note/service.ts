import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';
import { NoteModel } from './model';

class NoteService<T> extends MongooseOperationsWrapper<T> {}

export default new NoteService(NoteModel);
