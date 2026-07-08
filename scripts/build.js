/**
 * Build static rule detail pages, SEO directory, and sitemap from rules.js.
 * Usage: node scripts/build.js
 */
'use strict';

const fs = require('fs');
const fsp = fs.promises;
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const RULES_JS = path.join(ROOT, 'rules.js');
const RULES_DIR = path.join(ROOT, 'rules');
const DIST_STATIC_FILES = [
  'index.html',
  'cursor.html',
  'windsurf.html',
  'about.html',
  'submit.html',
  'privacy.html',
  'app.js',
  'extra-assets.js',
  'rules.js',
  'styles.css',
  'site-config.js',
  'site-init.js',
  'analytics.js',
  'filter-taxonomy.js',
  'sitemap.xml',
  'robots.txt',
  'favicon.svg'
];
const INDEX_HTML = path.join(ROOT, 'index.html');
const CURSOR_HTML = path.join(ROOT, 'cursor.html');
const WINDSURF_HTML = path.join(ROOT, 'windsurf.html');
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
  return 'rules/' + ruleId;
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
  const extraPath = path.join(ROOT, 'extra-assets.js');
  const content = fs.readFileSync(RULES_JS, 'utf8');
  const extraContent = fs.existsSync(extraPath) ? fs.readFileSync(extraPath, 'utf8') : '';
  const sandbox = { window: {} };
  const vm = require('vm');
  if (extraContent) {
    vm.runInNewContext(extraContent, sandbox);
  }
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

function normalizeActiveToolKey(tool) {
  var value = String(tool || '').trim().toLowerCase();
  if (value === 'claude code') {
    return 'claude-code';
  }
  if (value === 'github copilot') {
    return 'github-copilot';
  }
  return value.replace(/\s+/g, '-');
}

function normalizeToolKey(rule) {
  var tool = String(rule.tool || 'Cursor').trim().toLowerCase();
  if (tool === 'claude code') {
    return 'claude-code';
  }
  if (tool === 'github copilot') {
    return 'github-copilot';
  }
  return tool.replace(/\s+/g, '-');
}

function normalizeAssetTypeKey(rule) {
  var raw = String(rule.assetType || 'Rules').trim().toLowerCase();
  if (raw === 'mcp configs' || raw === 'mcp-configs') {
    return 'mcp-configs';
  }
  return raw.replace(/\s+/g, '-');
}

function getCopyButtonLabel(assetTypeKey) {
  var labels = {
    rules: 'Copy Rule',
    roles: 'Copy Role',
    skills: 'Copy Skill',
    hooks: 'Copy Hook',
    workflows: 'Copy Workflow',
    'mcp-configs': 'Copy MCP Config'
  };
  return labels[assetTypeKey] || 'Copy';
}

function getCopiedToastPrefix(assetTypeKey) {
  var labels = {
    rules: 'Rule',
    roles: 'Role',
    skills: 'Skill',
    hooks: 'Hook',
    workflows: 'Workflow',
    'mcp-configs': 'MCP config'
  };
  return (labels[assetTypeKey] || 'Asset') + ' copied!';
}

function assetTypeNoun(assetTypeKey) {
  var labels = {
    rules: 'rule',
    roles: 'role',
    skills: 'skill',
    hooks: 'hook',
    workflows: 'workflow',
    'mcp-configs': 'MCP config'
  };
  return labels[assetTypeKey] || 'asset';
}

function directoryNavHtml(activeTool, depth) {
  var prefix = depth === 0 ? '' : '../';
  var homeHref = prefix + 'index.html';
  var tools = [
    { key: 'all', href: homeHref + '#directory', label: 'All Assets' },
    { key: 'cursor', href: prefix + 'cursor.html', label: 'Cursor' },
    { key: 'windsurf', href: prefix + 'windsurf.html', label: 'Windsurf' },
    { key: 'claude-code', href: homeHref + '?tool=claude-code#directory', label: 'Claude Code' },
    { key: 'github-copilot', href: homeHref + '?tool=github-copilot#directory', label: 'GitHub Copilot' },
    { key: 'codex', href: homeHref + '?tool=codex#directory', label: 'Codex' },
    { key: 'mcp', href: homeHref + '?tool=mcp#directory', label: 'MCP' }
  ];
  var triggerActive = activeTool ? ' site-nav__link--active' : '';
  var items = tools.map(function (tool) {
    var active = activeTool === tool.key ? ' site-nav__dropdown-item--active' : '';
    return '            <a href="' + tool.href + '" class="site-nav__dropdown-item' + active + '" role="menuitem">' + tool.label + '</a>';
  }).join('\n');

  return (
    '<div class="site-nav__dropdown">\n' +
    '          <span class="site-nav__link' + triggerActive + ' site-nav__dropdown-trigger" tabindex="0">\n' +
    '            Directory\n' +
    '            <svg class="site-nav__dropdown-caret" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>\n' +
    '          </span>\n' +
    '          <div class="site-nav__dropdown-menu" role="menu">\n' +
    items + '\n' +
    '          </div>\n' +
    '        </div>'
  );
}

