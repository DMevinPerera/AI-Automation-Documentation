import fs from 'fs'; // For reading the JSON file
import { GoogleGenerativeAI } from "@google/generative-ai";

// Read the API key from config.json
const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));
const gemini_api_key = config.API_KEY;

const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  geminiConfig,
});

const generate = async () => {
  try {
    const prompt = "Sri Lanka";
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    console.log(response.text());
  } catch (error) {
    console.log("Response error", error);
  }
};

generate();