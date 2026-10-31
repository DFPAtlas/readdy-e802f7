'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { hasConsentFor } from '@/lib/analytics';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-ZC4Y8SMRR7';

export default function GoogleAnalytics() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const allowed = hasConsentFor('analytics');
      // Disable an already loaded tag immediately when consent is withdrawn.
      Object.assign(window, { [`ga-disable-${GA_MEASUREMENT_ID}`]: !allowed });
      if (allowed && !window.GA_LOADED) {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
        window.gtag('consent', 'default', {
          analytics_storage: 'denied', ad_storage: 'denied',
          functionality_storage: 'denied', personalization_storage: 'denied',
        });
        window.gtag('js', new Date());
        window.GA_LOADED = true;
      }
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
          analytics_storage: allowed ? 'granted' : 'denied',
          ad_storage: hasConsentFor('marketing') ? 'granted' : 'denied',
          functionality_storage: hasConsentFor('functional') ? 'granted' : 'denied',
          personalization_storage: hasConsentFor('functional') ? 'granted' : 'denied',
        });
        if (allowed) window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
      }
      if (!allowed) {
        // Remove first-party GA cookies without touching necessary session cookies.
        const hostParts = window.location.hostname.split('.');
        const domains = ['', ...hostParts.map((_, index) => hostParts.slice(index).join('.'))];
        for (const cookie of document.cookie.split(';')) {
          const name = cookie.split('=')[0].trim();
          if (!/^(_ga|_gid|_gat)(_|$)/.test(name)) continue;
          for (const domain of domains) {
            document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
          }
        }
      }
      setAnalyticsAllowed(allowed);
    };
    syncConsent();
    window.addEventListener('storage', syncConsent);
    window.addEventListener('dfp-consent-updated', syncConsent);
    return () => {
      window.removeEventListener('storage', syncConsent);
      window.removeEventListener('dfp-consent-updated', syncConsent);
    };
  }, []);

  if (!analyticsAllowed) return null;
  return <Script id="google-analytics-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />;
}
