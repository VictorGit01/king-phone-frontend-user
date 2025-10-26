import React from 'react';
import { useContacts } from '../../hooks/useContacts';
import { FaPhone, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaClock, FaInstagram, FaFacebook, FaTwitter, FaYoutube } from 'react-icons/fa';

const Contatos: React.FC = () => {
  const { contacts, loading, error } = useContacts();

  if (loading) {
    return (
      <div className="mb-16 pt-40 lg:pt-0">
        <div className="container mx-auto px-4">
          <div className="py-8 text-xl uppercase text-center">
            Carregando contatos...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-16 pt-40 lg:pt-0">
        <div className="container mx-auto px-4">
          <div className="py-8 text-center">
            <div className="text-red-500 text-xl mb-4">Erro ao carregar contatos</div>
            <p className="text-white/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!contacts) {
    return (
      <div className="mb-16 pt-40 lg:pt-0">
        <div className="container mx-auto px-4">
          <div className="py-8 text-center">
            <div className="text-white/70 text-xl">Nenhum contato encontrado</div>
          </div>
        </div>
      </div>
    );
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os produtos da King Phone.');
    window.open(`https://wa.me/${contacts.whatsapp.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const openGoogleMaps = () => {
    if (contacts.google_maps_url) {
      window.open(contacts.google_maps_url, '_blank');
    } else {
      const address = encodeURIComponent(contacts.address.full_address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    }
  };

  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    };
    return days[day] || day;
  };

  return (
    <div className="mb-16 pt-40 lg:pt-0">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Entre em Contato</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através de qualquer um dos canais abaixo.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Informações de Contato */}
          <div className="space-y-8">
            {/* Dados da Loja */}
            <div className="grad rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">{contacts.store_name}</h2>
              
              <div className="space-y-4">
                {/* Telefone */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaPhone className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Telefone</p>
                    <a 
                      href={`tel:${contacts.phone}`}
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      {contacts.phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaWhatsapp className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">WhatsApp</p>
                    <button 
                      onClick={openWhatsApp}
                      className="text-green-500 hover:text-green-400 transition-colors"
                    >
                      {contacts.whatsapp}
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Email</p>
                    <a 
                      href={`mailto:${contacts.email}`}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      {contacts.email}
                    </a>
                  </div>
                </div>

                {/* Endereço */}
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="w-6 h-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Endereço</p>
                    <button 
                      onClick={openGoogleMaps}
                      className="text-purple-500 hover:text-purple-400 transition-colors text-left"
                    >
                      {contacts.address.full_address}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Horário de Funcionamento */}
            <div className="grad rounded-2xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <FaClock className="w-6 h-6 text-accent" />
                <h3 className="text-xl font-bold text-white">Horário de Funcionamento</h3>
              </div>
              
              <div className="space-y-3">
                {Object.entries(contacts.business_hours).map(([day, hours]) => (
                  <div key={day} className="flex justify-between items-center py-2 border-b border-white/10 last:border-b-0">
                    <span className="font-medium text-white/80">{getDayName(day)}</span>
                    <span className={`font-semibold ${hours === 'Fechado' ? 'text-red-400' : 'text-green-400'}`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Redes Sociais */}
            {(contacts.social_media.instagram || contacts.social_media.facebook || 
              contacts.social_media.twitter || contacts.social_media.youtube) && (
              <div className="grad rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Siga-nos nas Redes Sociais</h3>
                
                <div className="flex space-x-4">
                  {contacts.social_media.instagram && (
                    <a 
                      href={contacts.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <FaInstagram className="w-6 h-6" />
                    </a>
                  )}
                  
                  {contacts.social_media.facebook && (
                    <a 
                      href={contacts.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <FaFacebook className="w-6 h-6" />
                    </a>
                  )}
                  
                  {contacts.social_media.twitter && (
                    <a 
                      href={contacts.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-blue-400 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <FaTwitter className="w-6 h-6" />
                    </a>
                  )}
                  
                  {contacts.social_media.youtube && (
                    <a 
                      href={contacts.social_media.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <FaYoutube className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contatos;
