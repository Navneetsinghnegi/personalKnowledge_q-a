import axios from 'axios';

const API_BASE_URL = 'https://personalknowledge-q-a.onrender.com/api';

export interface Document {
  id: string;
  name: string;
  uploadedAt: string;
  fileSize: number;
}

export interface DocumentDetail extends Document {
  content: string;
}

export interface Source {
  documentId: string;
  documentName: string;
  excerpt: string;
}

export interface QAResponse {
  id: string;
  question: string;
  answer: string;
  sources: Source[];
  askedAt: string;
}

export const documentApi = {
  // Upload a document
  uploadDocument: async (file: File): Promise<{ document: Document }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get all documents
  getDocuments: async (): Promise<{ documents: Document[] }> => {
    const response = await axios.get(`${API_BASE_URL}/documents`);
    return response.data;
  },

  // Get single document
  getDocument: async (id: string): Promise<DocumentDetail> => {
    const response = await axios.get(`${API_BASE_URL}/documents/${id}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/documents/${id}`);
  },
};

export const qaApi = {
  // Ask a question
  askQuestion: async (question: string): Promise<QAResponse> => {
    const response = await axios.post(`${API_BASE_URL}/qa/ask`, { question });
    return response.data;
  },

  // Get QA history
  getHistory: async (): Promise<{ history: QAResponse[] }> => {
    const response = await axios.get(`${API_BASE_URL}/qa/history`);
    return response.data;
  },
};
