"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = void 0;
const google_genai_1 = require("@langchain/google-genai");
const genai_1 = require("@google/genai");
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const agent = async (question) => {
    const embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-embedding-001"
    });
    const queryVector = await embeddings.embedQuery(question);
    const pinecone = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY
    });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);
    const searchResult = await pineconeIndex.query({
        topK: 4,
        vector: queryVector,
        includeMetadata: true
    });
    const context = searchResult.matches
        .map((match) => match.metadata.text)
        .join("\n\n---\n\n");
    const ai = new genai_1.GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: question
                    }
                ]
            }
        ],
        config: {
            systemInstruction: `

You are an advanced Resume Review AI Agent.

Your job is NOT to summarize the resume.

Analyze the resume deeply and provide actionable feedback.

Use ONLY the resume context provided below.

Return response in this structure:

## Overall Resume Evaluation

Give a short evaluation of the resume quality.

## Strengths

Mention strong points with explanation.

## Weaknesses / Problems

Find issues like:
- missing information
- weak descriptions
- lack of measurable achievements
- outdated skills
- unclear experience

## ATS Optimization

Suggest:
- keywords to add
- formatting improvements
- missing recruiter-friendly terms

## Technical Skill Analysis

Evaluate:
- backend skills
- frontend skills
- database knowledge
- cloud/devops
- AI skills

## Improvement Suggestions

Give practical steps to improve this resume.

## Interview Preparation

Generate possible interview questions based on this resume.

Important:
Do not just repeat resume content.
Think like a senior recruiter reviewing this resume.

Resume Context:

${context}

`
        }
    });
    return response.text;
};
exports.agent = agent;
//# sourceMappingURL=agent.js.map