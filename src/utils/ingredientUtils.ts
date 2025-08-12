import { UZBEK_INGREDIENTS, SEARCH_CONFIG } from "@/constants/ingredients";

/**
 * Ingredient search utilities
 */

/**
 * Searches for ingredients matching the given input
 * @param input - Search query
 * @returns Array of matching ingredients, sorted by relevance
 */
export const searchIngredients = (input: string): string[] => {
  if (input.length < SEARCH_CONFIG.MIN_SEARCH_LENGTH) {
    return [];
  }

  const query = input.toLowerCase().trim();

  return UZBEK_INGREDIENTS.filter((ingredient) =>
    ingredient.toLowerCase().includes(query)
  )
    .sort((a, b) => {
      // Prioritize exact matches at the beginning
      const aStartsWith = a.toLowerCase().startsWith(query);
      const bStartsWith = b.toLowerCase().startsWith(query);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      // Sort by length (shorter ingredients first)
      return a.length - b.length;
    })
    .slice(0, SEARCH_CONFIG.MAX_SUGGESTIONS);
};

/**
 * Validates if an ingredient exists in the predefined list
 * @param ingredient - Ingredient to validate
 * @returns boolean indicating if ingredient is valid
 */
export const isValidIngredient = (ingredient: string): boolean => {
  return UZBEK_INGREDIENTS.includes(
    ingredient.toLowerCase() as (typeof UZBEK_INGREDIENTS)[number]
  );
};

/**
 * Creates a debounced function
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
