import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IDocument extends MongoDocument {
  name: string;
  content: string;
  uploadedAt: Date;
  fileSize: number;
}

const DocumentSchema: Schema = new Schema({
  name: { type: String, required: true },
  content: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  fileSize: { type: Number, required: true }
});

export default mongoose.model<IDocument>('Document', DocumentSchema);
