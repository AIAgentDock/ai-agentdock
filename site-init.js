/**
 * Apply SITE_CONFIG visibility toggles and canonical URLs.
 * Include after site-config.js in <head> or before </body>.
 */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};

  if (!cfg.showGithub) {
    document.querySelectorAll('.site-github-link').forEach(function (el) {
      el.classList.add('hidden');
    });
  }

  var SITE_ORIGIN = 'https://ai-agentdock.com';
  var pathname = window.location.pathname || '/';

  function resolveCanonicalPath() {
    if (/\/windsurf(?:\.html)?\/?$/i.test(pathname)) {
      return '/windsurf';
    }
    if (/\/cursor(?:\.html)?\/?$/i.test(pathname)) {
      return '/cursor';
    }
    return '/';
  }

  var canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute('href', SITE_ORIGIN + resolveCanonicalPath());
  }

})();
