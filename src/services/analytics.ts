const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

export const trackPageView = (path: string) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
) => {
  if (!GA_MEASUREMENT_ID || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, params);
};
