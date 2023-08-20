import { MongooseOperationsWrapper } from '../../shared/mongoose-operations-wrapper';
import { NoteModel } from './note.models';

class NoteService<T> extends MongooseOperationsWrapper<T> {}

export default new NoteService(NoteModel);
