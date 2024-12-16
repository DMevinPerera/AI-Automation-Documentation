import express from 'express';
import fs from 'fs';
import cors from "cors";
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());  // To parse JSON data

// Read the API key from environment variable or config
const gemini_api_key = process.env.API_KEY || JSON.parse(fs.readFileSync('config.json')).API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: 'gemini-pro',
  geminiConfig,
});

// POST endpoint to generate documentation based on requirements
app.post('/generate-doc', async (req, res) => {
  const { text, type } = req.body;  // Expecting 'text' and 'type' (functional/non-functional)

  try {
    const prompt = `Add the following ${type} requirement to a software project documentation: ${text}`;
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;

    // Return the generated content as a response
    res.json({ content: response.text() });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).send("Error generating documentation.");
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));