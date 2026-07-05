/**
 * Load Plausible / GA4 and Google Search Console verification from SITE_CONFIG.
 * Include after site-config.js in <head>.
 */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};

  if (cfg.googleSiteVerification) {
    var existing = document.querySelector('meta[name="google-site-verification"]');
    if (!existing) {
      var verify = document.createElement('meta');
      verify.name = 'google-site-verification';
      verify.content = cfg.googleSiteVerification;
      document.head.appendChild(verify);
    }
  }

  if (cfg.plausibleDomain) {
    var pl = document.createElement('script');
    pl.defer = true;
    pl.dataset.domain = cfg.plausibleDomain;
    pl.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(pl);
  }

  if (cfg.ga4MeasurementId) {
    var gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4MeasurementId);
    document.head.appendChild(gtagScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4MeasurementId);
  }
})();
