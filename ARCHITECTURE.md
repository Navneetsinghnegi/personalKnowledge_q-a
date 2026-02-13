# Architecture Overview

## System Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP/HTTPS
       │
┌──────▼──────┐
│   React     │
│  Frontend   │◄──── TypeScript
└──────┬──────┘
       │ REST API
       │
┌──────▼──────┐
│   Express   │
│   Backend   │◄──── TypeScript + Node.js
└──┬───────┬──┘
   │       │
   │       └────────┐
   │                │
┌──▼──────┐   ┌────▼─────┐
│ MongoDB │   │ Claude   │
│Database │   │   API    │
└─────────┘   └──────────┘
```

## Component Breakdown

### Frontend Layer (React + TypeScript)

**Components:**
- `App.tsx`: Main application component, manages global state
- `DocumentList.tsx`: Handles document upload, display, and deletion
- `QAInterface.tsx`: Q&A input and response display

**Services:**
- `api.ts`: Centralized API client using Axios

**Flow:**
1. User uploads document → API call → Document stored in MongoDB
2. User asks question → API call → Backend processes with Claude
3. Response displayed with sources highlighted

### Backend Layer (Express + TypeScript)

**Routes:**
- `/api/documents/*`: Document CRUD operations
- `/api/qa/*`: Question answering and history

**Models:**
- `Document`: Stores document metadata and content
- `QAHistory`: Stores questions, answers, and sources

**Services:**
- `aiService.ts`: Handles Claude API integration

**Flow:**
1. Receive document upload → Parse text → Store in MongoDB
2. Receive question → Fetch relevant documents → Send to Claude API
3. Parse AI response → Extract sources → Save to history → Return to frontend

### Database Layer (MongoDB)

**Collections:**

`documents`:
```javascript
{
  _id: ObjectId,
  name: String,
  content: String,
  uploadedAt: Date,
  fileSize: Number
}
```

`qahistories`:
```javascript
{
  _id: ObjectId,
  question: String,
  answer: String,
  sources: [{
    documentId: String,
    documentName: String,
    excerpt: String
  }],
  askedAt: Date
}
```

### External API (Anthropic Claude)

**Integration:**
- Uses `@anthropic-ai/sdk` npm package
- Model: `claude-sonnet-4-20250514`
- Sends document context + question
- Receives structured JSON response with answer and sources

## Data Flow

### Document Upload Flow
```
User selects file
    ↓
Frontend validates (.txt only)
    ↓
FormData sent to /api/documents/upload
    ↓
Multer processes file upload
    ↓
File content extracted
    ↓
Document saved to MongoDB
    ↓
Response sent to frontend
    ↓
Document list refreshed
```

### Question Answering Flow
```
User enters question
    ↓
POST /api/qa/ask
    ↓
Backend fetches all documents
    ↓
Documents + question sent to Claude API
    ↓
Claude analyzes and responds
    ↓
Response parsed (answer + sources)
    ↓
Saved to QAHistory collection
    ↓
Response sent to frontend
    ↓
Answer and sources displayed
```

## Security Considerations

1. **API Key Protection**: Stored in `.env`, never committed to version control
2. **File Upload Validation**: Only .txt files, 10MB size limit
3. **CORS**: Configured to allow frontend access
4. **Input Validation**: All user inputs validated before processing
5. **Error Handling**: Proper try-catch blocks, no sensitive data in errors

## Scalability Considerations

### Current Limitations:
- All documents sent to AI for each question (works well for <10 documents)
- In-memory processing (no caching)
- Single server architecture

### Future Improvements:
- Vector database (e.g., Pinecone, Weaviate) for semantic search
- Document chunking for large files
- Caching frequently asked questions
- Horizontal scaling with load balancer
- File storage in S3/GridFS for large documents
- Rate limiting and request queuing

## Technology Choices Rationale

**Why MERN Stack?**
- Full JavaScript ecosystem
- Large community and resources
- Rapid development
- Good performance for this use case

**Why TypeScript?**
- Type safety reduces bugs
- Better IDE support
- Self-documenting code
- Easier refactoring

**Why MongoDB?**
- Flexible schema for documents
- Native JSON support
- Easy to scale horizontally
- Good fit for unstructured text data

**Why Anthropic Claude?**
- Excellent at understanding and answering questions
- Good at following structured output instructions
- Strong reasoning capabilities
- Reliable citation generation

## Performance Optimization

1. **Frontend:**
   - React hooks for efficient re-renders
   - Lazy loading for large document lists
   - Debouncing for search inputs

2. **Backend:**
   - Async/await for non-blocking operations
   - Connection pooling for MongoDB
   - Request validation to fail fast

3. **Database:**
   - Indexes on frequently queried fields
   - Lean queries (only fetch needed fields)
   - Pagination for large result sets

## Error Handling Strategy

**Frontend:**
- User-friendly error messages
- Loading states for async operations
- Form validation before submission

**Backend:**
- Try-catch blocks for all async operations
- Proper HTTP status codes
- Logging for debugging

**Database:**
- Connection error handling
- Validation at schema level
- Graceful degradation

## Testing Strategy

**Unit Tests:**
- API service functions
- Helper functions
- Model validation

**Integration Tests:**
- API endpoints
- Database operations
- AI service integration

**E2E Tests:**
- User workflows
- Document upload and Q&A flow
- Error scenarios

## Monitoring and Logging

**Recommended Tools:**
- Winston for backend logging
- MongoDB Atlas monitoring
- PM2 for process management
- Error tracking with Sentry

## Deployment Architecture

**Development:**
```
Local MongoDB → Express (port 5000) → React (port 3000)
```

**Production:**
```
MongoDB Atlas → Express (Railway/Render) → React (Vercel/Netlify)
                       ↓
                  Claude API
```

## Environment Variables

**Backend (.env):**
```
PORT=5000
MONGODB_URI=<connection_string>
ANTHROPIC_API_KEY=<api_key>
NODE_ENV=development|production
```

**Frontend:**
Proxy configured in package.json for development
API URL set at build time for production

## API Documentation

See `README.md` for detailed API endpoint documentation.

## Future Architecture Considerations

1. **Microservices**: Separate document processing, Q&A, and user management
2. **Message Queue**: RabbitMQ/Redis for handling async tasks
3. **Caching Layer**: Redis for frequently accessed data
4. **CDN**: For static assets and document previews
5. **Authentication**: JWT-based auth for multi-user support
6. **WebSockets**: Real-time updates for collaborative features
