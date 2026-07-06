/**
 * Apply SITE_CONFIG visibility toggles (GitHub links, etc.).
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

})();
