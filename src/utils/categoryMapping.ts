/**
 * Mapeamento de categorias para compatibilidade com diferentes formatos
 * Usado principalmente para promoções e filtros
 * 
 * IMPORTANTE: As categorias principais devem ser sempre em Title Case
 * conforme definido em src/database/categories.ts
 */

// Mapeamento de IDs de categoria para nomes
export const CATEGORY_ID_TO_NAME: { [key: string]: string } = {
  '1c': 'Smartphones',
  '2c': 'Notebooks e Desktops',
  '3c': 'Adaptadores',
  '4c': 'Cabos',
  '5c': 'Caixas de Som',
  '6c': 'Capinhas',
  '7c': 'Carregadores Completos',
  '8c': 'Carregadores Portáteis',
  '9c': 'Fones Bluetooth',
  '10c': 'Fones de Ouvido Com Fio',
  '11c': 'Fontes de Carregamento',
  '12c': 'Smartwatches',
  '13c': 'Suportes',
  '14c': 'Películas',
  '15c': 'Variedades',
};

export const CATEGORY_ALIASES: { [key: string]: string } = {
  // ============================================
  // CATEGORIAS PRINCIPAIS (15 categorias padronizadas no PLURAL)
  // ============================================
  'smartphones': 'Smartphones',
  'notebooks e desktops': 'Notebooks e Desktops',
  'adaptadores': 'Adaptadores',
  'cabos': 'Cabos',
  'caixas de som': 'Caixas de Som',
  'capinhas': 'Capinhas',
  'carregadores completos': 'Carregadores Completos',
  'carregadores portáteis': 'Carregadores Portáteis',
  'carregadores portateis': 'Carregadores Portáteis', // sem acento
  'fones bluetooth': 'Fones Bluetooth',
  'fones de ouvido com fio': 'Fones de Ouvido Com Fio',
  'fontes de carregamento': 'Fontes de Carregamento',
  'smartwatches': 'Smartwatches',
  'suportes': 'Suportes',
  'películas': 'Películas',
  'peliculas': 'Películas', // sem acento
  'variedades': 'Variedades',
  
  // ============================================
  // ALIASES - SINGULAR → PLURAL
  // ============================================
  'smartphone': 'Smartphones',
  'notebook e desktop': 'Notebooks e Desktops',
  'adaptador': 'Adaptadores',
  'cabo': 'Cabos',
  'caixa de som': 'Caixas de Som',
  'capinha': 'Capinhas',
  'carregador completo': 'Carregadores Completos',
  'carregador portátil': 'Carregadores Portáteis',
  'carregador portatil': 'Carregadores Portáteis',
  'fone de ouvido com fio': 'Fones de Ouvido Com Fio',
  'fonte de carregamento': 'Fontes de Carregamento',
  'smartwatch': 'Smartwatches',
  'suporte': 'Suportes',
  'película': 'Películas',
  'pelicula': 'Películas',
  'variedade': 'Variedades',
  
  // ============================================
  // ALIASES - CATEGORIAS ANTIGAS DO BANCO (compatibilidade)
  // ============================================
  'customização': 'Notebooks e Desktops', // ⚠️ Categoria antiga → nova
  'customizacao': 'Notebooks e Desktops',
  'fones de ouvido': 'Fones Bluetooth', // Genérico → Específico (padrão Bluetooth)
  'dispositivos vestíveis': 'Smartwatches',
  'dispositivos vestiveis': 'Smartwatches',
  'carregadores': 'Carregadores Completos', // Genérico → Específico
  'assistentes virtuais': 'Caixas de Som',
  
  // ============================================
  // SINÔNIMOS E VARIAÇÕES
  // ============================================
  'celular': 'Smartphones',
  'celulares': 'Smartphones',
  'iphone': 'Smartphones',
  'android': 'Smartphones',
  
  'computador': 'Notebooks e Desktops',
  'computadores': 'Notebooks e Desktops',
  'notebook': 'Notebooks e Desktops',
  'notebooks': 'Notebooks e Desktops',
  'pc': 'Notebooks e Desktops',
  'pcs': 'Notebooks e Desktops',
  'desktop': 'Notebooks e Desktops',
  'desktops': 'Notebooks e Desktops',
  'tablet': 'Notebooks e Desktops',
  'tablets': 'Notebooks e Desktops',
  
  'speaker': 'Caixas de Som',
  'speakers': 'Caixas de Som',
  'alto-falante': 'Caixas de Som',
  'alto-falantes': 'Caixas de Som',
  'caixinha de som': 'Caixas de Som',
  'caixinhas de som': 'Caixas de Som',
  
  'case': 'Capinhas',
  'cases': 'Capinhas',
  'capa': 'Capinhas',
  'capas': 'Capinhas',
  
  'carregador': 'Carregadores Completos',
  
  'powerbank': 'Carregadores Portáteis',
  'power bank': 'Carregadores Portáteis',
  'bateria externa': 'Carregadores Portáteis',
  'baterias externas': 'Carregadores Portáteis',
  
  'fone bluetooth': 'Fones Bluetooth',
  'fone sem fio': 'Fones Bluetooth',
  'fones sem fio': 'Fones Bluetooth',
  'earphone': 'Fones Bluetooth',
  'earphones': 'Fones Bluetooth',
  'airpods': 'Fones Bluetooth',
  'wireless': 'Fones Bluetooth',
  'fones de ouvido bluetooth': 'Fones Bluetooth',
  'fone de ouvido bluetooth': 'Fones Bluetooth',
  
  'fone': 'Fones de Ouvido Com Fio',
  'fones': 'Fones de Ouvido Com Fio',
  'fone com fio': 'Fones de Ouvido Com Fio',
  'fones com fio': 'Fones de Ouvido Com Fio',
  'headphone': 'Fones de Ouvido Com Fio',
  'headphones': 'Fones de Ouvido Com Fio',
  'p2': 'Fones de Ouvido Com Fio',
  
  'fonte': 'Fontes de Carregamento',
  'fontes': 'Fontes de Carregamento',
  
  'relógio': 'Smartwatches',
  'relogio': 'Smartwatches',
  'relógios': 'Smartwatches',
  'relogios': 'Smartwatches',
  'relógio inteligente': 'Smartwatches',
  'watch': 'Smartwatches',
  
  'protetor': 'Películas',
  'protetores': 'Películas',
  'protetor de tela': 'Películas',
  'protetores de tela': 'Películas',
  'vidro': 'Películas',
  'vidros': 'Películas',
  'vidro temperado': 'Películas',
  'vidros temperados': 'Películas',
  
  'outros': 'Variedades',
  'diversos': 'Variedades',
  'acessórios': 'Variedades',
  'acessorios': 'Variedades',
};

