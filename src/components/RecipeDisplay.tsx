import React, { useState } from "react";
import Image from "next/image";
import { RecipeResponse } from "../lib/gemini";

interface RecipeDisplayProps {
  recipe: RecipeResponse;
  onClose: () => void;
}

export default function RecipeDisplay({ recipe, onClose }: RecipeDisplayProps) {
  console.log("RecipeDisplay rendered with recipe:", recipe);
  const [imageError, setImageError] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Oson":
        return "bg-green-100 text-green-800";
      case "O'rta":
        return "bg-yellow-100 text-yellow-800";
      case "Qiyin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{recipe.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:bg-red-500 bg-red-600 px-4 p-2 hover:text-gray-700 text-xl font-bold"
        >
          x
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-600 font-semibold">Pishirish vaqti</p>
          <p className="text-lg font-bold text-blue-800">
            {recipe.cookingTime}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600 font-semibold">Porsiya</p>
          <p className="text-lg font-bold text-green-800">{recipe.servings}</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-sm text-gray-600 font-semibold">
            Qiyinlik darajasi
          </p>
          <span
            className={`inline-block px-2 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black mb-3">
          Kerakli ingredientlar
        </h3>
        <ul className="grid grid-cols-1 text-black md:grid-cols-2 gap-2">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center  bg-gray-50 p-2 rounded"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-black mb-3">
          Tayyorlash usuli
        </h3>
        <ol className="space-y-3">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-1">
                {index + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{instruction}</p>
            </li>
          ))}
        </ol>
      </div>
      {recipe.image && !imageError && (
        <div className="mb-6">
          <Image
            alt={recipe.title}
            className="w-full h-auto rounded-lg"
            src={recipe.image}
            width={800}
            height={500}
            style={{ objectFit: "cover" }}
            priority
            onError={() => setImageError(true)}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      )}

      {recipe.image && imageError && (
        <div className="mb-6 bg-gray-100 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-2">🍽️</div>
          <p className="text-gray-500">Rasm yuklanmadi</p>
        </div>
      )}

      {recipe.tips && recipe.tips.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <h4 className="text-lg font-semibold text-yellow-800 mb-2">
            Foydali maslahatlar
          </h4>
          <ul className="space-y-1">
            {recipe.tips.map((tip, index) => (
              <li key={index} className="text-yellow-700 flex items-start">
                <span className="text-yellow-500 mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
