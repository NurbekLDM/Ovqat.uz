import React, { useState } from "react";
import { getRecipeSuggestion, RecipeResponse } from "@/lib/gemini";
import { useIngredientSearch } from "@/hooks/useIngredientSearch";
import { ERROR_TYPES, ERROR_MESSAGES } from "@/constants/errors";

interface IngredientInputProps {
  onRecipeGenerated: (recipe: RecipeResponse) => void;
}

interface LocalNotification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}

/**
 * Component for ingredient input and recipe generation
 */
export default function IngredientInput({
  onRecipeGenerated,
}: IngredientInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<LocalNotification | null>(
    null
  );

  const {
    ingredients,
    currentInput,
    suggestions,
    addIngredient,
    removeIngredient,
    handleInputChange,
  } = useIngredientSearch();

  // Local notification functions
  const showNotification = (
    message: string,
    type: LocalNotification["type"]
  ) => {
    const id = Date.now().toString();
    setNotification({ id, message, type });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const showSuccess = (message: string) => showNotification(message, "success");
  const showError = (message: string) => showNotification(message, "error");
  const showWarning = (message: string) => showNotification(message, "warning");

  /**
   * Handles recipe generation with proper error handling
   */
  const handleGenerateRecipe = async (): Promise<void> => {
    if (ingredients.length === 0) {
      showWarning(ERROR_MESSAGES[ERROR_TYPES.VALIDATION_ERROR]);
      return;
    }

    setIsLoading(true);

    try {
      const recipe = await getRecipeSuggestion(ingredients);

      if (recipe) {
        onRecipeGenerated(recipe);
        showSuccess(ERROR_MESSAGES.RECIPE_GENERATED);
      } else {
        showError(ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR]);
      }
    } catch (error) {
      // Faqat quota error bo'lmaganda console.error qilamiz
      if (
        error instanceof Error &&
        error.message === ERROR_TYPES.API_QUOTA_EXCEEDED
      ) {
        showWarning(ERROR_MESSAGES[ERROR_TYPES.API_QUOTA_EXCEEDED]);
      } else {
        console.error("Recipe generation error:", error);
        showError(ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles adding ingredient from input or suggestion
   */
  const handleAddIngredient = (ingredient?: string): void => {
    const ingredientToAdd = ingredient || currentInput;
    if (ingredientToAdd.trim()) {
      addIngredient(ingredientToAdd);
    }
  };

  /**
   * Handles Enter key press in input field
   */
  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter") {
      handleAddIngredient();
    }
  };

  return (
    <>
      {/* Notification Toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-500 text-white"
              : notification.type === "warning"
              ? "bg-yellow-500 text-white"
              : notification.type === "error"
              ? "bg-red-500 text-white"
              : "bg-blue-500 text-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 text-white hover:text-gray-200 text-xl"
              type="button"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Ingredientlarni kiriting
        </h2>

        {/* Ingredient Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            value={currentInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ingredint nomini yozing..."
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            disabled={isLoading}
          />

          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 text-black bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion}-${index}`}
                  onClick={() => handleAddIngredient(suggestion)}
                  className="w-full px-4 py-2 text-left text-black hover:bg-gray-100 focus:bg-gray-100 transition-colors"
                  type="button"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Ingredient Button */}
        <button
          onClick={() => handleAddIngredient()}
          disabled={!currentInput.trim() || isLoading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          type="button"
        >
          Qo&apos;shish
        </button>

        {/* Selected Ingredients Display */}
        {ingredients.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Qo`shilgan ingredientlar:
            </h3>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient, index) => (
                <span
                  key={`${ingredient}-${index}`}
                  className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                >
                  {ingredient}
                  <button
                    onClick={() => removeIngredient(index)}
                    disabled={isLoading}
                    className="ml-2 text-green-600 hover:text-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    aria-label={`${ingredient} ni olib tashlash`}
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
          onClick={handleGenerateRecipe}
          disabled={isLoading || ingredients.length === 0}
          className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
            isLoading || ingredients.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
          type="button"
        >
          {isLoading ? "Retsept yaratilmoqda..." : "Retsept yarating"}
        </button>
      </div>
    </>
  );
}
