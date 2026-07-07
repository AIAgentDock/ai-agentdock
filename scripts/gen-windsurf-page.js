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
  'Curated Windsurf / Devin Desktop rules for Cascade — copy to your project in one click'
);

html = html.replace(/<title>Windsurf Rules — AI Agent Dock<\/title>/, '<title>Windsurf / Devin Desktop Rules — AI Agent Dock</title>');
html = html.replace(
  'content="Curated Windsurf AI coding rules for Next.js, React, Supabase, Tailwind, Docker, and more. Copy rules to the Windsurf Rules panel in one click."',
  'content="Curated Windsurf / Devin Desktop rules for Cascade — Next.js, React, Supabase, Tailwind, Docker, and more. Copy to your project in one click."'
);
html = html.replace(
  'content="Windsurf Rules,AI coding rules,Next.js,React,Supabase,Tailwind"',
  'content="Windsurf Rules,Devin Desktop Rules,Cascade rules,AI coding rules,Next.js,React,Supabase,Tailwind"'
);
html = html.replaceAll(
  'content="Windsurf Rules — AI Agent Dock"',
  'content="Windsurf / Devin Desktop Rules — AI Agent Dock"'
);
html = html.replace(
  'content="Curated Windsurf AI coding rules for Next.js, React, Supabase, Tailwind, Docker, and more."',
  'content="Curated Windsurf / Devin Desktop rules for Cascade — Next.js, React, Supabase, Tailwind, Docker, and more."'
);
html = html.replace(
  'content="Search and copy curated Windsurf AI coding rules for your project."',
  'content="Search and copy curated Windsurf / Devin Desktop rules for Cascade."'
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
          <p>Persistent instructions for Windsurf / Devin Desktop Cascade. For workspace rules, create Markdown files under <code class="path-badge">.devin/rules/</code> (preferred), or legacy <code class="path-badge">.windsurf/rules/</code>. Legacy <code class="path-badge">.windsurfrules</code> files are still read.</p>
          <p>You can also manage rules from the Cascade <strong class="text-gray-300 font-medium">Customizations → Rules</strong> panel. Open any rule page and click <strong class="text-gray-300 font-medium">Copy Rule</strong> to paste into your project.</p>
        </div>
      </div>`
);

html = html.replace(
  '<p class="faq-item__answer">Open Windsurf → <strong class="text-gray-200 font-medium">Rules</strong> panel → import or paste the rule text. Windsurf uses these as persistent instructions across Cascade sessions.</p>',
  '<p class="faq-item__answer">For workspace rules, create Markdown files under <code class="path-badge">.devin/rules/</code> (preferred) or legacy <code class="path-badge">.windsurf/rules/</code> at your repo root. Legacy <code class="path-badge">.windsurfrules</code> files are still read. You can also manage rules from Cascade <strong class="text-gray-200 font-medium">Customizations → Rules</strong>.</p>'
);

html = html.replace(
  '"text": "Open Windsurf, go to the Rules panel, and import or paste the rule text. Windsurf uses these as persistent instructions across Cascade sessions."',
  '"text": "For workspace rules, create Markdown files under .devin/rules/ (preferred) or legacy .windsurf/rules/ at your repo root. Legacy .windsurfrules files are still read. You can also manage rules from Cascade Customizations → Rules."'
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
  '<link rel="canonical" href="https://ai-agentdock.com/windsurf" />'
);
html = html.replace(
  '<meta property="og:url" content="https://ai-agentdock.com/" />',
  '<meta property="og:url" content="https://ai-agentdock.com/windsurf" />'
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
