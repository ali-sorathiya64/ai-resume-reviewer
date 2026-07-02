# AI Resume Reviewer Agent

An AI-powered Resume Review Agent built using **Google Gemini**, **LangChain Embeddings**, and **Pinecone Vector Database**. The application performs Retrieval-Augmented Generation (RAG) to analyze resumes and provide detailed recruiter-style feedback instead of simply summarizing the content.

---

## Features

- Resume analysis using Google Gemini
- Semantic search with vector embeddings
- Retrieval-Augmented Generation (RAG)
- ATS optimization suggestions
- Technical skill evaluation
- Strength and weakness analysis
- Resume improvement recommendations
- Interview question generation

---

## Tech Stack

- TypeScript
- Node.js
- Google Gemini API
- LangChain
- Pinecone
- dotenv

---

## Project Flow

```
User Question
      │
      ▼
Generate Embedding
(GoogleGenerativeAIEmbeddings)
      │
      ▼
Search Similar Resume Chunks
(Pinecone)
      │
      ▼
Retrieve Relevant Context
      │
      ▼
Gemini 2.5 Flash Lite
      │
      ▼
AI Resume Review
```

---

## Installation

Clone the repository

```bash
git clone <repository-url>
```

Go inside project

```bash
cd project-name
```

Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
GEMINI_API_KEY=your_gemini_api_key

PINECONE_API_KEY=your_pinecone_api_key

PINECONE_INDEX_NAME=your_index_name
```

---

## Required Packages

```bash
npm install @google/genai
npm install @langchain/google-genai
npm install @pinecone-database/pinecone
npm install dotenv
```

---

## AI Workflow

### Step 1

The user's question is converted into a vector embedding using

```ts
GoogleGenerativeAIEmbeddings
```

Model used:

```
gemini-embedding-001
```

---

### Step 2

The generated embedding is searched inside Pinecone.

```ts
pineconeIndex.query({
    topK:4,
    vector:queryVector,
    includeMetadata:true
})
```

The top 4 most relevant resume chunks are retrieved.

---

### Step 3

Retrieved chunks are combined into a single context.

```ts
const context = searchResult.matches
.map(match => match.metadata.text)
.join("\n\n---\n\n");
```

---

### Step 4

The context is sent to Gemini along with a detailed system prompt.

Model used

```
gemini-2.5-flash-lite
```

Gemini acts like a senior recruiter and evaluates the resume.

---

## AI Output Structure

The AI generates responses in the following format:

### Overall Resume Evaluation

Overall quality assessment.

### Strengths

Strong points in the resume.

### Weaknesses / Problems

- Missing information
- Weak bullet points
- Lack of measurable achievements
- Outdated skills
- Unclear experience

### ATS Optimization

Suggestions for:

- Better keywords
- Recruiter-friendly terms
- Formatting improvements

### Technical Skill Analysis

Evaluation of

- Frontend
- Backend
- Database
- Cloud / DevOps
- AI / Machine Learning

### Improvement Suggestions

Practical recommendations to improve the resume.

### Interview Preparation

Generates likely interview questions based on the resume.

---

## Function Overview

```ts
agent(question: string)
```

### Input

```ts
"What are the weaknesses in this resume?"
```

### Output

```text
Overall Resume Evaluation

Strengths

Weaknesses

ATS Suggestions

Technical Skill Analysis

Improvement Suggestions

Interview Questions
```

---

## RAG Architecture

```
Resume
   │
   ▼
Chunking
   │
   ▼
Embeddings
   │
   ▼
Pinecone Vector Database
   │
   ▼
Similarity Search
   │
   ▼
Relevant Resume Context
   │
   ▼
Gemini 2.5 Flash Lite
   │
   ▼
Detailed Resume Review
```

---

## Future Improvements

- PDF upload support
- Resume scoring out of 100
- Cover letter generation
- Job description matching
- Skill gap analysis
- Multi-language support
- Resume rewriting
- Export review as PDF

---

## Author

Built using Google Gemini, LangChain, and Pinecone to provide recruiter-quality AI resume reviews.