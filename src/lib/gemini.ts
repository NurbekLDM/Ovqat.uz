import { GoogleGenerativeAI } from "@google/generative-ai";

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

export async function getRecipeSuggestion(
  ingredients: string[]
): Promise<RecipeResponse | null> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
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
  "tips": ["maslahat 1", "maslahat 2"]
}

Faqat o'zbek milliy taomlarini taklif qiling va barcha matnlarni o'zbek tilida yozing.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON ni ajratib olish
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const recipeData = JSON.parse(jsonMatch[0]);
      return recipeData;
    }

    return null;
  } catch (error) {
    console.error("Gemini API xatosi:", error);
    return null;
  }
}

export async function getIngredientSuggestions(
  partialIngredient: string
): Promise<string[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
O'zbek oshxonasida ishlatiladigan ingredientlar ro'yxatini bering. 
Foydalanuvchi "${partialIngredient}" deb yozgan, shunga o'xshash ingredientlar taklif qiling.
Faqat o'zbek tilida va JSON array formatida javob bering:
["ingredint1", "ingredint2", "ingredint3", "ingredint4", "ingredint5"]

Maksimal 10 ta ingredint taklif qiling.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // JSON array ni ajratib olish
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return suggestions;
    }

    return [];
  } catch (error) {
    console.error("Ingredient suggestions xatosi:", error);
    return [];
  }
}
