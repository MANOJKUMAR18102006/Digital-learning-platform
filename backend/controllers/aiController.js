import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/groqService.js';
import { findRelevantChunks } from '../utils/textChunker.js';


// 🔥 Normalize text (IMPORTANT FIX)
const normalizeText = (text) => {
    if (typeof text === "string") return text;
    if (Array.isArray(text)) return text.join(" ");
    if (typeof text === "object") return JSON.stringify(text);
    return "";
};


// 🔥 FIXED document checker
const checkDocument = async (documentId, userId) => {
    const document = await Document.findOne({ _id: documentId, userId });
    if (!document) return { error: 'Document not found' };
    if (document.status === 'processing') return { error: 'Document is still processing. Please wait.' };
    if (document.status === 'failed') return { error: 'Document processing failed. Please delete and re-upload.' };
    if (!document.extractedText) return { error: 'Document text not extracted. Please delete and re-upload.' };
    return { document };
};



// ================= FLASHCARDS =================
export const generateFlashcards = async (req, res, next) => {
    try {
        const { documentId, count = 10 } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId'
            });
        }

        const { document, error } = await checkDocument(documentId, req.user._id);

        if (error) {
            return res.status(404).json({ success: false, error });
        }

        const cleanText = normalizeText(document.extractedText);

        const cards = await geminiService.generateFlashcards(cleanText, parseInt(count));

        const flashcardSet = await Flashcard.create({
            userId: req.user._id,
            documentId: document._id,
            cards: cards.map(card => ({
                question: card.question,
                answer: card.answer,
                difficulty: card.difficulty || 'medium',
                reviewCount: 0,
                isStarred: false
            }))
        });

        res.status(201).json({
            success: true,
            data: flashcardSet,
            message: 'Flashcards generated successfully'
        });

    } catch (error) {
        console.error("❌ Flashcard Error:", error);
        next(error);
    }
};



// ================= QUIZ =================
export const generateQuiz = async (req, res, next) => {
    try {
        const { documentId, numQuestions = 5, title } = req.body;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId'
            });
        }

        const { document, error } = await checkDocument(documentId, req.user._id);

        if (error) {
            return res.status(404).json({ success: false, error });
        }

        const cleanText = normalizeText(document.extractedText);

        const questions = await geminiService.generateQuiz(cleanText, parseInt(numQuestions));

        const quiz = await Quiz.create({
            userId: req.user._id,
            documentId: document._id,
            title: title || `${document.title} - Quiz`,
            questions,
            totalQuestions: questions.length,
            userAnswers: [],
            score: 0
        });

        res.status(201).json({
            success: true,
            data: quiz,
            message: 'Quiz generated successfully'
        });

    } catch (error) {
        console.error("❌ Quiz Error:", error);
        next(error);
    }
};



// ================= SUMMARY =================
export const generateSummary = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        console.log("📄 documentId:", documentId);
        console.log("👤 userId:", req.user._id);

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId'
            });
        }

        const { document, error } = await checkDocument(documentId, req.user._id);

        console.log("CHECK RESULT:", { document, error });

        if (error) {
            return res.status(404).json({ success: false, error });
        }

        const cleanText = normalizeText(document.extractedText);

        console.log("🚀 Calling Gemini...");

        const summary = await geminiService.generateSummary(cleanText);

        console.log("✅ Gemini responded");

        res.status(200).json({
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                summary
            },
            message: 'Summary generated successfully'
        });

    } catch (error) {
        console.error("❌ Summary Error:", error);
        next(error);
    }
};



// ================= CHAT =================
export const chat = async (req, res, next) => {
    try {
        const { documentId, question } = req.body;

        if (!documentId || !question) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId and question'
            });
        }

        const document = await Document.findOne({
            _id: documentId,
            userId: req.user._id
        });

        if (!document) {
            return res.status(404).json({
                success: false,
                error: 'Document not found'
            });
        }

        const relevantChunks = findRelevantChunks(document.chunks || [], question, 3);
        const chunkIndexes = relevantChunks.map(c => c.chunkIndex);

        let chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId: document._id
        });

        if (!chatHistory) {
            chatHistory = await ChatHistory.create({
                userId: req.user._id,
                documentId: document._id,
                messages: []
            });
        }

        const answer = await geminiService.chatWithContext(question, relevantChunks);

        chatHistory.messages.push(
            { role: 'user', content: question },
            { role: 'assistant', content: answer }
        );

        await chatHistory.save();

        res.status(200).json({
            success: true,
            data: {
                question,
                answer,
                relevantChunks: chunkIndexes,
                chatHistoryId: chatHistory._id
            }
        });

    } catch (error) {
        console.error("❌ Chat Error:", error);
        next(error);
    }
};



// ================= EXPLAIN =================
export const explainConcept = async (req, res, next) => {
    try {
        const { documentId, concept } = req.body;

        if (!documentId || !concept) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId and concept'
            });
        }

        const { document, error } = await checkDocument(documentId, req.user._id);

        if (error) {
            return res.status(404).json({ success: false, error });
        }

        const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
        const context = relevantChunks.map(c => c.content).join('\n\n');

        const explanation = await geminiService.explainConcept(concept, context);

        res.status(200).json({
            success: true,
            data: {
                concept,
                explanation,
                relevantChunks: relevantChunks.map(c => c.chunkIndex)
            }
        });

    } catch (error) {
        console.error("❌ Explain Error:", error);
        next(error);
    }
};



// ================= CHAT HISTORY =================
export const getChatHistory = async (req, res, next) => {
    try {
        const { documentId } = req.params;

        if (!documentId) {
            return res.status(400).json({
                success: false,
                error: 'Please provide documentId'
            });
        }

        const chatHistory = await ChatHistory.findOne({
            userId: req.user._id,
            documentId
        }).select('messages');

        if (!chatHistory) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        res.status(200).json({
            success: true,
            data: chatHistory.messages
        });

    } catch (error) {
        next(error);
    }
};