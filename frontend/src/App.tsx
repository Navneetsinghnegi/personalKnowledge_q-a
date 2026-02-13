import React, { useState, useEffect } from 'react';
import DocumentList from './components/DocumentList';
import QAInterface from './components/QAInterface';
import { documentApi } from './services/api';
import './App.css';

function App() {
  const [hasDocuments, setHasDocuments] = useState(false);

  const checkDocuments = async () => {
    try {
      const data = await documentApi.getDocuments();
      setHasDocuments((data?.documents?.length || 0) > 0);
    } catch (err) {
      console.error('Failed to check documents:', err);
    }
  };

  useEffect(() => {
    checkDocuments();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>📚 Private Knowledge Q&A</h1>
        <p>Upload your documents and ask questions about them</p>
      </header>

      <main className="app-main">
        <div className="sidebar">
          <DocumentList onDocumentChange={checkDocuments} />
        </div>
        
        <div className="main-content">
          <QAInterface hasDocuments={hasDocuments} />
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with MERN + TypeScript</p>
      </footer>
    </div>
  );
}

export default App;
