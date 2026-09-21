/**
 * Event Tracking & Analytics Readiness for Hassan Electric & Traders (Item 85)
 * Compatible with Google Tag Manager (dataLayer) and Google Analytics 4 (gtag).
 * Does not collect unnecessary personal data.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  const eventPayload = {
    event: eventName,
    business: "Hassan Electric & Traders",
    timestamp: new Date().toISOString(),
    ...params,
  };

  // Google Tag Manager dataLayer
  if (window.dataLayer) {
    window.dataLayer.push(eventPayload);
  }

  // Google Analytics gtag
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // Debug log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event] ${eventName}:`, params);
  }
}

export const Analytics = {
  trackWhatsAppClick: (productName?: string, location: string = "floating_bar") => {
    trackEvent("whatsapp_click", {
      product_name: productName || "General Inquiry",
      placement: location,
    });
  },

  trackPhoneClick: (location: string = "floating_bar") => {
    trackEvent("phone_call_click", {
      phone_number: "03303000093",
      placement: location,
    });
  },

  trackDirectionsClick: (location: string = "shop_section") => {
    trackEvent("get_directions_click", {
      destination: "I&T Center, G-8/1, Islamabad",
      placement: location,
    });
  },

  trackProductView: (sku: string, productName: string, category: string) => {
    trackEvent("view_item", {
      items: [
        {
          item_id: sku,
          item_name: productName,
          item_category: category,
        },
      ],
    });
  },

  trackSearch: (searchQuery: string) => {
    trackEvent("search", {
      search_term: searchQuery,
    });
  },
};
