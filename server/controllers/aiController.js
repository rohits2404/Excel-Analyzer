import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import Analysis from '../models/Analysis.js';

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Cache model instance
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-001',
});

export const generateAISummary = async (req, res, next) => {
    try {

        const { analysisId } = req.params;
        
        // Fetch analysis data
        const analysis = await Analysis.findById(analysisId);
        if (!analysis) {
            return res.status(404).json({ message: 'Analysis not found' });
        }

        // If summary already exists
        if (analysis.summary) {
            return res.status(200).json({ 
                summary: analysis.summary,
                message: 'Using cached summary' 
            });
        }

        // Prepare optimized prompt
        const prompt = createPrompt(analysis.parsedData);

        // Generate content with error handling
        const result = await model.generateContent(prompt);
        const summary = result.response.text();
        // Save and respond
        analysis.summary = summary;
        await analysis.save();

        return res.status(200).json({ 
            summary, 
            message: 'AI summary generated and saved' 
        });
    } catch (error) {
        return handleGeminiError(error, res, next);
    }
};

// Helper function to create optimized prompt
function createPrompt(data) {
    // Extract only relevant data properties if possible
    const sampleData = Array.isArray(data) ? data.slice(0, 100) : data;
    
    return `
        Analyze this business data and provide a concise summary (3-5 sentences max).
        Focus on key trends, anomalies, or patterns that would interest business users.
        Use simple language and highlight only the most important insights.

        Data sample:
        ${JSON.stringify(sampleData).slice(0, 3000)}
        
        Note: Data has been truncated for analysis. Focus on overall patterns rather than specifics.
    `;
}

// Enhanced error handler
function handleGeminiError(error, res, next) {
    
    console.error('Gemini API Error:', error);
    
    // Handle rate limiting specifically
    if (error.message.includes('429') || error.message.includes('quota')) {
        return res.status(429).json({
            message: 'API quota exceeded. Please try again later or upgrade your plan.',
            retryAfter: '1 hour', // Suggest when to retry
            docs: 'https://ai.google.dev/gemini-api/docs/rate-limits'
        });
    }

    // Handle other API errors
    if (error.message.includes('API')) {
        return res.status(502).json({
            message: 'AI service currently unavailable',
            error: error.message
        });
    }

    // Pass to default error handler
    next(error);
}