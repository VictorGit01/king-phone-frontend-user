export interface Category {
  id: string;
  name: string;
  legacyName?: string;
}

export const categories: Category[] = [
  { id: '16c', name: 'iPhones Novos' },
  { id: '17c', name: 'iPhones Seminovos' },
  { id: '18c', name: 'Xiaomi Novos' },
  { id: '19c', name: 'Realme Novos' },
  { id: '1c', name: 'Samsung Novos', legacyName: 'Smartphones' },
  { id: '20c', name: 'Androids Seminovos', legacyName: 'Smartphones Seminovos' },
  { id: '21c', name: 'iPads' },
  { id: '22c', name: 'Tablets' },
  { id: '12c', name: 'AppleWatch/Smartwatch', legacyName: 'Smartwatches' },
  { id: '2c', name: 'Macbooks', legacyName: 'Notebooks e Desktops' },
  { id: '3c', name: 'Adaptadores' },
  { id: '4c', name: 'Cabos' },
  { id: '11c', name: 'Fontes de Carregamento' },
  { id: '7c', name: 'Carregadores Completos' },
  { id: '8c', name: 'Carregadores Portáteis' },
  { id: '6c', name: 'Capinhas' },
  { id: '14c', name: 'Películas' },
  { id: '5c', name: 'Caixas de Som' },
  { id: '9c', name: 'Fones Bluetooth' },
  { id: '10c', name: 'Fones de Ouvido Com Fio' },
  { id: '13c', name: 'Suportes' },
  { id: '15c', name: 'Variedades' },
];

export const getCategoryDbName = (categoryName: string) => {
  const category = categories.find((item) => item.name === categoryName);
  return category?.legacyName || categoryName;
};

export const getCategoryDisplayName = (dbCategoryName: string) => {
  const category = categories.find(
    (item) => item.name === dbCategoryName || item.legacyName === dbCategoryName
  );
  return category?.name || dbCategoryName;
};
