import { ProductSlider } from "../../components/ProductSlider";
import { useProducts } from "../../hooks/useFetch";

// Remova ou comente os console.logs para limpar o console:
const adaptBackendProduct = (backendProduct: any) => {
  // console.log('🔍 Produto original do backend:', backendProduct); // ❌ Remover
  // console.log('📁 Files do produto:', backendProduct.files); // ❌ Remover
  // console.log('🖼️ URL da primeira imagem:', backendProduct.files?.[0]?.url); // ❌ Remover

  const adaptedProduct = {
    id: backendProduct.id,

    title: backendProduct.name,
    description: backendProduct.details,
    image_url: backendProduct.files?.[0]?.url || "/placeholder-image.jpg",
    price: backendProduct.price,
    category: backendProduct.category,
    brand: backendProduct.brand,
    color: backendProduct.color,
    quantity: backendProduct.quantity,
    is_new: true,
  created_at: backendProduct.created_at,
  };

  // console.log('✨ Produto adaptado:', adaptedProduct); // ❌ Remover

  return adaptedProduct;
};

export const LatestProducts = () => {
  const { data: backendProducts, loading, error } = useProducts();

  // 🆕 Converter produtos do backend para o formato do frontend
  const products = backendProducts
    ?.slice()
    .sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();

      // Se created_at vier inválido, manda pro fim.
      if (Number.isNaN(aTime) && Number.isNaN(bTime)) return 0;
      if (Number.isNaN(aTime)) return 1;
      if (Number.isNaN(bTime)) return -1;

      return bTime - aTime;
    })
    .slice(0, 8)
    .map(adaptBackendProduct) || [];

  // console.log('📦 LatestProducts - Backend:', backendProducts); // ❌ Remover
  // console.log('📦 LatestProducts - Convertidos:', products); // ❌ Remover

  if (loading) {
    return (
      <div className="mb-16 flex-col items-center px-[1rem]">
  <div className="container mx-auto">
          <h2 className="h2 mb-6 text-center xl:text-left">Últimos Produtos</h2>
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Carregando produtos...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-16 flex-col items-center px-[1rem]">
  <div className="container mx-auto">
          <h2 className="h2 mb-6 text-center xl:text-left">Últimos Produtos</h2>
          <div className="flex justify-center items-center py-8">
            <div className="text-red-500">
              Erro ao carregar produtos: {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Se carregou sem erro e não tem produtos, não renderiza a seção (evita título solto).
  if (!products.length) {
    return null;
  }

  return (
    <div className="mb-16 flex-col items-center px-[1rem]">
  <div className="container mx-auto">
        <h2 className="h2 mb-6 text-center xl:text-left">Últimos Produtos</h2>
        <ProductSlider data={products} latestProducts={true} />
      </div>
    </div>
  );
};
