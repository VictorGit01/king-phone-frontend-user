export const formatWhatsApp = (value: string) => {
  // Remove caracteres não numéricos
  const cleanedValue = value.replace(/\D/g, "");

  const ddd = cleanedValue.slice(0, 2);
  const firstPart = cleanedValue.slice(2, cleanedValue.length <= 10 ? 6 : 7);
  const secondPart = cleanedValue.slice(cleanedValue.length <= 10 ? 6 : 7, 11);

  // Formatação com base no comprimento
  if (cleanedValue.length === 0) return "";
  if (cleanedValue.length < 3) return `(${ddd}`; // apenas DDD
  if (cleanedValue.length < (cleanedValue.length <= 10 ? 7 : 8)) return `(${ddd}) ${firstPart}`; // DDD e parte inicial
  // final
  return `(${ddd}) ${firstPart}-${secondPart}`; // DDD, parte inicial e final
};

export const limitWhatsAppDigits = (value: string, maxDigits = 11) => {
  // Mantém somente dígitos e limita ao máximo esperado (DDD + número)
  return value.replace(/\D/g, "").slice(0, maxDigits);
};