/**
 * Converte ID de categoria para nome
 * @param categoryId - ID da categoria (ex: '1c', '2c')
 * @returns Nome da categoria (ex: 'Smartphones', 'Notebooks e Desktops')
 */
export function categoryIdToName(categoryId: string): string {
  if (!categoryId) return categoryId;
  return CATEGORY_ID_TO_NAME[categoryId] || categoryId;
}

/**
 * Normaliza o nome de uma categoria para o formato padrão
 * @param category - Nome da categoria a ser normalizado
 * @returns Nome da categoria no formato padrão ou a própria categoria se não houver alias
 */
export function normalizeCategory(category: string): string {
  if (!category) return category;
  
  // Primeiro tenta converter se for um ID
  const fromId = categoryIdToName(category);
  if (fromId !== category) return fromId;
  
  const lowerCategory = category.toLowerCase().trim();
  return CATEGORY_ALIASES[lowerCategory] || category;
}

/**
 * Verifica se duas categorias são equivalentes
 * @param category1 - Primeira categoria
 * @param category2 - Segunda categoria
 * @returns true se as categorias são equivalentes
 */
export function categoriesMatch(category1: string, category2: string): boolean {
  if (!category1 || !category2) return false;
  
  const normalized1 = normalizeCategory(category1);
  const normalized2 = normalizeCategory(category2);
  
  return normalized1 === normalized2;
}
