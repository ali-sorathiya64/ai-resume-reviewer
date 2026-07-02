import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { GoogleGenAI } from "@google/genai";
import { Pinecone } from "@pinecone-database/pinecone"

import dotenv from "dotenv"
dotenv.config()


export const agent = async (question: string) => {

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-embedding-001"
    })

    const queryVector = await embeddings.embedQuery(question);

    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!
    })
    const pineconeIndex = pinecone.Index(
        process.env.PINECONE_INDEX_NAME!
    )

    const searchResult = await pineconeIndex.query({
        topK:4,
        vector:queryVector,
        includeMetadata:true
    })


    const context = searchResult.matches
    .map( (match :any) => match.metadata.text)
    .join("\n\n---\n\n");


    const ai = new GoogleGenAI({
        apiKey:process.env.GEMINI_API_KEY
    })

    const response = await ai.models.generateContent({
        model:"gemini-2.5-flash-lite",
        contents:[
            {
                role:"user",

               parts:[
                {
                text:question
               }

        ]
    }

        ],
        config:{
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
    })


    return response.text;

}