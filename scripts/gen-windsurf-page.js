'use strict';

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const outPath = path.join(__dirname, '..', 'windsurf.html');

let html = fs.readFileSync(indexPath, 'utf8');

html = html.replace('data-page-tool="cursor"', 'data-page-tool="windsurf"');
html = html.replace(/Cursor Rules/g, 'Windsurf Rules');
html = html.replace(/Curated Cursor AI/g, 'Curated Windsurf AI');
html = html.replace(
  /Copy rules to \.cursor\/rules\/ in one click\./,
  'Copy rules to the Windsurf Rules panel in one click.'
);
html = html.replace(
  /Search and copy curated Cursor AI coding rules for your project\./,
  'Search and copy curated Windsurf AI coding rules for your project.'
);
html = html.replace('Cursor · AI Rules', 'Windsurf · AI Rules');
html = html.replace(
  'Curated AI coding rules for Cursor — copy to your project in one click',
  'Curated AI coding rules for Windsurf — copy to your project in one click'
);

html = html.replace(
  `<div class="tool-usage mb-2">
        <div class="tool-usage__panel">
          <h2 class="tool-usage__title">How to use Cursor Rules</h2>
          <p>Persistent instructions for Cursor Agent and Chat. Place them in <code class="path-badge">.cursor/rules/</code> as <code class="path-badge">.mdc</code> or Markdown files at your repo root.</p>
          <p>Cursor applies them automatically. Open any rule page and click <strong class="text-gray-300 font-medium">Copy Rule</strong> to paste into your project.</p>
          <p>See <a href="rules/cursor-agent-skills.html">Cursor Agent &amp; Skills rules</a> for workflow tips.</p>
        </div>
      </div>`,
  `<div class="tool-usage mb-2">
        <div class="tool-usage__panel">
          <h2 class="tool-usage__title">How to use Windsurf Rules</h2>
          <p>Persistent instructions for Windsurf Cascade sessions. Open Windsurf → <strong class="text-gray-300 font-medium">Rules</strong> panel → import or paste the rule text.</p>
          <p>Windsurf uses these across all Cascade conversations. Browse the directory, copy a rule, and paste into the Rules panel.</p>
          <p>Tip: Trim sections after copying to fit your project and avoid overrunning the AI context window.</p>
        </div>
      </div>`
);

html = html.replace('Narrow Cursor rules', 'Narrow Windsurf rules');
html = html.replace(
  'class="site-nav__dropdown-item site-nav__dropdown-item--active" role="menuitem">Cursor',
  'class="site-nav__dropdown-item" role="menuitem">Cursor'
);
html = html.replace(
  'class="site-nav__dropdown-item" role="menuitem">Windsurf',
  'class="site-nav__dropdown-item site-nav__dropdown-item--active" role="menuitem">Windsurf'
);

html = html.replace(
  '<details class="sidebar-panel" open>\n          <summary class="sidebar-panel__summary"><a href="index.html" class="sidebar-panel__tool-link sidebar-panel__tool-link--active">Cursor</a>',
  '<details class="sidebar-panel">\n          <summary class="sidebar-panel__summary"><a href="index.html" class="sidebar-panel__tool-link">Cursor</a>'
);
html = html.replace(
  '<details class="sidebar-panel">\n          <summary class="sidebar-panel__summary"><a href="windsurf.html" class="sidebar-panel__tool-link">Windsurf</a>',
  '<details class="sidebar-panel" open>\n          <summary class="sidebar-panel__summary"><a href="windsurf.html" class="sidebar-panel__tool-link sidebar-panel__tool-link--active">Windsurf</a>'
);

html = html.replace(
  '<link rel="canonical" href="https://ai-agentdock.com/" />',
  '<link rel="canonical" href="https://ai-agentdock.com/windsurf.html" />'
);
html = html.replace(
  '<meta property="og:url" content="https://ai-agentdock.com/" />',
  '<meta property="og:url" content="https://ai-agentdock.com/windsurf.html" />'
);
html = html.replace(
  '"target": "https://ai-agentdock.com/?q={search_term_string}"',
  '"target": "https://ai-agentdock.com/windsurf.html?q={search_term_string}"'
);
html = html.replace(
  '"url": "https://ai-agentdock.com/"',
  '"url": "https://ai-agentdock.com/windsurf.html"'
);

fs.writeFileSync(outPath, html, 'utf8');
console.log('wrote windsurf.html');
