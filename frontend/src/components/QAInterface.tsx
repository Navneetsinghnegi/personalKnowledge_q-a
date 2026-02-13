import React, { useState } from 'react';
import { qaApi, QAResponse } from '../services/api';
import './QAInterface.css';

interface QAInterfaceProps {
  hasDocuments: boolean;
}

const QAInterface: React.FC<QAInterfaceProps> = ({ hasDocuments }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<QAResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    if (!hasDocuments) {
      setError('Please upload at least one document before asking questions');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await qaApi.askQuestion(question.trim());
      setCurrentAnswer(response);
      setQuestion('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to get answer. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qa-interface">
      <h2>Ask a Question</h2>
      
      <form onSubmit={handleSubmit} className="question-form">
        <div className="input-wrapper">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={
              hasDocuments 
                ? "Ask anything about your documents..." 
                : "Upload documents first to ask questions"
            }
            disabled={!hasDocuments || loading}
            rows={3}
            className="question-input"
          />
          <button 
            type="submit" 
            disabled={!hasDocuments || loading || !question.trim()}
            className="ask-button"
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {currentAnswer && (
        <div className="answer-section">
          <div className="question-display">
            <strong>Q:</strong> {currentAnswer.question}
          </div>
          
          <div className="answer-display">
            <strong>A:</strong> {currentAnswer.answer}
          </div>

          {currentAnswer.sources && currentAnswer.sources.length > 0 && (
            <div className="sources-section">
              <h3>Sources</h3>
              <div className="sources-list">
                {currentAnswer.sources.map((source, index) => (
                  <div key={index} className="source-item">
                    <div className="source-header">
                      📄 {source.documentName}
                    </div>
                    <div className="source-excerpt">
                      "{source.excerpt}"
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QAInterface;
