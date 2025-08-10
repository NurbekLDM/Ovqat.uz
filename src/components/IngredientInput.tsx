import React, { useState } from "react";
import {
  getRecipeSuggestion,
  getIngredientSuggestions,
  RecipeResponse,
} from "../lib/gemini";

interface IngredientInputProps {
  onRecipeGenerated: (recipe: RecipeResponse) => void;
}

export default function IngredientInput({
  onRecipeGenerated,
}: IngredientInputProps) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = async (value: string) => {
    setCurrentInput(value);

    if (value.length > 2) {
      const ingredientSuggestions = await getIngredientSuggestions(value);
      setSuggestions(ingredientSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addIngredient = (ingredient: string) => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim())) {
      setIngredients([...ingredients, ingredient.trim()]);
      setCurrentInput("");
      setSuggestions([]);
    }
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const generateRecipe = async () => {
    if (ingredients.length === 0) {
      alert("Kamida bitta ingredint qo'shing");
      return;
    }

    setIsLoading(true);
    try {
      const recipe = await getRecipeSuggestion(ingredients);
      if (recipe) {
        onRecipeGenerated(recipe);
      } else {
        alert("Retsept yaratishda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Recipe generation error:", error);
      alert("Retsept yaratishda xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Ingredientlarni kiriting
      </h2>

      {/* Ingredient Input */}
      <div className="relative mb-4">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              addIngredient(currentInput);
            }
          }}
          placeholder="Ingredint nomini yozing..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => addIngredient(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => addIngredient(currentInput)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Qo&apos;shish
      </button>

      {/* Added Ingredients */}
      {ingredients.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Qo`shilgan ingredientlar:
          </h3>
          <div className="flex flex-wrap gap-2">
            {ingredients.map((ingredient, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {ingredient}
                <button
                  onClick={() => removeIngredient(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Generate Recipe Button */}
      <button
        onClick={generateRecipe}
        disabled={isLoading || ingredients.length === 0}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isLoading || ingredients.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        {isLoading ? "Retsept yaratilmoqda..." : "Retsept yarating"}
      </button>
    </div>
  );
}
