const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

type GtagEventParams = Record<string, unknown>;

export const trackPageView = (path: string) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
};

export const trackEvent = (eventName: string, params?: GtagEventParams) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
};

interface CartAnalyticsProduct {
  id: string;
  title: string;
  price: number;
  category: string;
}

export const trackAddToCart = (product: CartAnalyticsProduct, quantity: number) => {
  trackEvent("add_to_cart", {
    currency: "BRL",
    value: product.price * quantity,
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        price: product.price,
        quantity,
        item_category: product.category,
      },
    ],
  });
};

export type WhatsAppClickLocation = "cart_checkout" | "contacts" | "footer" | "footer_group";

export const trackWhatsAppClick = (
  location: WhatsAppClickLocation,
  options?: { value?: number; itemCount?: number }
) => {
  trackEvent("whatsapp_click", {
    link_location: location,
    currency: options?.value !== undefined ? "BRL" : undefined,
    value: options?.value,
    item_count: options?.itemCount,
  });
};
