export const parseUserNote = (note: any) => ({
    _id: note.noteId?._id,
    title: note.noteId?.title,
    detail: note.noteId?.detail,
    status: note.noteId?.status,
    createdAt: note.noteId?.createdAt,
    updateAt: note.noteId?.updatedAt,
    permissions: note.permissions,
});

export const parseUserNotes = (notes: any[]) => notes.map(parseUserNote);