function navHtml(active, config, activeTool) {
  var depth = active === 'home' || active === 'windsurf' || active === 'cursor' ? 0 : 1;
  var prefix = depth === 0 ? '' : '../';
  var homeHref = prefix + 'index.html';
  var faqHref = homeHref + '#faq';

  var links = [
    { href: faqHref, label: 'FAQ', key: 'faq' },
    { href: prefix + 'about.html', label: 'About', key: 'about' },
    { href: prefix + 'submit.html', label: 'Submit', key: 'submit' }
  ];

  if (config.showGithub) {
    links.push({ href: GITHUB_URL, label: 'GitHub', key: 'github', external: true });
  }

  var items = directoryNavHtml(activeTool || '', depth);
  items += '\n        ' + links.map(function (link) {
    var cls = link.key === active ? ' site-nav__link site-nav__link--active' : ' site-nav__link';
    var extra = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a href="' + link.href + '" class="' + cls.trim() + '"' + extra + '>' + link.label + '</a>';
  }).join('\n        ');

  return (
    '<nav class="site-nav flex flex-wrap items-center justify-between gap-4 mb-8 sm:mb-12" aria-label="Main navigation">\n' +
    '      <a href="' + homeHref + '" class="site-brand">AI Agent Dock</a>\n' +
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
    '      <p>AI Agent Dock · Copy-ready AI coding assets directory</p>\n' +
    '      <nav class="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1" aria-label="Footer navigation">\n' +
    '        <a href="../about.html" class="hover:text-indigo-300 transition-colors">About</a>\n' +
    '        <a href="../privacy.html" class="hover:text-indigo-300 transition-colors">Privacy</a>\n' +
    '        <a href="../submit.html" class="hover:text-indigo-300 transition-colors">Submit an Asset</a>\n' +
    '      </nav>\n' +
    '      <p class="mt-2 text-gray-700">&copy; 2026 AI Agent Dock</p>\n' +
    '    </footer>'
  );
}

function assetUsageHint(rule) {
  var tool = normalizeToolKey(rule);
  var assetType = normalizeAssetTypeKey(rule);

  if (assetType === 'rules') {
    if (tool === 'windsurf') {
      return 'Save as Markdown under .devin/rules/*.md (preferred) or .windsurf/rules/*.md, or paste via Cascade → Customizations → Rules.';
    }
    if (tool === 'cursor') {
      return 'Paste into .cursor/rules/ (or .mdc files) in your project root.';
    }
    if (tool === 'claude-code') {
      return 'Paste into CLAUDE.md, project instructions, or use as a slash-command prompt.';
    }
    if (tool === 'github-copilot') {
      return 'Add to .github/copilot-instructions.md or paste into Copilot Chat.';
    }
    if (tool === 'codex') {
      return 'Paste into your Codex instructions or system prompt.';
    }
    if (tool === 'mcp') {
      return 'Use as guidance when building or configuring an MCP server.';
    }
    return 'Paste into your editor\'s rules or instructions file.';
  }

  if (assetType === 'roles') {
    if (tool === 'cursor') {
      return 'Paste into Cursor Agent or Chat as a role prompt to set the AI\'s persona for a session.';
    }
    if (tool === 'windsurf') {
      return 'Paste into Cascade Chat as a role prompt, or save under .devin/rules/ if you want it applied automatically.';
    }
    if (tool === 'claude-code') {
      return 'Paste into CLAUDE.md or use as a Claude Code role prompt.';
    }
    if (tool === 'github-copilot') {
      return 'Paste into Copilot Chat or add to .github/copilot-instructions.md.';
    }
    if (tool === 'codex') {
      return 'Paste into your Codex system prompt or instructions.';
    }
    return 'Paste into your AI coding agent as a role or persona prompt.';
  }

  if (assetType === 'skills') {
    if (tool === 'windsurf') {
      return 'Paste into Cascade Chat before starting a task to guide the AI through a multi-step skill.';
    }
    if (tool === 'github-copilot') {
      return 'Paste into Copilot Chat before starting a task.';
    }
    if (tool === 'codex') {
      return 'Paste into Codex before starting a multi-step task.';
    }
    if (tool === 'claude-code') {
      return 'Paste into Claude Code before starting a multi-step task.';
    }
    return 'Paste into your AI coding agent before starting a task to guide a multi-step workflow.';
  }

  if (assetType === 'hooks') {
    if (tool === 'cursor') {
      return 'Add to Cursor hooks configuration, or paste before a task in Agent or Chat.';
    }
    if (tool === 'windsurf') {
      return 'Paste into Cascade Chat before starting a task as a short pre-task instruction.';
    }
    if (tool === 'claude-code') {
      return 'Paste into Claude Code before starting a task, or add as a hook-style prompt.';
    }
    return 'Paste before starting a coding task as a short pre-task instruction.';
  }

  if (assetType === 'workflows') {
    if (tool === 'github-copilot') {
      return 'Paste into Copilot Chat or add to copilot-instructions.md as a multi-step workflow prompt.';
    }
    if (tool === 'codex') {
      return 'Paste into Codex as a step-by-step workflow prompt.';
    }
    if (tool === 'mcp') {
      return 'Follow as a workflow guide for MCP server setup and integration.';
    }
    return 'Paste into your AI coding agent as a step-by-step workflow prompt.';
  }

  if (assetType === 'mcp-configs') {
    return 'Add to your MCP client configuration (e.g. Cursor MCP settings, Claude Desktop config, or mcp.json).';
  }

  return 'Copy and paste into your AI coding agent as needed.';
}

