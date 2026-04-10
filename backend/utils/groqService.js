import Groq from 'groq-sdk';

let groq;
const getClient = () => {
    if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return groq;
};

const generate = async (prompt) => {
    const response = await getClient().chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
};

export const generateFlashcards = async (text, count = 10) => {
    try {
        const prompt = `Generate exactly ${count} educational flashcards from the following text.
Format each flashcard as:
Q: [Clear, specific question]
A: [Concise, accurate answer]
D: [Difficulty level: easy, medium, or hard]

Separate each flashcard with "~~"

Text:
${text.substring(0, 1500)}`;

        const generatedText = await generate(prompt);
        const flashcards = [];
        const cards = generatedText.split('~~').filter(c => c.trim());

        for (const card of cards) {
            const lines = card.trim().split('\n');
            let question = '', answer = '', difficulty = 'medium';
            for (const line of lines) {
                if (line.startsWith('Q:')) question = line.substring(2).trim();
                else if (line.startsWith('A:')) answer = line.substring(2).trim();
                else if (line.startsWith('D:')) difficulty = line.substring(2).trim().toLowerCase();
            }
            if (question && answer) flashcards.push({ question, answer, difficulty });
        }
        return flashcards;
    } catch (error) {
        console.error('Groq generateFlashcards error:', error);
        throw new Error('Failed to generate flashcards');
    }
};

export const generateQuiz = async (text, numQuestions = 5) => {
    try {
        const prompt = `Generate exactly ${numQuestions} multiple choice questions from the following text.
Format each question as:
Q: [Question]
O1: [Option 1]
O2: [Option 2]
O3: [Option 3]
O4: [Option 4]
C: [Correct option - exactly as written above]
E: [Brief explanation]
D: [Difficulty: easy, medium, or hard]

Separate questions with "----"

Text:
${text.substring(0, 2000)}`;

        const generatedText = await generate(prompt);
        const questions = [];
        const questionBlocks = generatedText.split('----').filter(q => q.trim());

        for (const block of questionBlocks) {
            const lines = block.trim().split('\n');
            let question = '', options = [], correctAnswerLabel = '', correctAnswerText = '', explanation = '', difficulty = 'medium';
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.startsWith('Q:')) {
                    question = trimmed.substring(2).trim();
                } else if (trimmed.match(/^(?:O\d+|[1-4]\.|[A-D]\))[:\.\)]/i)) {
                    // Match O1:, 1., A) etc.
                    const optionText = trimmed.replace(/^(?:O\d+|[1-4]\.|[A-D]\))[:\.\)]\s*/i, '').trim();
                    if (options.length < 4) options.push(optionText);
                } else if (trimmed.startsWith('C:')) {
                    correctAnswerText = trimmed.substring(2).trim();
                    // Check if it's a label like O1, 1, A
                    const labelMatch = correctAnswerText.match(/^(?:O(\d)|(\d)|([A-D]))$/i);
                    if (labelMatch) {
                        const idx = labelMatch[1] ? parseInt(labelMatch[1]) - 1 : 
                                  labelMatch[2] ? parseInt(labelMatch[2]) - 1 :
                                  labelMatch[3] ? labelMatch[3].toUpperCase().charCodeAt(0) - 65 : -1;
                        if (idx >= 0 && idx < 4) {
                            correctAnswerLabel = `O${idx + 1}`;
                        }
                    }
                } else if (trimmed.startsWith('E:')) {
                    explanation = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if (['easy', 'medium', 'hard'].includes(diff)) difficulty = diff;
                }
            }

            // Resolve correct answer text if it was a label, or vice-versa
            let finalCorrectAnswer = correctAnswerText;
            if (correctAnswerLabel) {
                 const idx = parseInt(correctAnswerLabel.substring(1)) - 1;
                 if (options[idx]) finalCorrectAnswer = options[idx];
            } else {
                // If the LLM returned text, try to find it in options to normalize
                const foundIdx = options.findIndex(opt => 
                    opt.toLowerCase().trim() === correctAnswerText.toLowerCase().trim() ||
                    correctAnswerText.toLowerCase().trim().includes(opt.toLowerCase().trim())
                );
                if (foundIdx !== -1) finalCorrectAnswer = options[foundIdx];
            }

            if (question && options.length === 4 && finalCorrectAnswer) {
                questions.push({ question, options, correctAnswer: finalCorrectAnswer, explanation, difficulty });
            }
        }
        return questions.slice(0, numQuestions);
    } catch (error) {
        console.error('Groq generateQuiz error:', error);
        throw new Error('Failed to generate quiz');
    }
};

export const generateSummary = async (text) => {
    try {
        const prompt = `Provide a concise summary of the following text, highlighting the key concepts and main ideas:\n\n${text.substring(0, 2000)}`;
        return await generate(prompt);
    } catch (error) {
        console.error('Groq generateSummary error:', error);
        throw new Error('Failed to generate summary');
    }
};

export const chatWithContext = async (question, chunks) => {
    try {
        const context = chunks.map(chunk => chunk.content).join(' ');
        const prompt = `Based on the following context from a document, answer the user's question. If the answer is not in the context, say so.

Context:
${context}

Question: ${question}
Answer:`;
        return await generate(prompt);
    } catch (error) {
        console.error('Groq chatWithContext error:', error);
        throw new Error('Failed to process chat request');
    }
};

export const explainConcept = async (concept, context) => {
    try {
        const prompt = `Explain the concept of "${concept}" based on the following context. Provide a clear, educational explanation with examples if relevant.

Context:
${context.substring(0, 10000)}`;
        return await generate(prompt);
    } catch (error) {
        console.error('Groq explainConcept error:', error);
        throw new Error('Failed to explain concept');
    }
};
