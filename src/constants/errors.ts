/**
 * Error types and messages for the application
 */

export const ERROR_TYPES = {
  API_QUOTA_EXCEEDED: "API_QUOTA_EXCEEDED",
  NETWORK_ERROR: "NETWORK_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export const ERROR_MESSAGES = {
  [ERROR_TYPES.API_QUOTA_EXCEEDED]:
    "API kunlik limitingiz tugadi. Iltimos ertaga qayta urinib ko'ring.",
  [ERROR_TYPES.NETWORK_ERROR]:
    "Internet aloqasida muammo. Iltimos qayta urinib ko'ring.",
  [ERROR_TYPES.VALIDATION_ERROR]: "Kamida bitta ingredint qo'shing",
  [ERROR_TYPES.UNKNOWN_ERROR]: "Retsept yaratishda xatolik yuz berdi",

  // Success messages
  RECIPE_GENERATED: "Retsept muvaffaqiyatli yaratildi!",
  INGREDIENT_ADDED: "Ingredint qo'shildi",
} as const;

export type ErrorType = keyof typeof ERROR_TYPES;
