import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";

const envFile = fs.readFileSync(".env.local", "utf-8");
for (const line of envFile.split("\n")) {
  if (line.includes("GEMINI_API_KEY=")) {
    process.env.GEMINI_API_KEY = line.split("=")[1].trim();
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hello!");
    return `[SUCCESS] ${modelName}: ${result.response.text().trim()}`;
  } catch (error) {
    return `[ERROR] ${modelName}: ${error.message}`;
  }
}

async function run() {
  const results = [];
  results.push(await testModel("gemini-1.5-flash"));
  results.push(await testModel("gemini-2.5-flash"));
  results.push(await testModel("gemini-3.0-flash"));
  results.push(await testModel("gemini-3.1-flash"));
  results.push(await testModel("gemini-flash-latest"));
  
  for (const r of results) {
    console.log(r);
  }
}

run();