function howToUseSteps(rule) {
  var tool = normalizeToolKey(rule);
  var assetType = normalizeAssetTypeKey(rule);
  var noun = assetTypeNoun(assetType);
  var steps = [
    'Click <strong>Copy ' + (assetType === 'rules' ? 'Rule' : assetType === 'roles' ? 'Role' : assetType === 'skills' ? 'Skill' : assetType === 'hooks' ? 'Hook' : assetType === 'workflows' ? 'Workflow' : 'MCP Config') + '</strong> above to copy the full ' + noun + ' text.',
    assetUsageHint(rule)
  ];

  if (assetType === 'rules' && tool === 'cursor') {
    steps.push('Cursor applies project rules automatically in Agent and Chat once saved under <code class="path-badge">.cursor/rules/</code>.');
  } else if (assetType === 'rules' && tool === 'windsurf') {
    steps.push('Windsurf reads workspace rules from <code class="path-badge">.devin/rules/</code> on each Cascade session.');
  } else if (assetType === 'hooks') {
    steps.push('Use this hook at the start of a task — before the AI writes any code.');
  } else if (assetType === 'workflows') {
    steps.push('Follow the steps in order; the AI will work through each phase of the workflow.');
  }

  return steps.map(function (step, i) {
    return '<li>' + step + '</li>';
  }).join('\n          ');
}

function compatibleToolsForRule(rule) {
  var primary = normalizeToolKey(rule);
  var toolLabels = {
    cursor: 'Cursor',
    windsurf: 'Windsurf',
    'claude-code': 'Claude Code',
    'github-copilot': 'GitHub Copilot',
    codex: 'Codex',
    mcp: 'MCP'
  };
  var primaryLabel = toolLabels[primary] || rule.tool || 'Cursor';
  var related = [primaryLabel];

  if (primary === 'cursor' || primary === 'windsurf') {
    related.push('Claude Code');
  }
  if (normalizeAssetTypeKey(rule) === 'mcp-configs' || primary === 'mcp') {
    related.push('Cursor', 'Claude Desktop', 'Windsurf');
  }

  var seen = {};
  return related.filter(function (label) {
    var key = label.toLowerCase();
    if (seen[key]) {
      return false;
    }
    seen[key] = true;
    return true;
  });
}

function recommendedPathForRule(rule) {
  var tool = normalizeToolKey(rule);
  var assetType = normalizeAssetTypeKey(rule);
  var id = rule.id;

  if (assetType === 'rules') {
    if (tool === 'windsurf') {
      return '.devin/rules/' + id + '.md';
    }
    if (tool === 'cursor') {
      return '.cursor/rules/' + id + '.mdc';
    }
    if (tool === 'claude-code') {
      return 'CLAUDE.md';
    }
    if (tool === 'github-copilot') {
      return '.github/copilot-instructions.md';
    }
    if (tool === 'codex') {
      return 'Codex instructions / system prompt';
    }
    if (tool === 'mcp') {
      return 'MCP server project';
    }
  }

  if (assetType === 'hooks' && tool === 'cursor') {
    return '.cursor/hooks.json or paste before task';
  }
  if (assetType === 'mcp-configs') {
    return 'mcp.json or MCP client settings';
  }
  if (assetType === 'roles' || assetType === 'skills' || assetType === 'hooks' || assetType === 'workflows') {
    return 'Paste into ' + (rule.tool || 'your agent') + ' Chat';
  }

  return 'Paste into your agent';
}

