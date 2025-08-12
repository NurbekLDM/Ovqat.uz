import { useState, useCallback, useRef } from "react";
import { searchIngredients } from "@/utils/ingredientUtils";
import { SEARCH_CONFIG } from "@/constants/ingredients";

interface UseIngredientSearchReturn {
  ingredients: string[];
  currentInput: string;
  suggestions: string[];
  addIngredient: (ingredient: string) => void;
  removeIngredient: (index: number) => void;
  handleInputChange: (value: string) => void;
  clearInput: () => void;
}

/**
 * Custom hook for managing ingredient search and selection
 */
export const useIngredientSearch = (): UseIngredientSearchReturn => {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cache, setCache] = useState<Record<string, string[]>>({});

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const getCachedSuggestions = useCallback(
    (query: string): string[] | null => {
      return cache[query.toLowerCase()] || null;
    },
    [cache]
  );

  const cacheSuggestions = useCallback((query: string, results: string[]) => {
    setCache((prev) => ({
      ...prev,
      [query.toLowerCase()]: results,
    }));
  }, []);

  const searchWithCache = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();

      if (trimmedValue.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
        setSuggestions([]);
        return;
      }

      // Check cache first
      const cachedResults = getCachedSuggestions(trimmedValue);
      if (cachedResults) {
        setSuggestions(cachedResults);
        return;
      }

      // Search and cache results
      const results = searchIngredients(trimmedValue);
      setSuggestions(results);
      cacheSuggestions(trimmedValue, results);
    },
    [getCachedSuggestions, cacheSuggestions]
  );

  const handleInputChange = useCallback(
    (value: string) => {
      setCurrentInput(value);

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Use debounced search
      timeoutRef.current = setTimeout(() => {
        searchWithCache(value);
      }, SEARCH_CONFIG.DEBOUNCE_DELAY);
    },
    [searchWithCache]
  );

  const addIngredient = useCallback(
    (ingredient: string) => {
      const trimmedIngredient = ingredient.trim();

      if (trimmedIngredient && !ingredients.includes(trimmedIngredient)) {
        setIngredients((prev) => [...prev, trimmedIngredient]);
        setCurrentInput("");
        setSuggestions([]);
      }
    },
    [ingredients]
  );

  const removeIngredient = useCallback((index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const clearInput = useCallback(() => {
    setCurrentInput("");
    setSuggestions([]);
  }, []);

  return {
    ingredients,
    currentInput,
    suggestions,
    addIngredient,
    removeIngredient,
    handleInputChange,
    clearInput,
  };
};
