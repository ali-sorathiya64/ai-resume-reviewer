import dotenv from "dotenv";
dotenv.config();

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";


const indexDocument = async (): Promise<void> => {

    const PDF_PATH: string = "./as-resume.pdf";

    const pdfLoader = new PDFLoader(PDF_PATH);

    const rawDocs = await pdfLoader.load();

    console.log("PDF loaded successfully");


    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 50,
    });

    const chunkedDocs = await textSplitter.splitDocuments(rawDocs);

    console.log("Data chunked successfully");


    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GEMINI_API_KEY as string,
        model: "gemini-embedding-001",
    });


    const embedding: number[] = await embeddings.embedQuery("hello world");

    console.log("Embedding length:", embedding.length);



    const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
    });


    const indexName = process.env.PINECONE_INDEX_NAME;

    if (!indexName) {
        throw new Error("PINECONE_INDEX_NAME missing in env");
    }


    const pineconeIndex = pinecone.index(indexName);


    console.log("Initialized and established connection successfully");



    await PineconeStore.fromDocuments(
        chunkedDocs,
        embeddings,
        {
            pineconeIndex,
            maxConcurrency: 5,
        }
    );


    console.log("Data uploaded successfully");
};



indexDocument()
    .catch((error: Error) => {
        console.error("Indexing failed:", error.message);
    });