function triggerModeForRule(rule) {
  if (rule.triggerMode) {
    return rule.triggerMode;
  }
  const tool = String(rule.tool || 'Cursor').toLowerCase();
  if (tool === 'windsurf') {
    return 'always_on (default)';
  }
  return 'Auto-applied in Agent & Chat';
}

function lastUpdatedForRule(rule) {
  return rule.lastUpdated || new Date().toISOString().slice(0, 10);
}

function assetTypeLabel(rule) {
  return rule.assetType || 'Rules';
}

function renderRuleDetailMeta(rule) {
  const tool = escapeHtml(rule.tool || 'Cursor');
  const category = escapeHtml(rule.category || '');
  const framework = escapeHtml(rule.framework || '');
  const assetType = escapeHtml(assetTypeLabel(rule));
  const recommended = escapeHtml(recommendedPathForRule(rule));
  const trigger = escapeHtml(triggerModeForRule(rule));
  const license = escapeHtml(rule.license || 'MIT');
  const updated = escapeHtml(lastUpdatedForRule(rule));

  return (
    '      <dl class="rule-detail-meta">\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">Tool</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + tool + '</dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">Asset type</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + assetType + '</dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">Category</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + category + '</dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">Framework</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + framework + '</dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item rule-detail-meta__item--wide">\n' +
    '          <dt class="rule-detail-meta__label">Recommended path</dt>\n' +
    '          <dd class="rule-detail-meta__value"><code class="path-badge">' + recommended + '</code></dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">Activation / Trigger</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + trigger + '</dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">License</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + license + '</dd>\n' +
    '        </div>\n' +
    '        <div class="rule-detail-meta__item">\n' +
    '          <dt class="rule-detail-meta__label">Last updated</dt>\n' +
    '          <dd class="rule-detail-meta__value">' + updated + '</dd>\n' +
    '        </div>\n' +
    '      </dl>\n'
  );
}

function renderRuleDetailSections(rule, allRules) {
  var useCases = rule.useCases || [];
  var bestForHtml = '';
  if (useCases.length) {
    bestForHtml =
      '      <section class="rule-detail-section">\n' +
      '        <h2 class="rule-detail-section__title">Best for</h2>\n' +
      '        <ul class="rule-detail-section__list">\n' +
      useCases.map(function (item) {
        return '          <li>' + escapeHtml(item) + '</li>';
      }).join('\n') +
      '\n        </ul>\n' +
      '      </section>\n';
  }

  var howToHtml =
    '      <section class="rule-detail-section">\n' +
    '        <h2 class="rule-detail-section__title">How to use this asset</h2>\n' +
    '        <ol class="rule-detail-section__list rule-detail-section__list--ordered">\n' +
    '          ' + howToUseSteps(rule) + '\n' +
    '        </ol>\n' +
    '      </section>\n';

  var compatible = compatibleToolsForRule(rule);
  var otherTools = compatible.filter(function (t) {
    return t.toLowerCase() !== String(rule.tool || 'Cursor').toLowerCase();
  });
  var compatibleText = otherTools.length
    ? 'Designed for <strong class="text-gray-200 font-medium">' + escapeHtml(rule.tool || 'Cursor') + '</strong>. Also works with: ' + otherTools.map(function (t) { return escapeHtml(t); }).join(', ') + '.'
    : 'Designed for <strong class="text-gray-200 font-medium">' + escapeHtml(rule.tool || 'Cursor') + '</strong>.';
  var compatibleHtml =
    '      <section class="rule-detail-section">\n' +
    '        <h2 class="rule-detail-section__title">Compatible tools</h2>\n' +
    '        <p class="rule-detail-section__text">' + compatibleText + '</p>\n' +
    '      </section>\n';

  var relatedHtml = '';
  var relatedIds = rule.relatedItems || [];
  if (relatedIds.length && Array.isArray(allRules)) {
    var relatedLinks = relatedIds.map(function (relatedId) {
      var related = allRules.find(function (r) { return r.id === relatedId; });
      if (!related) {
        return '';
      }
      return '          <li><a href="' + rulePagePath(related.id) + '" class="rule-detail-section__link">' + escapeHtml(related.title) + '</a></li>';
    }).filter(Boolean).join('\n');

    if (relatedLinks) {
      relatedHtml =
        '      <section class="rule-detail-section">\n' +
        '        <h2 class="rule-detail-section__title">Related assets</h2>\n' +
        '        <ul class="rule-detail-section__list rule-detail-section__list--related">\n' +
        relatedLinks + '\n' +
        '        </ul>\n' +
        '      </section>\n';
    }
  }

  return bestForHtml + howToHtml + compatibleHtml + relatedHtml;
}

