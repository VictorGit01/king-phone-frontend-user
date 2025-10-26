import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface ContactsData {
  id?: string;
  store_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
    full_address: string;
  };
  business_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  social_media: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
  google_maps_url: string;
  active: boolean;
}

export const useContacts = () => {
  const [contacts, setContacts] = useState<ContactsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar contatos:', err);
      setError(err.message || 'Erro ao carregar contatos');
      
      // Retornar dados padrão em caso de erro
      setContacts({
        store_name: 'King Phone',
        phone: '+5594992424762',
        whatsapp: '+5594992424762',
        email: 'contato@kingphone.com.br',
        address: {
          street: 'Av. Sen. Tancredo Neves - Valparaíso, 1 - Etapa E, Quadra 11',
          neighborhood: 'Valparaizo I',
          city: 'Valparaíso de Goiás',
          state: 'GO',
          zipcode: '',
          full_address: 'Av. Sen. Tancredo Neves - Valparaíso, 1 - Etapa E, Quadra 11 - Valparaizo I, Valparaíso de Goiás - GO'
        },
        business_hours: {
          monday: '08:00 - 18:00',
          tuesday: '08:00 - 18:00',
          wednesday: '08:00 - 18:00',
          thursday: '08:00 - 18:00',
          friday: '08:00 - 18:00',
          saturday: '08:00 - 16:00',
          sunday: 'Fechado'
        },
        social_media: {
          instagram: '',
          facebook: '',
          twitter: '',
          youtube: ''
        },
        google_maps_url: '',
        active: true
      });
    } finally {
      setLoading(false);
    }
  };

  return { contacts, loading, error, refetch: fetchContacts };
};
