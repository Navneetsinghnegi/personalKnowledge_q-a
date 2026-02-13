import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

interface ISource {
  documentId: string;
  documentName: string;
  excerpt: string;
}

export interface IQAHistory extends MongoDocument {
  question: string;
  answer: string;
  sources: ISource[];
  askedAt: Date;
}

const SourceSchema: Schema = new Schema({
  documentId: { type: String, required: true },
  documentName: { type: String, required: true },
  excerpt: { type: String, required: true }
}, { _id: false });

const QAHistorySchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  sources: [SourceSchema],
  askedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQAHistory>('QAHistory', QAHistorySchema);