function ruleDirectoryHref(rule) {
  var tool = normalizeToolKey(rule);
  if (tool === 'windsurf') {
    return '../windsurf.html';
  }
  if (tool === 'cursor') {
    return '../cursor.html';
  }
  return '../index.html?tool=' + tool + '#directory';
}

function ruleDirectoryBackLabel(rule) {
  var tool = normalizeToolKey(rule);
  if (tool === 'windsurf') {
    return '← Back to Windsurf Assets';
  }
  if (tool === 'cursor') {
    return '← Back to Cursor Assets';
  }
  return '← Back to directory';
}

function generateRulePage(rule, config, allRules) {
  const tool = escapeHtml(rule.tool || 'Cursor');
  const category = escapeHtml(rule.category || '');
  const framework = escapeHtml(rule.framework || '');
  const assetType = escapeHtml(assetTypeLabel(rule));
  const assetTypeKey = normalizeAssetTypeKey(rule);
  const copyLabel = escapeHtml(getCopyButtonLabel(assetTypeKey));
  const title = escapeHtml(rule.title);
  const description = escapeHtml(rule.description || '');
  const content = escapeHtml(rule.content || '');
  const hint = escapeHtml(assetUsageHint(rule));
  const canonical = rulePageUrl(rule.id);
  const backLabel = escapeHtml(ruleDirectoryBackLabel(rule));
  const copiedPrefix = getCopiedToastPrefix(assetTypeKey);
  const tags = (rule.tags || []).map(function (t) {
    return '<span class="tag-chip tag-chip--static">' + escapeHtml(t) + '</span>';
  }).join('\n          ');
  const detailSections = renderRuleDetailSections(rule, allRules);

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

${navHtml('', config, normalizeActiveToolKey(rule.tool || 'Cursor'))}

    <header class="mb-6 sm:mb-8">
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span class="rule-badge rule-badge--tool">${tool.toUpperCase()}</span>
        <span class="rule-badge rule-badge--asset-type">${assetType.toUpperCase()}</span>
        <span class="rule-badge rule-badge--category">${category.toUpperCase()}</span>
        <span class="rule-badge rule-badge--framework">${framework}</span>
      </div>
      <h1 class="text-2xl sm:text-3xl font-extrabold text-white mb-3">${title}</h1>
      <p class="text-gray-400 text-base leading-relaxed">${description}</p>
      <div class="flex flex-wrap gap-1.5 mt-4">${tags}</div>
    </header>

${renderRuleDetailMeta(rule)}
${detailSections}
    <main class="rule-detail">
      <h2 class="rule-detail-section__title mb-3">Asset content</h2>
      <pre class="rule-detail__content" id="ruleContent">${content}</pre>
      <p class="rule-detail__hint text-sm text-gray-500 mt-4">${hint}</p>
      <div class="flex flex-col sm:flex-row gap-3 mt-6">
        <button type="button" id="copyRuleBtn" class="btn-copy py-3 px-6 min-h-[44px] rounded-lg text-white font-semibold text-sm">${copyLabel}</button>
        <a href="${ruleDirectoryHref(rule)}" class="inline-flex items-center justify-center py-3 px-6 min-h-[44px] rounded-lg border border-gray-700 text-gray-300 hover:border-indigo-500/40 hover:text-indigo-300 text-sm font-medium transition-colors">${backLabel}</a>
      </div>
    </main>

${footerHtml()}
  </div>

  <div id="toastContainer" class="toast-container" aria-live="polite"></div>

  <script>
    (function () {
      var content = document.getElementById('ruleContent').textContent;
      var btn = document.getElementById('copyRuleBtn');
      var copyLabel = ${JSON.stringify(getCopyButtonLabel(assetTypeKey))};
      var copiedPrefix = ${JSON.stringify(copiedPrefix)};
      var hint = ${JSON.stringify(assetUsageHint(rule))};
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(content).then(function () {
          btn.classList.add('copied');
          btn.textContent = 'Copied!';
          var toast = document.createElement('div');
          toast.className = 'toast toast--visible';
          toast.setAttribute('role', 'status');
          toast.textContent = copiedPrefix + ' ' + hint;
          document.getElementById('toastContainer').appendChild(toast);
          setTimeout(function () {
            btn.classList.remove('copied');
            btn.textContent = copyLabel;
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

function generateAlsoExploreLinks(currentToolKey, depth) {
  var prefix = depth === 0 ? '' : '../';
  var homeHref = prefix + 'index.html';
  var links = [
    { key: 'all', href: homeHref + '#directory', label: 'All Assets' },
    { key: 'cursor', href: prefix + 'cursor.html', label: 'Cursor' },
    { key: 'windsurf', href: prefix + 'windsurf.html', label: 'Windsurf' },
    { key: 'claude-code', href: homeHref + '?tool=claude-code#directory', label: 'Claude Code' },
    { key: 'github-copilot', href: homeHref + '?tool=github-copilot#directory', label: 'GitHub Copilot' },
    { key: 'codex', href: homeHref + '?tool=codex#directory', label: 'Codex' },
    { key: 'mcp', href: homeHref + '?tool=mcp#directory', label: 'MCP' }
  ].filter(function (link) {
    return link.key !== currentToolKey;
  });

  var linkHtml = links.map(function (link) {
    return '<a href="' + link.href + '" class="also-explore__link">' + escapeHtml(link.label) + '</a>';
  }).join('\n            ');

  return (
    '        <div class="also-explore">\n' +
    '          <p class="also-explore__label">Also explore</p>\n' +
    '          <p class="also-explore__links">\n' +
    '            ' + linkHtml + '\n' +
    '          </p>\n' +
    '        </div>'
  );
}

function generateSeoDirectory(rules, activeTool, options) {
  options = options || {};
  const groups = { Cursor: [], Windsurf: [] };
  const pageHref = { Cursor: 'cursor.html', Windsurf: 'windsurf.html' };
  const toolOrder = options.toolOrder || ['Cursor', 'Windsurf'];
  const sectionLabels = options.sectionLabels || {};
  const alsoExploreOnly = options.alsoExploreOnly === true;
  const currentToolKey = options.currentToolKey || '';

  rules.forEach(function (rule) {
    var tool = rule.tool || 'Cursor';
    if (!groups[tool]) {
      groups[tool] = [];
    }
    groups[tool].push(rule);
  });

  var panels = toolOrder.map(function (tool) {
    var toolRules = groups[tool] || [];
    if (!toolRules.length && alsoExploreOnly) {
      return '';
    }
    var isActive = activeTool === tool;
    var linkClass = 'sidebar-panel__tool-link' + (isActive ? ' sidebar-panel__tool-link--active' : '');
    var panelClass = 'sidebar-panel' + (options.secondaryTools && options.secondaryTools.indexOf(tool) !== -1 ? ' sidebar-panel--secondary' : '');
    var sectionLabel = sectionLabels[tool] || tool;
    var isOpen = isActive || options.openAll === true;
    var items = toolRules.map(function (rule) {
      return (
        '            <li class="sidebar-panel__item">\n' +
        '              <a href="' + rulePagePath(rule.id) + '" class="sidebar-panel__link">' + escapeHtml(rule.title) + '</a>\n' +
        '            </li>'
      );
    }).join('\n');

    return (
      '        <details class="' + panelClass + '"' + (isOpen ? ' open' : '') + '>\n' +
      '          <summary class="sidebar-panel__summary"><a href="' + pageHref[tool] + '" class="' + linkClass + '">' + sectionLabel + '</a> <span class="sidebar-panel__count">(' + toolRules.length + ')</span></summary>\n' +
      '          <ul class="sidebar-panel__list">\n' +
      items + '\n' +
      '          </ul>\n' +
      '        </details>'
    );
  }).filter(Boolean).join('\n');

  if (alsoExploreOnly && currentToolKey) {
    panels += '\n' + generateAlsoExploreLinks(currentToolKey, options.depth || 0);
  }

  return panels;
}

function updatePageSeoDirectory(htmlPath, rules, activeTool, options) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const startMarker = '<!-- SEO-DIRECTORY:START -->';
  const endMarker = '<!-- SEO-DIRECTORY:END -->';
  const section = generateSeoDirectory(rules, activeTool, options);
  const replacement = startMarker + '\n' + section + '\n    ' + endMarker;

  if (html.includes(startMarker)) {
    html = html.replace(new RegExp(startMarker + '[\\s\\S]*?' + endMarker), replacement);
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
}

function updateIndexSeoDirectory(rules) {
  updatePageSeoDirectory(INDEX_HTML, rules, '', {
    toolOrder: ['Cursor', 'Windsurf'],
    openAll: true
  });

  var cursorOnly = rules.filter(function (rule) {
    return normalizeToolKey(rule) === 'cursor';
  });

  var windsurfOnly = rules.filter(function (rule) {
    return normalizeToolKey(rule) === 'windsurf';
  });

  if (fs.existsSync(CURSOR_HTML)) {
    updatePageSeoDirectory(CURSOR_HTML, cursorOnly, 'Cursor', {
      toolOrder: ['Cursor'],
      currentToolKey: 'cursor',
      alsoExploreOnly: true,
      depth: 0
    });
  }

  if (fs.existsSync(WINDSURF_HTML)) {
    updatePageSeoDirectory(WINDSURF_HTML, windsurfOnly, 'Windsurf', {
      toolOrder: ['Windsurf'],
      currentToolKey: 'windsurf',
      alsoExploreOnly: true,
      depth: 0
    });
  }
}

function filterRulesForPage(rules, pageTool) {
  if (pageTool === 'windsurf') {
    return rules.filter(function (rule) {
      return normalizeToolKey(rule) === 'windsurf';
    });
  }
  if (pageTool === 'cursor') {
    return rules.filter(function (rule) {
      return normalizeToolKey(rule) === 'cursor';
    });
  }
  return rules;
}

function generateSeoRulesGrid(rules) {
  return rules.map(function (rule) {
    var tool = escapeHtml(rule.tool || 'Cursor');
    var category = escapeHtml(rule.category || '');
    var assetType = escapeHtml(assetTypeLabel(rule));
    return (
      '      <article class="rule-card rounded-xl p-5 sm:p-6 flex flex-col h-full seo-static-card">\n' +
      '        <div class="flex flex-wrap gap-1.5 mb-3">\n' +
      '          <span class="rule-badge rule-badge--tool">' + tool.toUpperCase() + '</span>\n' +
      '          <span class="rule-badge rule-badge--asset-type">' + assetType.toUpperCase() + '</span>\n' +
      '          <span class="rule-badge rule-badge--category">' + category.toUpperCase() + '</span>\n' +
      '        </div>\n' +
      '        <h2 class="text-base sm:text-lg font-bold text-white mb-3 leading-snug">\n' +
      '          <a href="' + rulePagePath(rule.id) + '" class="rule-card__title">' + escapeHtml(rule.title) + '</a>\n' +
      '        </h2>\n' +
      '        <p class="text-gray-400 text-sm leading-relaxed flex-1">' + escapeHtml(rule.description || '') + '</p>\n' +
      '      </article>'
    );
  }).join('\n');
}

function updatePageSeoGrid(htmlPath, rules, pageTool) {
  let html = fs.readFileSync(htmlPath, 'utf8');
  const startMarker = '<!-- SEO-GRID:START -->';
  const endMarker = '<!-- SEO-GRID:END -->';
  const filtered = filterRulesForPage(rules, pageTool);
  const section = generateSeoRulesGrid(filtered);
  const replacement = startMarker + '\n' + section + '\n    ' + endMarker;

  if (html.includes(startMarker)) {
    html = html.replace(new RegExp(startMarker + '[\\s\\S]*?' + endMarker), replacement);
  }

  fs.writeFileSync(htmlPath, html, 'utf8');
}

function updateSeoGrids(rules) {
  updatePageSeoGrid(INDEX_HTML, rules, 'all');
  if (fs.existsSync(CURSOR_HTML)) {
    updatePageSeoGrid(CURSOR_HTML, rules, 'cursor');
  }
  if (fs.existsSync(WINDSURF_HTML)) {
    updatePageSeoGrid(WINDSURF_HTML, rules, 'windsurf');
  }
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
    '    "name": "AI Agent Dock Assets",\n' +
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

function updateCursorItemListSchema(rules) {
  if (!fs.existsSync(CURSOR_HTML)) {
    return;
  }

  let html = fs.readFileSync(CURSOR_HTML, 'utf8');
  const startMarker = '<!-- ITEMLIST-SCHEMA:START -->';
  const endMarker = '<!-- ITEMLIST-SCHEMA:END -->';

  const cursorRules = rules.filter(function (rule) {
    return normalizeToolKey(rule) === 'cursor';
  });

  const items = cursorRules.map(function (rule, index) {
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
    '    "name": "Cursor Assets",\n' +
    '    "numberOfItems": ' + cursorRules.length + ',\n' +
    '    "itemListElement": [\n' +
    items + '\n' +
    '    ]\n' +
    '  }\n' +
    '  </script>';

  const replacement = startMarker + '\n' + schema + '\n  ' + endMarker;
  if (html.includes(startMarker)) {
    html = html.replace(new RegExp(startMarker + '[\\s\\S]*?' + endMarker), replacement);
    fs.writeFileSync(CURSOR_HTML, html, 'utf8');
  }
}

function updateWindsurfItemListSchema(rules) {
  if (!fs.existsSync(WINDSURF_HTML)) {
    return;
  }

  let html = fs.readFileSync(WINDSURF_HTML, 'utf8');
  const startMarker = '<!-- ITEMLIST-SCHEMA:START -->';
  const endMarker = '<!-- ITEMLIST-SCHEMA:END -->';

  const windsurfRules = rules.filter(function (rule) {
    return normalizeToolKey(rule) === 'windsurf';
  });
  const windsurfOnly = windsurfRules;
  const orderedRules = windsurfOnly;

  const items = orderedRules.map(function (rule, index) {
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
    '    "name": "Windsurf Assets",\n' +
    '    "numberOfItems": ' + windsurfOnly.length + ',\n' +
    '    "itemListElement": [\n' +
    items + '\n' +
    '    ]\n' +
    '  }\n' +
    '  </script>';

  const replacement = startMarker + '\n' + schema + '\n  ' + endMarker;
  html = html.replace(new RegExp(startMarker + '[\\s\\S]*?' + endMarker), replacement);
  fs.writeFileSync(WINDSURF_HTML, html, 'utf8');
}

function injectVerificationMeta(config) {
  if (!config.googleSiteVerification) {
    return;
  }

  const meta = '  <meta name="google-site-verification" content="' + escapeHtml(config.googleSiteVerification) + '" />';
  const pages = ['index.html', 'cursor.html', 'windsurf.html', 'about.html', 'submit.html', 'privacy.html'];

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
    { loc: '/cursor', priority: '0.9', changefreq: 'weekly' },
    { loc: '/windsurf', priority: '0.9', changefreq: 'weekly' },
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

function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function removeDirWithRetry(targetDir, retries, delayMs) {
  retries = retries || 5;
  delayMs = delayMs || 300;
  var fullPath = path.resolve(targetDir);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      await fsp.rm(fullPath, {
        recursive: true,
        force: true,
        maxRetries: 3,
        retryDelay: delayMs
      });
      return;
    } catch (error) {
      var retryable = ['EPERM', 'EBUSY', 'ENOTEMPTY', 'EACCES'].indexOf(error.code) !== -1;
      if (!retryable || attempt === retries) {
        console.error('Failed to remove ' + fullPath + '.');
        console.error('Close any running dev server, file explorer preview, terminal process, or antivirus scan using the dist folder, then try again.');
        throw error;
      }
      console.warn('Could not remove ' + fullPath + ' on attempt ' + attempt + '. Retrying...');
      await sleep(delayMs * attempt);
    }
  }
}

async function clearDirContents(targetDir) {
  var fullPath = path.resolve(targetDir);
  if (!fs.existsSync(fullPath)) {
    return;
  }

  var entries = await fsp.readdir(fullPath, { withFileTypes: true });
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var entryPath = path.join(fullPath, entry.name);
    await fsp.rm(entryPath, {
      recursive: true,
      force: true,
      maxRetries: 3,
      retryDelay: 100
    });
  }
}

async function prepareDistDir() {
  if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true });
    return;
  }

  try {
    await removeDirWithRetry(DIST);
    fs.mkdirSync(DIST, { recursive: true });
    return;
  } catch (error) {
    console.warn('Could not remove dist/ completely. Falling back to in-place dist update...');
  }

  try {
    await clearDirContents(DIST);
  } catch (clearError) {
    console.warn('Some dist/ files could not be cleared. Continuing with overwrite where possible.');
  }

  fs.mkdirSync(DIST, { recursive: true });
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

async function copySiteToDist() {
  await prepareDistDir();

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
  var rules = loadRules();
  var config = loadSiteConfig();

  if (!fs.existsSync(RULES_DIR)) {
    fs.mkdirSync(RULES_DIR, { recursive: true });
  }

  var existing = fs.readdirSync(RULES_DIR).filter(function (f) { return f.endsWith('.html'); });
  var expected = new Set(rules.map(function (r) { return r.id + '.html'; }));

  existing.forEach(function (file) {
    if (!expected.has(file)) {
      fs.unlinkSync(path.join(RULES_DIR, file));
    }
  });

  rules.forEach(function (rule) {
    var outPath = path.join(RULES_DIR, rule.id + '.html');
    fs.writeFileSync(outPath, generateRulePage(rule, config, rules), 'utf8');
    console.log('  wrote rules/' + rule.id + '.html');
  });

  updateIndexSeoDirectory(rules);
  console.log('  updated directory page SEO sidebars');

  updateSeoGrids(rules);
  console.log('  updated directory page SEO grids');

  updateItemListSchema(rules);
  console.log('  updated index.html ItemList schema');

  updateCursorItemListSchema(rules);
  console.log('  updated cursor.html ItemList schema');

  updateWindsurfItemListSchema(rules);
  console.log('  updated windsurf.html ItemList schema');

  injectVerificationMeta(config);

  generateSitemap(rules);
  console.log('  updated sitemap.xml');

  return copySiteToDist().then(function () {
    console.log('Built ' + rules.length + ' asset pages.');
  });
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
