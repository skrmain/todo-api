import formidable from "formidable";

export interface FileInfoType {
  size: number;
  newFilename: string;
  filepath?: string;
  mimetype: string | null;
  mtime: Date | string | null | undefined;
  originalFilename: string | null;
}

export interface FormidableFieldFileType {
  fields: formidable.Fields;
  files: formidable.Files;
}
