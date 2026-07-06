/**
 * Build static rule detail pages, SEO directory, and sitemap from rules.js.
 * Usage: node scripts/build.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const RULES_JS = path.join(ROOT, 'rules.js');
const RULES_DIR = path.join(ROOT, 'rules');
const DIST_STATIC_FILES = [
  'index.html',
  'about.html',
  'submit.html',
  'privacy.html',
  'app.js',
  'rules.js',
  'styles.css',
  'site-config.js',
  'site-init.js',
  'analytics.js',
  'filter-taxonomy.js',
  'sitemap.xml',
  'robots.txt',
  'favicon.svg',
  '_redirects'
];
const INDEX_HTML = path.join(ROOT, 'index.html');
const SITEMAP = path.join(ROOT, 'sitemap.xml');
const SITE_URL = 'https://ai-agentdock.com';
const GITHUB_URL = 'https://github.com/AIAgentDock/ai-agentdock';

function loadSiteConfig() {
  const content = fs.readFileSync(path.join(ROOT, 'site-config.js'), 'utf8');
  const sandbox = { window: {} };
  require('vm').runInNewContext(content, sandbox);
  return sandbox.window.SITE_CONFIG || {};
}

function rulePageUrl(ruleId) {
  return SITE_URL + '/rules/' + ruleId;
}

function rulePagePath(ruleId) {
  return 'rules/' + ruleId + '.html';
}

function verificationMetaHtml(config) {
  if (!config.googleSiteVerification) {
    return '';
  }
  return '  <meta name="google-site-verification" content="' + escapeHtml(config.googleSiteVerification) + '" />\n';
}

function analyticsScriptsHtml(depth) {
  var prefix = depth === 0 ? '' : '../';
  return (
    '  <script src="' + prefix + 'site-config.js"></script>\n' +
    '  <script src="' + prefix + 'site-init.js"></script>\n' +
    '  <script src="' + prefix + 'analytics.js"></script>\n'
  );
}

function loadRules() {
  const content = fs.readFileSync(RULES_JS, 'utf8');
  const sandbox = { window: {} };
  const vm = require('vm');
  vm.runInNewContext(content, sandbox);
  if (!Array.isArray(sandbox.window.RULES_DATA)) {
    throw new Error('RULES_DATA not found in rules.js');
  }
  return sandbox.window.RULES_DATA;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function navHtml(active, config) {
  const links = [
    { href: 'index.html', label: 'Directory', key: 'home' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'submit.html', label: 'Submit', key: 'submit' }
  ];

  if (config.showGithub) {
    links.push({ href: GITHUB_URL, label: 'GitHub', key: 'github', external: true });
  }

  const homeHref = active === 'home' ? 'index.html' : '../index.html';
  const items = links.map(function (link) {
    var href = link.key === 'home' ? homeHref : (link.external ? link.href : '../' + link.href);
    var cls = link.key === active ? ' site-nav__link site-nav__link--active' : ' site-nav__link';
    var extra = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a href="' + href + '" class="' + cls.trim() + '"' + extra + '>' + link.label + '</a>';
  }).join('\n        ');

  return (
    '<nav class="site-nav flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12" aria-label="Main navigation">\n' +
    '      <a href="' + homeHref + '" class="text-lg font-bold text-white tracking-tight">AI Agent Dock</a>\n' +
    '      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">\n' +
    '        ' + items + '\n' +
    '      </div>\n' +
    '    </nav>'
  );
}

function tailwindHead() {
  return (
    '  <link rel="stylesheet" href="../styles.css" />\n' +
    '  <script src="https://cdn.tailwindcss.com"></script>\n' +
    '  <script>\n' +
    '    tailwind.config = {\n' +
    '      theme: {\n' +
    '        extend: {\n' +
    '          colors: {\n' +
    "            surface: { DEFAULT: '#0a0a0f', card: '#12121a', hover: '#1a1a26' },\n" +
    "            accent: { DEFAULT: '#6366f1', glow: '#818cf8', cyan: '#22d3ee' },\n" +
    '          },\n' +
    '        },\n' +
    '      },\n' +
    '    };\n' +
    '  </script>'
  );
}

function footerHtml() {
  return (
    '    <footer class="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-800/60 text-center text-gray-600 text-xs sm:text-sm">\n' +
    '      <p>AI Agent Dock · Open-source rule directory</p>\n' +
    '      <nav class="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Footer navigation">\n' +
    '        <a href="../about.html" class="hover:text-indigo-300 transition-colors">About</a>\n' +
    '        <a href="../privacy.html" class="hover:text-indigo-300 transition-colors">Privacy</a>\n' +
    '        <a href="../submit.html" class="hover:text-indigo-300 transition-colors">Submit a Rule</a>\n' +
    '      </nav>\n' +
    '      <p class="mt-2 text-gray-700">&copy; 2026 AI Agent Dock</p>\n' +
    '    </footer>'
  );
}

function toolHint(tool) {
  const t = String(tool || '').toLowerCase();
  if (t === 'windsurf') {
    return 'Import via Windsurf → Rules panel in your editor.';
  }
  return 'Paste into .cursor/rules/ (or .mdc files) in your project root.';
}

function generateRulePage(rule, config) {
  const tool = escapeHtml(rule.tool || 'Cursor');
  const category = escapeHtml(rule.category || '');
  const framework = escapeHtml(rule.framework || '');
  const title = escapeHtml(rule.title);
  const description = escapeHtml(rule.description || '');
  const content = escapeHtml(rule.content || '');
  const hint = escapeHtml(toolHint(rule.tool));
  const canonical = rulePageUrl(rule.id);
  const tags = (rule.tags || []).map(function (t) {
    return '<span class="tag-chip tag-chip--static">' + escapeHtml(t) + '</span>';
  }).join('\n          ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — AI Agent Dock</title>
  <meta name="description" content="${description}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
${verificationMetaHtml(config)}${analyticsScriptsHtml(1)}  <meta property="og:type" content="article" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
${tailwindHead()}
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": ${JSON.stringify(rule.title)},
    "description": ${JSON.stringify(rule.description || '')},
    "url": ${JSON.stringify(canonical)},
    "mainEntityOfPage": ${JSON.stringify(canonical)},
    "author": { "@type": "Organization", "name": "AI Agent Dock" }
  }
  </script>
</head>
<body class="text-gray-300 antialiased overflow-x-hidden">

  <div class="fixed inset-0 bg-grid pointer-events-none" aria-hidden="true"></div>
  <div class="fixed inset-0 hero-glow pointer-events-none" aria-hidden="true"></div>

  <div class="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">

${navHtml('', config)}

    <header class="mb-6 sm:mb-8">
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span class="rule-badge rule-badge--tool">${tool.toUpperCase()}</span>
        <span class="rule-badge rule-badge--category">${category.toUpperCase()}</span>
        <span class="rule-badge rule-badge--framework">${framework}</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">${title}</h1>
      <p class="text-gray-400 text-base leading-relaxed">${description}</p>
      <div class="flex flex-wrap gap-1.5 mt-4">${tags}</div>
    </header>

    <main class="rule-detail">
      <pre class="rule-detail__content" id="ruleContent">${content}</pre>
      <p class="rule-detail__hint text-sm text-gray-500 mt-4">${hint}</p>
      <div class="flex flex-col sm:flex-row gap-3 mt-6">
        <button type="button" id="copyRuleBtn" class="btn-copy py-3 px-6 min-h-[44px] rounded-lg text-white font-semibold text-sm">Copy Rule</button>
        <a href="../index.html" class="inline-flex items-center justify-center py-3 px-6 min-h-[44px] rounded-lg border border-gray-700 text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 text-sm font-medium transition-colors">← Back to directory</a>
      </div>
    </main>

${footerHtml()}
  </div>

  <div id="toastContainer" class="toast-container" aria-live="polite"></div>

  <script>
    (function () {
      var content = document.getElementById('ruleContent').textContent;
      var btn = document.getElementById('copyRuleBtn');
      var hint = ${JSON.stringify(toolHint(rule.tool))};
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(content).then(function () {
          btn.classList.add('copied');
          btn.textContent = 'Copied!';
          var toast = document.createElement('div');
          toast.className = 'toast toast--visible';
          toast.setAttribute('role', 'status');
          toast.textContent = 'Rule copied! ' + hint;
          document.getElementById('toastContainer').appendChild(toast);
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.textContent = 'Copy Rule';
            toast.remove();
          }, 3000);
        });
      });
    })();
  </script>
</body>
</html>
`;
}

function generateSeoDirectory(rules) {
  const items = rules.map(function (rule) {
    return (
      '        <li>\n' +
      '          <h3 class="font-semibold text-gray-200"><a href="' + rulePagePath(rule.id) + '" class="hover:text-indigo-300 transition-colors">' + escapeHtml(rule.title) + '</a></h3>\n' +
      '          <p class="text-gray-500 mt-1">' + escapeHtml(rule.description || '') + '</p>\n' +
      '        </li>'
    );
  }).join('\n');

  return (
    '    <section class="seo-section mt-12 sm:mt-16 pt-8 sm:pt-10" aria-labelledby="rules-directory-heading">\n' +
    '      <h2 id="rules-directory-heading" class="text-xl sm:text-2xl font-bold mb-6">Available Rules Directory</h2>\n' +
    '      <ul class="space-y-4 text-sm sm:text-base">\n' +
    items + '\n' +
    '      </ul>\n' +
    '    </section>'
  );
}

function updateIndexSeoDirectory(rules) {
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  const startMarker = '<!-- SEO-DIRECTORY:START -->';
  const endMarker = '<!-- SEO-DIRECTORY:END -->';
  const section = generateSeoDirectory(rules);
  const replacement = startMarker + '\n' + section + '\n    ' + endMarker;

  if (html.includes(startMarker)) {
    html = html.replace(new RegExp(startMarker + '[\\s\\S]*?' + endMarker), replacement);
  } else {
    html = html.replace(
      /<section class="seo-section mt-12 sm:mt-16 pt-8 sm:pt-10" aria-labelledby="rules-directory-heading">[\s\S]*?<\/section>/,
      replacement
    );
  }

  fs.writeFileSync(INDEX_HTML, html, 'utf8');
}

function updateItemListSchema(rules) {
  let html = fs.readFileSync(INDEX_HTML, 'utf8');
  const startMarker = '<!-- ITEMLIST-SCHEMA:START -->';
  const endMarker = '<!-- ITEMLIST-SCHEMA:END -->';

  const items = rules.map(function (rule, index) {
    return (
      '      {\n' +
      '        "@type": "ListItem",\n' +
      '        "position": ' + (index + 1) + ',\n' +
      '        "name": ' + JSON.stringify(rule.title) + ',\n' +
      '        "url": ' + JSON.stringify(rulePageUrl(rule.id)) + '\n' +
      '      }'
    );
  }).join(',\n');

  const schema =
    '  <script type="application/ld+json">\n' +
    '  {\n' +
    '    "@context": "https://schema.org",\n' +
    '    "@type": "ItemList",\n' +
    '    "name": "AI Agent Dock Rules",\n' +
    '    "numberOfItems": ' + rules.length + ',\n' +
    '    "itemListElement": [\n' +
    items + '\n' +
    '    ]\n' +
    '  }\n' +
    '  </script>';

  const replacement = startMarker + '\n' + schema + '\n  ' + endMarker;
  html = html.replace(new RegExp(startMarker + '[\\s\\S]*?' + endMarker), replacement);
  fs.writeFileSync(INDEX_HTML, html, 'utf8');
}

function injectVerificationMeta(config) {
  if (!config.googleSiteVerification) {
    return;
  }

  const meta = '  <meta name="google-site-verification" content="' + escapeHtml(config.googleSiteVerification) + '" />';
  const pages = ['index.html', 'about.html', 'submit.html', 'privacy.html'];

  pages.forEach(function (file) {
    const filePath = path.join(ROOT, file);
    let html = fs.readFileSync(filePath, 'utf8');
    if (html.includes('name="google-site-verification"')) {
      html = html.replace(/<meta name="google-site-verification" content="[^"]*" \/>/g, meta);
    } else if (html.includes('<script src="site-config.js"></script>')) {
      html = html.replace('<script src="site-config.js"></script>', meta + '\n  <script src="site-config.js"></script>');
    }
    fs.writeFileSync(filePath, html, 'utf8');
  });
}

function generateSitemap(rules) {
  const today = new Date().toISOString().slice(0, 10);
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/about.html', priority: '0.6', changefreq: 'monthly' },
    { loc: '/privacy.html', priority: '0.4', changefreq: 'yearly' },
    { loc: '/submit.html', priority: '0.7', changefreq: 'monthly' }
  ];

  let urls = staticPages.map(function (p) {
    return (
      '  <url>\n' +
      '    <loc>' + SITE_URL + p.loc + '</loc>\n' +
      '    <lastmod>' + today + '</lastmod>\n' +
      '    <changefreq>' + p.changefreq + '</changefreq>\n' +
      '    <priority>' + p.priority + '</priority>\n' +
      '  </url>'
    );
  });

  rules.forEach(function (rule) {
    urls.push(
      '  <url>\n' +
      '    <loc>' + rulePageUrl(rule.id) + '</loc>\n' +
      '    <lastmod>' + today + '</lastmod>\n' +
      '    <changefreq>monthly</changefreq>\n' +
      '    <priority>0.8</priority>\n' +
      '  </url>'
    );
  });

  const xml = (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') + '\n' +
    '</urlset>\n'
  );

  fs.writeFileSync(SITEMAP, xml, 'utf8');
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.readdirSync(srcDir).forEach(function (name) {
    const srcPath = path.join(srcDir, name);
    const destPath = path.join(destDir, name);
    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
      return;
    }
    fs.copyFileSync(srcPath, destPath);
  });
}

function copySiteToDist() {
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  DIST_STATIC_FILES.forEach(function (file) {
    const srcPath = path.join(ROOT, file);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(DIST, file));
    }
  });

  copyDir(RULES_DIR, path.join(DIST, 'rules'));

  fs.writeFileSync(
    path.join(DIST, '.assetsignore'),
    '# Generated by scripts/build.js\n*.map\n.DS_Store\n',
    'utf8'
  );

  console.log('  copied site to dist/');
}

function main() {
  const rules = loadRules();
  const config = loadSiteConfig();

  if (!fs.existsSync(RULES_DIR)) {
    fs.mkdirSync(RULES_DIR, { recursive: true });
  }

  const existing = fs.readdirSync(RULES_DIR).filter(function (f) { return f.endsWith('.html'); });
  const expected = new Set(rules.map(function (r) { return r.id + '.html'; }));

  existing.forEach(function (file) {
    if (!expected.has(file)) {
      fs.unlinkSync(path.join(RULES_DIR, file));
    }
  });

  rules.forEach(function (rule) {
    const outPath = path.join(RULES_DIR, rule.id + '.html');
    fs.writeFileSync(outPath, generateRulePage(rule, config), 'utf8');
    console.log('  wrote rules/' + rule.id + '.html');
  });

  updateIndexSeoDirectory(rules);
  console.log('  updated index.html SEO directory');

  updateItemListSchema(rules);
  console.log('  updated ItemList schema');

  injectVerificationMeta(config);

  generateSitemap(rules);
  console.log('  updated sitemap.xml');

  copySiteToDist();

  console.log('Built ' + rules.length + ' rule pages.');
}

main();
