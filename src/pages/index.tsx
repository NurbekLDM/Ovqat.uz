// pages/index.tsx
import Auth from "@/components/Auth";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import RecipeDisplay from "@/components/RecipeDisplay";
import { RecipeResponse } from "@/lib/gemini";

export default function Home() {
  const { user } = useUser();
  const [currentRecipe, setCurrentRecipe] = useState<RecipeResponse | null>(
    null
  );

  const handleRecipeGenerated = (recipe: RecipeResponse) => {
    setCurrentRecipe(recipe);
  };

  const handleCloseRecipe = () => {
    setCurrentRecipe(null);
  };

  return (
    <Auth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🍽️ Ovqat.uz - AI Oshpaz
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sizning ingredientlaringiz asosida o&apos;zbek milliy taomlarining
              eng mazali retseptlarini AI yordamida tayyorlaymiz!
            </p>
          </div>

          {!currentRecipe ? (
            <IngredientInput onRecipeGenerated={handleRecipeGenerated} />
          ) : (
            <RecipeDisplay recipe={currentRecipe} onClose={handleCloseRecipe} />
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              AI yordamida o&apos;zbek milliy taomlarini kashf eting
            </p>
          </div>
        </div>
      </div>
    </Auth>
  );
}
