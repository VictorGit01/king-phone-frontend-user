import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";

import { CategoryNav } from "../../components/CategoryNav";
import { Product } from "../../components/Product";

import { useProducts } from "../../hooks/useFetch";
import { categories } from "../../database/categories";

export const Products = () => {
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const { data: apiProducts, loading, error } = useProducts();

  // Pegar parâmetros da query string
  const searchParams = new URLSearchParams(location.search);
  const categoryQuery = searchParams.get('category');
  const promoQuery = searchParams.get('promo');

  // Mapeamento reverso apenas para compatibilidade com promoções antigas
  const categoryReverseMapping: { [key: string]: string } = {
    'smartphone': 'Smartphones',
    'headphone': 'Fones de ouvido',
    'smartwatch': 'Dispositivos vestíveis',
    'charger': 'Carregadores',
    'assistant': 'Assistentes virtuais',
    'customization': 'Customização'
  };

  // Função para adaptar produtos da API para o formato esperado pelo componente
  const adaptApiProduct = (apiProduct: any) => {
    return {
      id: apiProduct.id,
      title: apiProduct.name,
      description: apiProduct.details,
      price: apiProduct.price,
      image_url: apiProduct.files?.[0]?.url || "/placeholder-image.jpg",
      category: apiProduct.category,
      category_id: apiProduct.category, // Usando category como category_id
      is_new: true,
    };
  };

  // Converter produtos da API para o formato esperado
  const allProducts = apiProducts ? apiProducts.map(adaptApiProduct) : [];

  console.log('🛍️ Products Page Debug:', {
    id,
    categoryQuery,
    promoQuery,
    totalProducts: allProducts.length,
    categories: allProducts.map(p => p.category).filter((v, i, a) => a.indexOf(v) === i)
  });

  // Filtrar produtos baseado na categoria ou mostrar todos
  const filteredProducts = (() => {
    let products = allProducts;

    // Filtro por categoria da URL (/products/:id)
    if (id) {
      const category = categories.find(cat => cat.id === id);
      if (category) {
        products = products.filter(product => product.category === category.name);
      }
    }
    
    // Filtro por categoria da query string (?category=...)
    else if (categoryQuery) {
      console.log('🔍 Filtrando produtos por categoria query:', categoryQuery);
      products = products.filter(product => {
        // Correspondência direta (agora sincronizada)
        if (product.category === categoryQuery) {
          return true;
        }
        
        // Compatibilidade com categorias antigas
        const mappedCategory = categoryReverseMapping[categoryQuery];
        if (mappedCategory && product.category === mappedCategory) {
          return true;
        }
        
        return false;
      });
      console.log('🎯 Produtos filtrados encontrados:', products.length);
    }

    // Filtros adicionais baseados em tipo de promoção
    if (promoQuery) {
      // Aqui você pode adicionar lógicas específicas para cada tipo de promoção
      console.log(`🎯 Filtrando produtos para promoção: ${promoQuery}`);
    }

    return products;
  })();

  useEffect(() => {
    // Determinar o título baseado no tipo de filtro
    if (id && categories.length > 0) {
      const category = categories.find(cat => cat.id === id);
      setTitle(category ? category.name : "Categoria não encontrada");
    } else if (categoryQuery) {
      // Buscar o nome amigável da categoria
      const categoryData = categories.find(cat => cat.name === categoryQuery);
      const categoryName = categoryData ? categoryData.name : categoryQuery;
      
      if (promoQuery) {
        setTitle(`${categoryName} - ${getPromoTitle(promoQuery)}`);
      } else {
        setTitle(categoryName);
      }
    } else if (promoQuery) {
      setTitle(getPromoTitle(promoQuery));
    } else {
      setTitle("Todos os Produtos");
    }
  }, [id, categoryQuery, promoQuery]);

  // Função para obter título amigável da promoção
  const getPromoTitle = (promo: string) => {
    switch (promo) {
      case 'buy_x_get_y':
        return 'Ofertas Compre X Leve Y';
      case 'combo':
        return 'Combos Especiais';
      case 'conditional':
        return 'Ofertas Condicionais';
      default:
        return 'Promoções';
    }
  };

  if (loading) {
    return (
      <div className="mb-16 pt-40 lg:pt-0">
        <div className="container mx-auto">
          <div className="flex gap-x-[30px]">
            <CategoryNav />
            <main className="w-[100%]">
              <div className="py-3 text-xl uppercase text-center">
                Carregando produtos...
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-16 pt-40 lg:pt-0">
        <div className="container mx-auto">
          <div className="flex gap-x-[30px]">
            <CategoryNav />
            <main className="w-[100%]">
              <div className="py-3 text-xl uppercase text-center">
                Erro ao carregar produtos: {error}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-16 pt-40 lg:pt-0">
      <div className="container mx-auto">
        <div className="flex gap-x-[30px]">
          <CategoryNav />
          <main className="w-[100%]">
            {filteredProducts.length > 0 ? (
              <>
                {/* title */}
                <div className="py-3 text-xl uppercase text-center lg:text-left">
                  {title} ({filteredProducts.length})
                </div>
                {/* product grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:gap-[30px]">
                  {filteredProducts?.map((product) => (
                    <Product product={product} key={product.id} />
                  ))}
                </div>
              </>
            ) : (
              /* Mensagem de nenhum produto - com mais altura em mobile */
              <div className="flex flex-col items-center justify-center min-h-[60vh] lg:min-h-[40vh]">
                <div className="text-xl lg:text-2xl uppercase text-center text-gray-300 mb-4">
                  Nenhum produto encontrado
                </div>
                <div className="text-sm lg:text-base text-center text-gray-500">
                  Não há produtos disponíveis nesta categoria no momento.
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
