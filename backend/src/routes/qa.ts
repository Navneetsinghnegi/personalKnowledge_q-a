import express, { Request, Response } from 'express';
import Document from '../models/Document';
import QAHistory from '../models/QAHistory';
import { askQuestion } from '../services/aiService';

const router = express.Router();

// Ask a question
router.post('/ask', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    // Get all documents
    const documents = await Document.find();

    if (documents.length === 0) {
      return res.status(400).json({ 
        error: 'No documents available. Please upload documents first.' 
      });
    }

    // Prepare documents for AI
    const documentContexts = documents.map(doc => ({
      id: doc._id.toString(),
      name: doc.name,
      content: doc.content,
    }));

    // Get answer from AI
    const { answer, sources } = await askQuestion(question, documentContexts);

    // Save to history
    const qaHistory = new QAHistory({
      question,
      answer,
      sources,
    });

    await qaHistory.save();

    res.json({
      id: qaHistory._id,
      question,
      answer,
      sources,
      askedAt: qaHistory.askedAt,
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({ 
      error: 'Failed to get answer. Please check your API key and try again.' 
    });
  }
});

// Get QA history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await QAHistory.find()
      .sort({ askedAt: -1 })
      .limit(50);

    res.json({
      history: history.map(qa => ({
        id: qa._id,
        question: qa.question,
        answer: qa.answer,
        sources: qa.sources,
        askedAt: qa.askedAt,
      })),
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
