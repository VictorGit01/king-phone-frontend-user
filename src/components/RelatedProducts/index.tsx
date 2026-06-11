import { ProductSlider } from "../ProductSlider";
import { usePaginatedProducts } from "../../hooks/useFetch";

interface IRelatedProducts {
  category: string;
  currentProductId: string;
}

interface BackendProduct {
  id: string;
  name: string;
  category: string;
  brand: string;
  color: string;
  quantity: number;
  price: number;
  details: string;
  files?: Array<{
    id: string;
    url: string;
    public_id: string;
  }>;
  created_at: string;
}

interface AdaptedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_new: boolean;
}

const adaptBackendProduct = (backendProduct: BackendProduct): AdaptedProduct => {
  return {
    id: backendProduct.id,
    title: backendProduct.name,
    description: backendProduct.details,
    price: backendProduct.price,
    image_url: backendProduct.files?.[0]?.url || "/placeholder-image.jpg",
    category: backendProduct.category,
    is_new: true,
  };
};

export const RelatedProducts = ({ category, currentProductId }: IRelatedProducts) => {
  const { data: backendProducts, loading, error } = usePaginatedProducts({
    category,
    limit: 8,
  });

  const relatedProducts =
    backendProducts
      ?.filter((product: BackendProduct) => product.id !== currentProductId)
      .slice(0, 8)
      .map(adaptBackendProduct) || [];

  if (loading) {
    return (
      <div className="mb-16">
        <div className="container mx-auto">
          <h2 className="h2 mb-6 text-center xl:text-left">
            Produtos Relacionados
          </h2>
          <p className="text-center text-gray-500">Carregando produtos relacionados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-16">
        <div className="container mx-auto">
          <h2 className="h2 mb-6 text-center xl:text-left">
            Produtos Relacionados
          </h2>
          <p className="text-center text-red-500">Erro ao carregar produtos relacionados</p>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="container mx-auto">
        <h2 className="h2 mb-6 text-center xl:text-left">
          Produtos Relacionados
        </h2>
        <ProductSlider data={relatedProducts} />
      </div>
    </div>
  );
};
