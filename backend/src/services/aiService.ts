import dotenv from "dotenv";
dotenv.config();

import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

export async function askQuestion(question: string, documents: any[]) {
  // We include the database _id in the context so the AI can reference it
  const contextText = documents
    .map((d) => `[Document ID: ${d._id}]\n[Document Name: ${d.name}]\n${d.content}`)
    .join("\n\n---\n\n");

  const response = await hf.chatCompletion({
    model: "mistralai/Mistral-7B-Instruct-v0.2",
    messages: [
      {
        role: "system",
        content:
          "You are a factual assistant. Answer ONLY using the provided documents. You must include the correct Document ID for every source used. Respond in valid JSON."
      },
      {
        role: "user",
        content: `
DOCUMENTS:
${contextText}

QUESTION:
${question}

Respond ONLY in this JSON format:
{
  "answer": "string",
  "sources": [
    { "documentId": "the_actual_id_from_the_context", "documentName": "string", "excerpt": "string" }
  ]
}
`
      }
    ],
    max_tokens: 800,
    temperature: 0.1 // Lowered temperature for better JSON consistency
  });

  const text = response.choices[0].message.content;
  
  if (!text) {
    throw new Error("No content returned by model");
  }
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Invalid JSON returned by model");
  }

  const parsedResponse = JSON.parse(jsonMatch[0]);

  // Double-check that documentId exists to prevent Mongoose errors
  parsedResponse.sources = parsedResponse.sources.map((src: any) => ({
    ...src,
    documentId: src.documentId || "unknown_id" 
  }));

  return parsedResponse;
}