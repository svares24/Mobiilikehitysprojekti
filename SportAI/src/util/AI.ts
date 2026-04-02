import { GoogleGenAI } from '@google/genai';

export default new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
});
