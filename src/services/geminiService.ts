// geminiService.ts
// Gemini complètement désactivé pour les tests UI.

export const generateBusinessInsight = async (
  prompt: string,
  contextData: string
): Promise<string> => {
  console.log("Gemini désactivé (tests). Prompt :", prompt);
  console.log("ContextData :", contextData);
  return "Analyse factice (Gemini est désactivé pour les tests de l'interface).";
};

export const generateProductDescription = async (
  productName: string,
  category: string
): Promise<string> => {
  console.log(
    "Gemini désactivé (tests). Produit :",
    productName,
    "Catégorie :",
    category
  );
  return `Description factice pour "${productName}" (Gemini désactivé).`;
};
