"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const textsplitters_1 = require("@langchain/textsplitters");
const google_genai_1 = require("@langchain/google-genai");
const pinecone_1 = require("@pinecone-database/pinecone");
const pinecone_2 = require("@langchain/pinecone");
const indexDocument = async () => {
    const PDF_PATH = "./as-resume.pdf";
    const pdfLoader = new pdf_1.PDFLoader(PDF_PATH);
    const rawDocs = await pdfLoader.load();
    console.log("PDF loaded successfully");
    const textSplitter = new textsplitters_1.RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 50,
    });
    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);
    console.log("Data chunked successfully");
    const embeddings = new google_genai_1.GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-embedding-001",
    });
    const embedding = await embeddings.embedQuery("hello world");
    console.log("Embedding length:", embedding.length);
    const pinecone = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
        throw new Error("PINECONE_INDEX_NAME missing in env");
    }
    const pineconeIndex = pinecone.index(indexName);
    console.log("Initialized and established connection successfully");
    await pinecone_2.PineconeStore.fromDocuments(chunkedDocs, embeddings, {
        pineconeIndex,
        maxConcurrency: 5,
    });
    console.log("Data uploaded successfully");
};
indexDocument()
    .catch((error) => {
    console.error("Indexing failed:", error.message);
});
//# sourceMappingURL=ingest.js.map