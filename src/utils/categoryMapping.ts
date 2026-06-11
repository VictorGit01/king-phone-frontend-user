/**
 * Mapeamento de categorias para compatibilidade com diferentes formatos
 * Usado principalmente para promoções e filtros
 */

import { categories } from '../database/categories';

export const CATEGORY_ID_TO_NAME: { [key: string]: string } = Object.fromEntries(
  categories.map((category) => [category.id, category.name])
);

export const CATEGORY_ALIASES: { [key: string]: string } = {
  'iphones novos': 'iPhones Novos',
  'iphones seminovos': 'iPhones Seminovos',
  'xiaomi novos': 'Xiaomi Novos',
  'realme novos': 'Realme Novos',
  'samsung novos': 'Samsung Novos',
  'androids seminovos': 'Androids Seminovos',
  'ipads': 'iPads',
  'tablets': 'Tablets',
  'applewatch/smartwatch': 'AppleWatch/Smartwatch',
  'macbooks': 'Macbooks',
  'adaptadores': 'Adaptadores',
  'cabos': 'Cabos',
  'fontes de carregamento': 'Fontes de Carregamento',
  'carregadores completos': 'Carregadores Completos',
  'carregadores portáteis': 'Carregadores Portáteis',
  'carregadores portateis': 'Carregadores Portáteis',
  'capinhas': 'Capinhas',
  'películas': 'Películas',
  'peliculas': 'Películas',
  'caixas de som': 'Caixas de Som',
  'fones bluetooth': 'Fones Bluetooth',
  'fones de ouvido com fio': 'Fones de Ouvido Com Fio',
  'suportes': 'Suportes',
  'variedades': 'Variedades',

  'smartphones': 'Samsung Novos',
  'smartphones seminovos': 'Androids Seminovos',
  'smartwatches': 'AppleWatch/Smartwatch',
  'notebooks e desktops': 'Macbooks',

  'smartphone': 'Samsung Novos',
  'iphone': 'iPhones Novos',
  'ipad': 'iPads',
  'tablet': 'Tablets',
  'macbook': 'Macbooks',
  'smartwatch': 'AppleWatch/Smartwatch',
  'android': 'Androids Seminovos',

  'adaptador': 'Adaptadores',
  'cabo': 'Cabos',
  'caixa de som': 'Caixas de Som',
  'capinha': 'Capinhas',
  'carregador completo': 'Carregadores Completos',
  'carregador portátil': 'Carregadores Portáteis',
  'carregador portatil': 'Carregadores Portáteis',
  'fone bluetooth': 'Fones Bluetooth',
  'fone de ouvido com fio': 'Fones de Ouvido Com Fio',
  'fonte de carregamento': 'Fontes de Carregamento',
  'suporte': 'Suportes',
  'película': 'Películas',
  'pelicula': 'Películas',
  'variedade': 'Variedades',

  'fones de ouvido': 'Fones Bluetooth',
  'dispositivos vestíveis': 'AppleWatch/Smartwatch',
  'dispositivos vestiveis': 'AppleWatch/Smartwatch',
  'carregadores': 'Carregadores Completos',
  'assistentes virtuais': 'Caixas de Som',
  'customização': 'Macbooks',
  'customizacao': 'Macbooks',
};

export function categoryIdToName(categoryId: string): string {
  if (!categoryId) return categoryId;
  return CATEGORY_ID_TO_NAME[categoryId] || categoryId;
}

export function normalizeCategory(category: string): string {
  if (!category) return category;

  const fromId = categoryIdToName(category);
  if (fromId !== category) return fromId;

  const lowerCategory = category.toLowerCase().trim();
  return CATEGORY_ALIASES[lowerCategory] || category;
}

export function categoriesMatch(category1: string, category2: string): boolean {
  if (!category1 || !category2) return false;

  const normalized1 = normalizeCategory(category1);
  const normalized2 = normalizeCategory(category2);

  return normalized1 === normalized2;
}

export function productMatchesCategory(productCategory: string, displayCategoryName: string): boolean {
  if (!productCategory || !displayCategoryName) return false;

  const category = categories.find((item) => item.name === displayCategoryName);
  const acceptableNames = new Set<string>([displayCategoryName]);

  if (category?.legacyName) {
    acceptableNames.add(category.legacyName);
  }

  if (acceptableNames.has(productCategory)) {
    return true;
  }

  return categoriesMatch(productCategory, displayCategoryName);
}

export function promotionMatchesProductCategory(
  promoCategory: string,
  productCategory: string | undefined
): boolean {
  if (!promoCategory || !productCategory) return false;

  const resolvedPromoCategory = categoryIdToName(promoCategory);

  if (productMatchesCategory(productCategory, resolvedPromoCategory)) {
    return true;
  }

  return categoriesMatch(resolvedPromoCategory, productCategory);
}
