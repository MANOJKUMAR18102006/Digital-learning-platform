import Document from '../models/Document.js';
import Flashcard from '../models/Flashcard.js';
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/groqService.js';
import { findRelevantChunks } from '../utils/textChunker.js';
import { awardXP, XP_RULES } from '../utils/gamification.js';
import { logActivity } from '../utils/activityLogger.js';


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
            message: 'Flashcards generated successfully. XP awarded!'
        });

        // Award XP
        await awardXP(req.user._id, XP_RULES.FLASHCARD_REVIEW);
        
        // Log Activity
        await logActivity({
            userId: req.user._id,
            type: 'flashcards_gen',
            description: `Generated a set of flashcards for ${document.title}`,
            link: `/documents/${document._id}`
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

// ================= STUDY PLAN =================
export const generateStudyPlan = async (req, res, next) => {
    try {
        const { documentId, hours, weakTopics, strongTopics, examDate, performanceData, nDays } = req.body;

        let documentText = '';
        if (documentId) {
            const document = await Document.findOne({ _id: documentId, userId: req.user._id });
            if (document) {
                documentText = normalizeText(document.extractedText);
            }
        }

        const studyPlan = await geminiService.generateStudyPlan({
            hours,
            weakTopics,
            strongTopics,
            examDate,
            performanceData,
            nDays,
            documentText // Pass the actual PDF content
        });

        res.status(200).json({
            success: true,
            data: studyPlan,
            message: 'Study plan generated successfully'
        });

        // Log Activity
        await logActivity({
            userId: req.user._id,
            type: 'studyplan_gen',
            description: `Architected a study plan for ${document?.title || 'Document'}`,
            link: `/study-plan`
        });

    } catch (error) {
        console.error("❌ Study Plan Error:", error);
        next(error);
    }
};

// ================= QUIZ ANALYSIS =================
export const analyzeQuiz = async (req, res, next) => {
    try {
        const { quizData } = req.body;

        const analysis = await geminiService.analyzeQuizResults(quizData);

        res.status(200).json({
            success: true,
            data: analysis,
            message: 'Quiz analysis generated successfully'
        });

    } catch (error) {
        console.error("❌ Quiz Analysis Error:", error);
        next(error);
    }
};

// ================= SPOKEN EXPLANATION =================
export const explainSpoken = async (req, res, next) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: 'Text is required' });
        }

        const explanation = await geminiService.generateSpokenExplanation(text);

        res.status(200).json({
            success: true,
            data: explanation,
            message: 'Spoken explanation generated successfully'
        });

    } catch (error) {
        console.error("❌ Spoken Explanation Error:", error);
        next(error);
    }
};

// ================= STUDY NOTES =================
export const generateNotes = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({ success: false, error: 'Please provide documentId' });
        }

        const { document, error } = await checkDocument(documentId, req.user._id);

        if (error) {
            return res.status(404).json({ success: false, error });
        }

        const cleanText = normalizeText(document.extractedText);
        const notes = await geminiService.generateStudyNotes(cleanText);

        res.status(200).json({
            success: true,
            data: notes,
            message: 'Study notes generated successfully. XP awarded!'
        });

        // Award XP
        await awardXP(req.user._id, XP_RULES.STUDY_NOTE_GEN);

        // Log Activity
        await logActivity({
            userId: req.user._id,
            type: 'notes_gen',
            description: `Created structured study notes for ${document.title}`,
            link: `/documents/${document._id}`
        });

    } catch (error) {
        console.error("❌ Study Notes Error:", error);
        next(error);
    }
};

// ================= MIND MAP =================
export const generateMindmap = async (req, res, next) => {
    try {
        const { documentId } = req.body;

        if (!documentId) {
            return res.status(400).json({ success: false, error: 'Please provide documentId' });
        }

        const { document, error } = await checkDocument(documentId, req.user._id);

        if (error) {
            return res.status(404).json({ success: false, error });
        }

        const cleanText = normalizeText(document.extractedText);
        const mindmap = await geminiService.generateMindMap(cleanText);

        res.status(200).json({
            success: true,
            data: mindmap,
            message: 'Mind map generated successfully. XP awarded!'
        });

        // Award XP
        await awardXP(req.user._id, XP_RULES.MINDMAP_GEN);

        // Log Activity
        await logActivity({
            userId: req.user._id,
            type: 'mindmap_gen',
            description: `Generated a structural mind map for ${document.title}`,
            link: `/documents/${document._id}`
        });

    } catch (error) {
        console.error("❌ Mind Map Error:", error);
        next(error);
    }
};

// ================= PERFORMANCE ANALYSIS =================
export const analyzePerformance = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Fetch quiz results for this user
        const quizResults = await Quiz.find({ userId }).select('score totalQuestions createdAt title').sort({ createdAt: -1 }).limit(10);
        
        // Fetch document count
        const docCount = await Document.countDocuments({ userId });

        // Basic productivity data
        const analysisData = {
            quizResults,
            docCount,
            activityCount: quizResults.length + docCount
        };

        const analysis = await geminiService.analyzeOverallPerformance(analysisData);

        res.status(200).json({
            success: true,
            data: analysis,
            message: 'Performance analysis completed'
        });

    } catch (error) {
        console.error("❌ Performance Analysis Error:", error);
        next(error);
    }
};