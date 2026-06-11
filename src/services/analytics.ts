const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const isAnalyticsEnabled = Boolean(GA_MEASUREMENT_ID);

export const initAnalytics = () => {
  if (!GA_MEASUREMENT_ID || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.onload = () => {
    trackPageView(`${window.location.pathname}${window.location.search}`);
  };
  document.head.appendChild(script);
};

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
