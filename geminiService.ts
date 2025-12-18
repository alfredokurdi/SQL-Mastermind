
import { GoogleGenAI } from "@google/genai";

export interface ValidationResponse {
  isCorrect: boolean;
  feedback: string;
  rows: any[];
  columns: string[];
}

/**
 * Validates the student's SQL query and provides tutor feedback using Gemini.
 */
export async function getTutorFeedback(
  query: string,
  lessonTask: string,
  lessonSchema: string,
  expectedQuery: string,
  fullTableData: any[]
): Promise<ValidationResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      You are a friendly and helpful SQL Tutor named "Skelly Bot".
      
      CONTEXT:
      - Task: "${lessonTask}"
      - Table Schema: "${lessonSchema}"
      - Reference "Correct" Answer: "${expectedQuery}"
      - Sample Data: ${JSON.stringify(fullTableData.slice(0, 5))}
      
      STUDENT INPUT: "${query}"

      INSTRUCTIONS:
      1. Determine if the STUDENT INPUT is logically correct for the Task.
      2. SIMULATE the result based on the provided sample data.
      3. Provide encouraging feedback.
      4. If incorrect, explain the mistake (e.g., "Check your table name" or "You missed a comma") without revealing the exact solution.

      OUTPUT FORMAT (JSON ONLY):
      {
        "isCorrect": boolean,
        "feedback": "Encouraging and instructive text",
        "rows": [ {"col1": "val", "col2": "val"} ],
        "columns": ["col1", "col2"]
      }
    `,
    config: {
      temperature: 0, 
      responseMimeType: "application/json",
    },
  });

  try {
    const res = JSON.parse(response.text || "{}") as ValidationResponse;
    if (res.rows && res.rows.length > 0 && (!res.columns || res.columns.length === 0)) {
      res.columns = Object.keys(res.rows[0]);
    }
    return {
      isCorrect: res.isCorrect ?? false,
      feedback: res.feedback ?? "Skelly Bot had a minor glitch. Try running it again!",
      rows: res.rows ?? [],
      columns: res.columns ?? []
    };
  } catch (e) {
    return { 
      isCorrect: false, 
      feedback: "Syntax Error: Your query has some structural issues. Re-check your SQL keywords.", 
      rows: [], 
      columns: [] 
    };
  }
}

/**
 * Chat with the SQL tutor "Skelly Bot".
 */
export async function chatWithTutor(history: { role: 'user' | 'model', text: string }[], userMessage: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: 'You are "Skelly Bot", a friendly and patient SQL tutor. You help people learn SQL with simple analogies and clear explanations. Be concise. If they ask for the answer, give them a helpful hint to guide them there.',
    },
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text || "Skelly is taking a quick break. Ask again in a second!";
}
