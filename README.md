# Digital Learning Platform

An AI-powered learning app that turns uploaded PDF documents into study materials. Users can upload documents, chat with their content, generate flashcards and quizzes with Gemini, and track learning progress from a dashboard.

## Features

- Secure authentication with register, login, profile, and password change flows
- PDF document upload, storage, and text extraction
- AI chat over document content with saved chat history
- Flashcard generation, review tracking, and starring
- Quiz generation, quiz taking, and results review
- Dashboard with learning statistics and recent activity
- Protected routes across the app

## Tech Stack

- Frontend: React 19, Vite, React Router, Axios, Tailwind CSS, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose
- AI: Google Gemini via the Google Gen AI SDKs
- File handling: Multer, PDF parsing, chunked text retrieval

## Project Structure

```text
backend/
	config/          Database and upload configuration
	controllers/     Route handlers for auth, documents, AI, flashcards, quizzes, progress
	middleware/      Auth and error handling
	models/          Mongoose models
	routes/          REST API routes
	uploads/         Stored document files
	utils/           PDF parsing, text chunking, Gemini helpers
frontend/
	src/
		components/    Reusable UI pieces
		context/       Authentication state
		pages/         Route pages
		services/      API wrappers
		utils/         Axios instance and API paths
```

## Main User Flows

1. Create an account or sign in.
2. Upload a PDF document from the Documents page.
3. Wait for the document to finish processing.
4. Open the document to chat with it, generate flashcards, generate a summary, or create a quiz.
5. Review flashcards, complete quizzes, and check progress from the dashboard.

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB connection string
- Google Gemini API key

## API Overview

The backend exposes these protected and public routes:

- `/api/auth` - register, login, profile management, password change
- `/api/documents` - upload, list, inspect, and delete documents
- `/api/ai` - generate flashcards, quizzes, summaries, explanations, and document chat
- `/api/flashcards` - retrieve, review, star, and delete flashcard sets
- `/api/quizzes` - retrieve quizzes, submit answers, and view results
- `/api/progress` - dashboard statistics and recent activity

## Notes

- Document uploads are stored under `backend/uploads/documents`.
- Most application routes require a valid JWT in the `Authorization` header.
- The frontend attaches the token automatically from local storage.
