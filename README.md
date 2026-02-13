# 📚 Private Knowledge Q&A

A full-stack MERN + TypeScript application that allows you to upload documents and ask questions about them using AI.
--
Live Link: https://personal-knowledge-q-a.vercel.app
## 🌟 Features

- **Document Upload**: Upload text files (.txt) to your personal knowledge base
- **Document Management**: View all uploaded documents with metadata (name, size, upload date)
- **AI-Powered Q&A**: Ask questions and get answers based on your documents
- **Source Citations**: See which documents and specific excerpts were used to answer your questions
- **Clean UI**: Modern, responsive interface built with React and TypeScript

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express** - Server framework
- **TypeScript** - Type safety
- **MongoDB** + **Mongoose** - Database
- **Multer** - File upload handling
- **Huggingface Inference API** - mistralai/Mistral-7B-Instruct-v0.2

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **CSS3** - Styling

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (v5 or higher) - running locally or a MongoDB Atlas account
- **Huggingface Access Token** - Get one from https://huggingface.co/settings/tokens

## 🚀 Installation & Setup

### 1. Clone or Download the Project

```bash
cd private-knowledge-qa
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your credentials:
# - ANTHROPIC_API_KEY=your_actual_api_key
# - MONGODB_URI=your_mongodb_connection_string
```

**Important**: Make sure MongoDB is running! 

For local MongoDB:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod

# On Windows
# MongoDB runs as a service automatically after installation
```

For MongoDB Atlas, get your connection string from the Atlas dashboard.

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

## 🎮 Running the Application

You need to run both backend and frontend servers.

### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Terminal 2: Start Frontend

```bash
cd frontend
npm start
```

Frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📖 How to Use

1. **Upload Documents**
   - Click the "+ Upload Document" button
   - Select a .txt file from your computer
   - The document will appear in the list

2. **Ask Questions**
   - Type your question in the text area
   - Click "Ask" button
   - Wait for the AI to analyze your documents and provide an answer

3. **View Sources**
   - After receiving an answer, scroll down to see the "Sources" section
   - Each source shows which document was used and the relevant excerpt

4. **Manage Documents**
   - View all your uploaded documents in the sidebar
   - Delete documents by clicking the 🗑️ icon

## 📁 Project Structure

```
private-knowledge-qa/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── Document.ts          # Document schema
│   │   │   └── QAHistory.ts         # Q&A history schema
│   │   ├── routes/
│   │   │   ├── documents.ts         # Document CRUD endpoints
│   │   │   └── qa.ts                # Q&A endpoints
│   │   ├── services/
│   │   │   └── aiService.ts         # Claude API integration
│   │   └── server.ts                # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentList.tsx     # Document management UI
│   │   │   ├── DocumentList.css
│   │   │   ├── QAInterface.tsx      # Q&A interface
│   │   │   └── QAInterface.css
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── App.tsx                  # Main app component
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## 🔌 API Endpoints

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - Get all documents
- `GET /api/documents/:id` - Get single document
- `DELETE /api/documents/:id` - Delete a document

### Q&A
- `POST /api/qa/ask` - Ask a question
- `GET /api/qa/history` - Get Q&A history

## 🔧 Configuration Options

### Using OpenAI Instead of Claude

If you prefer to use OpenAI, modify `backend/src/services/aiService.ts`:

```typescript
// Install OpenAI SDK
npm install openai

// Replace Anthropic client with OpenAI client
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Update the askQuestion function to use OpenAI's API
```

### Changing Port Numbers

**Backend** - Edit `backend/.env`:
```
PORT=5000
```

**Frontend** - Edit `frontend/package.json`:
```json
"proxy": "http://localhost:5000"
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Error**: `MongooseError: Could not connect to MongoDB`

**Solution**:
- Ensure MongoDB is running: `brew services list` (macOS) or `sudo systemctl status mongod` (Linux)
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### API Key Issues

**Error**: `Failed to get answer from AI`

**Solution**:
- Verify your `ANTHROPIC_API_KEY` is correct in `backend/.env`
- Check you have API credits: [console.anthropic.com](https://console.anthropic.com/)
- Ensure `.env` file is in the `backend` folder

### CORS Issues

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: The backend already has CORS enabled, but ensure:
- Backend is running on port 5000
- Frontend proxy is configured in `package.json`

### File Upload Issues

**Error**: `Only .txt files are allowed`

**Solution**: Currently only `.txt` files are supported. To support other formats, modify:
- `backend/src/routes/documents.ts` - Update the `fileFilter` function
- Add appropriate parsing logic for different file types

## 🚀 Production Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)

1. Build TypeScript:
```bash
npm run build
```

2. Set environment variables on your platform
3. Ensure MongoDB URI points to production database
4. Deploy the `dist` folder

### Frontend Deployment (e.g., Vercel, Netlify)

1. Build React app:
```bash
npm run build
```

2. Deploy the `build` folder
3. Update API base URL in `frontend/src/services/api.ts` to point to production backend

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements!

## 💡 Future Enhancements

- Support for PDF, DOCX, and other document formats
- Vector database integration for better semantic search
- Multi-user support with authentication
- Document categorization and tags
- Export Q&A history
- Advanced search and filtering

## 📧 Support

If you encounter any issues, please check the troubleshooting section or create an issue in the repository.

---

**Built with ❤️ using MERN Stack + TypeScript**
