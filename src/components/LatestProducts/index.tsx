import { ProductSlider } from "../../components/ProductSlider";
import { usePaginatedProducts } from "../../hooks/useFetch";

const adaptBackendProduct = (backendProduct: any) => {
  return {
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
};

export const LatestProducts = () => {
  const { data: backendProducts, loading, error } = usePaginatedProducts({ limit: 8 });

  const products = backendProducts?.map(adaptBackendProduct) || [];

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
