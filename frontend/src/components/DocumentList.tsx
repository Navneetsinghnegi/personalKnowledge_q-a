import React, { useState, useEffect } from 'react';
import { documentApi, Document } from '../services/api';
import './DocumentList.css';

interface DocumentListProps {
  onDocumentChange: () => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ onDocumentChange }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentApi.getDocuments();
      setDocuments(data.documents);
      setError(null);
    } catch (err) {
      setError('Failed to load documents');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      setError('Only .txt files are allowed');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await documentApi.uploadDocument(file);
      await fetchDocuments();
      onDocumentChange();
      event.target.value = ''; // Reset file input
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to upload document');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentApi.deleteDocument(id);
      await fetchDocuments();
      onDocumentChange();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete document');
      console.error(err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="document-list">
      <div className="document-list-header">
        <h2>My Documents</h2>
        <label className="upload-button">
          <input
            type="file"
            accept=".txt"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: 'none' }}
          />
          {uploading ? 'Uploading...' : '+ Upload Document'}
        </label>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="empty-state">
          <p>No documents yet. Upload a .txt file to get started!</p>
        </div>
      ) : (
        <div className="documents">
          {documents.map((doc) => (
            <div key={doc.id} className="document-item">
              <div className="document-info">
                <div className="document-name">{doc.name}</div>
                <div className="document-meta">
                  {formatFileSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                </div>
              </div>
              <button
                className="delete-button"
                onClick={() => handleDelete(doc.id)}
                title="Delete document"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;
