import { GoogleGenerativeAI } from "@google/generative-ai";
import { ERROR_TYPES } from "@/constants/errors";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn(
    "Gemini API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables."
  );
}

const genAI = new GoogleGenerativeAI(API_KEY);

export interface RecipeResponse {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: string;
  difficulty: "Oson" | "O'rta" | "Qiyin";
  tips?: string[];
}

/**
 * Generates recipe suggestions based on provided ingredients with retry mechanism
 * @param ingredients - Array of ingredients
 * @returns Promise<RecipeResponse | null>
 */
export async function getRecipeSuggestion(
  ingredients: string[]
): Promise<RecipeResponse | null> {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (!API_KEY) {
        console.error("Gemini API key topilmadi");
        return null;
      }

      if (!ingredients.length) {
        throw new Error(ERROR_TYPES.VALIDATION_ERROR);
      }

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = createRecipePrompt(ingredients);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return parseRecipeResponse(text);
    } catch (error: unknown) {
      // Server overload (503) yoki quota error bo'lsa
      if (isServerOverloadError(error) || isQuotaExceededError(error)) {
        if (attempt < MAX_RETRIES) {
          console.log(
            `Server yuklangan. ${attempt}/${MAX_RETRIES} urinish. ${
              RETRY_DELAY / 1000
            }s kutamiz...`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * attempt)
          );
          continue;
        } else {
          // Oxirgi urinishdan keyin xato
          if (isQuotaExceededError(error)) {
            throw new Error(ERROR_TYPES.API_QUOTA_EXCEEDED);
          } else {
            throw new Error(ERROR_TYPES.SERVER_OVERLOAD);
          }
        }
      }

      // Boshqa xatolar uchun
      console.error("Gemini API xatosi:", error);
      return null;
    }
  }

  return null;
}

/**
 * Creates a structured prompt for recipe generation
 * @param ingredients - Array of ingredients
 * @returns Formatted prompt string
 */
function createRecipePrompt(ingredients: string[]): string {
  return `
Siz o'zbek oshpazi sifatida javob bering. Quyidagi ingredientlar bilan o'zbek milliy taomlarini tayyorlash uchun retsept bering:

Ingredientlar: ${ingredients.join(", ")}

Iltimos, quyidagi formatda javob bering (faqat JSON formatida):
{
  "title": "Taom nomi",
  "ingredients": ["ingredint 1", "ingredint 2", "..."],
  "instructions": ["qadam 1", "qadam 2", "..."],
  "cookingTime": "45 daqiqa",
  "servings": "4 kishi uchun",
  "difficulty": "O'rta",
  "tips": ["maslahat 1", "maslahat 2" , "maslahat 3", "maslahat 4"]
}

Faqat o'zbek milliy taomlarini taklif qiling va barcha matnlarni o'zbek tilida yozing.
`;
}

/**
 * Parses the API response and extracts recipe data
 * @param text - Raw response text
 * @returns Parsed recipe data or null
 */
function parseRecipeResponse(text: string): RecipeResponse | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const recipeData = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (
        !recipeData.title ||
        !recipeData.ingredients ||
        !recipeData.instructions
      ) {
        console.error("Invalid recipe response format");
        return null;
      }

      return recipeData;
    }
    return null;
  } catch (error) {
    console.error("Error parsing recipe response:", error);
    return null;
  }
}

/**
 * Checks if error is related to server overload (503)
 * @param error - Error object
 * @returns boolean indicating if it's a server overload error
 */
function isServerOverloadError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("503") ||
      message.includes("overloaded") ||
      message.includes("service unavailable") ||
      message.includes("server error")
    );
  }

  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;
    return (
      errorObj.status === 503 ||
      errorObj.statusCode === 503 ||
      String(error).includes("503") ||
      String(error).includes("overloaded")
    );
  }

  return false;
}

/**
 * Checks if error is related to API quota limits
 * @param error - Error object
 * @returns boolean indicating if it's a quota error
 */
function isQuotaExceededError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes("quota") ||
      message.includes("429") ||
      message.includes("exceeded") ||
      message.includes("rate limit") ||
      message.includes("quota failure")
    );
  }

  // Check if it's a Google AI error with status code 429
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;
    return (
      errorObj.status === 429 ||
      errorObj.statusCode === 429 ||
      String(error).includes("429") ||
      String(error).includes("quota")
    );
  }

  return false;
}
