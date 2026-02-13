# 🚀 Quick Start Guide

Follow these steps to get your Private Knowledge Q&A app running in minutes!

## Step 1: Prerequisites Check ✅

Make sure you have:
- [ ] Node.js (v16+) installed - Check with `node --version`
- [ ] MongoDB installed and running - Check with `mongod --version`
- [ ] Anthropic API key from [console.anthropic.com](https://console.anthropic.com/)

## Step 2: MongoDB Setup 🗄️

### Option A: Local MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Windows
# MongoDB should start automatically as a service
```

### Option B: MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Whitelist your IP address

## Step 3: Backend Setup 🔧

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file and add your keys:
# For macOS/Linux:
nano .env

# For Windows:
notepad .env
```

**Edit these values in .env:**
```
MONGODB_URI=mongodb://localhost:27017/private-knowledge-qa
ANTHROPIC_API_KEY=sk-ant-xxxxx  # Your actual API key here
```

**Start the backend:**
```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server is running on port 5000
```

## Step 4: Frontend Setup 🎨

**Open a NEW terminal window**, then:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Your browser should automatically open to `http://localhost:3000`

## Step 5: Test It Out! 🎉

1. **Upload a Document**
   - Click "+ Upload Document"
   - Select one of the sample documents from `sample-documents/` folder
   - Or create your own .txt file

2. **Ask a Question**
   - Type: "What is machine learning?"
   - Click "Ask"
   - Wait for the AI to respond

3. **View Sources**
   - Scroll down to see which documents were used
   - Check the excerpts that supported the answer

## Troubleshooting 🔍

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
# macOS:
brew services list

# Linux:
sudo systemctl status mongod

# If not running, start it:
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### "Failed to get answer from AI"
- Double-check your `ANTHROPIC_API_KEY` in `backend/.env`
- Make sure the key starts with `sk-ant-`
- Verify you have API credits at [console.anthropic.com](https://console.anthropic.com/)

### Port already in use
```bash
# Backend (port 5000)
lsof -ti:5000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5000   # Windows (then kill the PID)

# Frontend (port 3000)
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000   # Windows (then kill the PID)
```

### Module not found errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## What's Next? 📚

- Upload more documents (try the sample documents provided!)
- Ask different types of questions
- Explore the source citations
- Check out the full README.md for advanced features

## Common Commands Reference

### Backend
```bash
npm run dev    # Start development server with hot reload
npm run build  # Build TypeScript to JavaScript
npm start      # Run production build
```

### Frontend
```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

## Need Help? 💬

1. Check the main README.md for detailed documentation
2. Review the troubleshooting section
3. Check that all environment variables are set correctly
4. Ensure all dependencies are installed

---

**Ready to go? Let's build something amazing! 🚀**
