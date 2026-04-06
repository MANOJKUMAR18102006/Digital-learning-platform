import fs from "fs/promises";
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = await fs.readFile(filePath);
    const data = await pdfParse(dataBuffer);
    return { text: data.text, numPages: data.numpages, info: data.info };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};
