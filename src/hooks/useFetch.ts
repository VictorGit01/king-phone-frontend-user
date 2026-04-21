import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { logger } from '../utils/logger';

interface Product {
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

interface Banner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  link_url: string;
  active: boolean;
  order: number;
  layout?: 'left-content' | 'right-content' | 'center-content' | 'overlay-bottom' | 'overlay-top' | 'overlay-center';
  created_at: string;
  updated_at: string;
}

interface UseFetchResult {
  data: Product[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useFetch = (endpoint: string): UseFetchResult => {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get(endpoint);

      setData(response.data);
    } catch (err: any) {
  logger.error(`❌ Erro ao buscar ${endpoint}:`, err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// 🆕 Hook específico para produtos
export const useProducts = () => {
  return useFetch('/products');
};

// 🆕 Hook para produto específico
export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get(`/products/${id}`);

        setProduct(response.data);
      } catch (err: any) {
  logger.error(`❌ Erro ao buscar produto ${id}:`, err);
        setError(err.message || 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  return { product, loading, error };
};

// 🆕 Hook para banners
export const useBanners = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);

  logger.debug('🔍 Buscando banners...');

        const response = await api.get('/banners');

        // Filtrar apenas banners ativos e ordenar
        const activeBanners = response.data
          .filter((banner: Banner) => banner.active)
          .sort((a: Banner, b: Banner) => a.order - b.order);

        setBanners(activeBanners);
      } catch (err: any) {
  logger.error('❌ Erro ao buscar banners:', err);
        setError(err.message || 'Erro ao carregar banners');
        setBanners([]); // Array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  return { banners, loading, error };
};

// 🆕 Hook para promoções
export const usePromotions = () => {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/promotions');

        // Filtrar apenas promoções ativas, com dados válidos e ordenar por posição
        const activePromotions = response.data
          .filter((promotion: any) => 
            promotion.active && 
            promotion.title && 
            promotion.title.trim() !== '' &&
            // Permitir discount_percent = 0 para promoções "Pague X Leve Y"
            (promotion.discount_percent > 0 || 
             (promotion.promotion_type === 'buy_x_get_y' && promotion.min_quantity && promotion.get_quantity))
          )
          .sort((a: any, b: any) => a.position - b.position);

        setPromotions(activePromotions);
      } catch (err: any) {
  logger.error('❌ Erro ao buscar promoções:', err);
        setError(err.message || 'Erro ao carregar promoções');
        setPromotions([]); // Array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return { promotions, loading, error };
};

// Hook para configurações do sistema
export const useSettings = () => {
  const [settings, setSettings] = useState<any>({
    show_static_banner: true,
    site_name: 'King Phone',
    site_description: 'Os melhores celulares e acessórios',
    maintenance_mode: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/settings');
        setSettings(response.data);
      } catch (err: any) {
  logger.error('❌ Erro ao buscar configurações:', err);
        setError(err.message || 'Erro ao carregar configurações');
        // Manter configurações padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};