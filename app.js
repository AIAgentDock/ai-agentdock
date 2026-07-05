/**
 * Render RULES_DATA into #rulesGrid with Tool → Category → Framework filters.
 */
(function () {
  'use strict';

  var TAXONOMY = window.FILTER_TAXONOMY || {};
  var TOOL_KEYS = ['cursor', 'windsurf'];
  var SEARCH_DEBOUNCE_MS = 200;

  var rulesGrid = document.getElementById('rulesGrid');
  var searchInput = document.getElementById('searchInput');
  var resultCount = document.getElementById('resultCount');
  var emptyState = document.getElementById('emptyState');
  var toolFilter = document.getElementById('toolFilter');
  var categoryFilter = document.getElementById('categoryFilter');
  var frameworkChips = document.getElementById('frameworkChips');
  var resetFiltersBtn = document.getElementById('resetFilters');
  var searchKbd = document.getElementById('searchKbd');
  var ruleModal = document.getElementById('ruleModal');
  var toastContainer = document.getElementById('toastContainer');

  if (!rulesGrid || !searchInput || !resultCount || !emptyState ||
      !toolFilter || !categoryFilter || !frameworkChips || !resetFiltersBtn) {
    console.error('Required DOM elements missing — check index.html IDs');
    return;
  }

  var allRules = Array.isArray(window.RULES_DATA) ? window.RULES_DATA : [];
  if (allRules.length === 0) {
    console.warn('No rules loaded — ensure rules.js defines window.RULES_DATA before app.js');
  }

  var filterState = {
    tool: 'all',
    category: 'all',
    framework: 'all',
    search: ''
  };

  var searchDebounceTimer = null;
  var urlSyncEnabled = false;

  var RULE_CATEGORY_OVERRIDES = {
    'python-scraper': 'backend',
    'supabase-db': 'database',
    'react-native': 'frontend',
    'rust-systems': 'backend',
    'ai-ml-python': 'ai',
    'typescript-general': 'quality',
    'cursor-agent-skills': 'docs',
    'prompt-engineering': 'ai',
    'turborepo-monorepo': 'docs',
    'kubernetes-devops': 'devops'
  };

  var FRAMEWORK_ALIASES = {
    Tailwind: 'Tailwind CSS',
    'AI/ML': 'OpenAI API',
    Python: 'Python',
    Agent: 'General',
    Skills: 'General',
    'Prompt Engineering': 'General'
  };

  var CATEGORY_LABEL_TO_KEY = {
    fullstack: 'fullstack',
    frontend: 'frontend',
    'frontend / ui': 'frontend',
    backend: 'backend',
    'backend / api': 'backend',
    database: 'database',
    'database / orm': 'database',
    data: 'backend',
    mobile: 'frontend',
    systems: 'backend',
    ai: 'ai',
    'ai agent / rag': 'ai',
    testing: 'testing',
    'testing / qa': 'testing',
    devops: 'devops',
    'devops / deployment': 'devops',
    quality: 'quality',
    'code quality / security': 'quality',
    docs: 'docs',
    'documentation / productivity': 'docs',
    general: 'general',
    'general coding': 'general'
  };

  var TOOL_USAGE_HINTS = {
    cursor: 'Paste into .cursor/rules/ (or .mdc files) in your project root.',
    windsurf: 'Import via Windsurf → Rules panel in your editor.',
    universal: 'Paste into your editor\'s rules or instructions file.'
  };

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safeStr(value) {
    return value == null ? '' : String(value);
  }

  function normalizeToolKey(rule) {
    if (rule.toolKey) {
      return rule.toolKey.toLowerCase();
    }
    var tool = safeStr(rule.tool).toLowerCase();
    if (tool === 'cursor' || tool === 'windsurf' || tool === 'universal') {
      return tool;
    }
    return 'cursor';
  }

  function getToolLabel(toolKey) {
    if (toolKey === 'all') {
      return 'All Tools';
    }
    return (TAXONOMY[toolKey] && TAXONOMY[toolKey].label) || toolKey;
  }

  function getToolUsageHint(toolKey) {
    return TOOL_USAGE_HINTS[toolKey] || TOOL_USAGE_HINTS.cursor;
  }

  function normalizeCategoryKey(rule) {
    if (rule.categoryKey) {
      return rule.categoryKey.toLowerCase();
    }
    if (RULE_CATEGORY_OVERRIDES[rule.id]) {
      return RULE_CATEGORY_OVERRIDES[rule.id];
    }
    var raw = safeStr(rule.category).trim().toLowerCase();
    if (CATEGORY_LABEL_TO_KEY[raw]) {
      return CATEGORY_LABEL_TO_KEY[raw];
    }
    return raw.replace(/\s+/g, '-');
  }

  function getCategoryLabel(toolKey, categoryKey) {
    var tool = TAXONOMY[toolKey];
    if (tool && tool.categories && tool.categories[categoryKey]) {
      return tool.categories[categoryKey].label;
    }

    var keys = filterState.tool === 'all' ? TOOL_KEYS : [toolKey];
    var i;
    for (i = 0; i < keys.length; i++) {
      var entry = TAXONOMY[keys[i]];
      if (entry && entry.categories && entry.categories[categoryKey]) {
        return entry.categories[categoryKey].label;
      }
    }

    return ruleFallbackCategoryLabel(categoryKey);
  }

  function ruleFallbackCategoryLabel(categoryKey) {
    return categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
  }

  function normalizeFrameworkName(name) {
    var value = safeStr(name).trim();
    if (!value) {
      return '';
    }
    if (FRAMEWORK_ALIASES[value]) {
      return FRAMEWORK_ALIASES[value];
    }
    return value;
  }

  function getRuleFrameworks(rule) {
    var raw = rule.frameworks || [rule.framework];
    var seen = {};
    var result = [];

    raw.forEach(function (item) {
      var normalized = normalizeFrameworkName(item);
      if (normalized && !seen[normalized.toLowerCase()]) {
        seen[normalized.toLowerCase()] = true;
        result.push(normalized);
      }
    });

    return result;
  }

  function ruleMatchesToolCategory(rule) {
    var toolKey = normalizeToolKey(rule);
    var categoryKey = normalizeCategoryKey(rule);

    if (filterState.tool !== 'all' && toolKey !== filterState.tool) {
      return false;
    }
    if (filterState.category !== 'all' && categoryKey !== filterState.category) {
      return false;
    }
    return true;
  }

  function getFrameworksWithRules() {
    var seen = {};
    var frameworks = [];

    allRules.forEach(function (rule) {
      if (!ruleMatchesToolCategory(rule)) {
        return;
      }
      getRuleFrameworks(rule).forEach(function (name) {
        var key = name.toLowerCase();
        if (!seen[key]) {
          seen[key] = name;
          frameworks.push(name);
        }
      });
    });

    return frameworks.sort(function (a, b) {
      return a.localeCompare(b);
    });
  }

  function getAvailableCategories(toolKey) {
    var merged = {};

    allRules.forEach(function (rule) {
      var ruleTool = normalizeToolKey(rule);
      var catKey = normalizeCategoryKey(rule);

      if (toolKey !== 'all' && ruleTool !== toolKey) {
        return;
      }

      if (!merged[catKey]) {
        merged[catKey] = getCategoryLabel(ruleTool, catKey);
      }
    });

    return merged;
  }

  function populateSelect(selectEl, options, allLabel) {
    var html = '<option value="all">' + escapeHtml(allLabel) + '</option>';
    Object.keys(options).sort(function (a, b) {
      return options[a].localeCompare(options[b]);
    }).forEach(function (key) {
      html += '<option value="' + escapeHtml(key) + '">' + escapeHtml(options[key]) + '</option>';
    });
    selectEl.innerHTML = html;
  }

  function renderFrameworkChips() {
    var frameworks = getFrameworksWithRules();
    var html = '<button type="button" class="framework-chip' +
      (filterState.framework === 'all' ? ' framework-chip--active' : '') +
      '" data-framework="all">All</button>';

    frameworks.forEach(function (name) {
      var isActive = filterState.framework !== 'all' &&
        filterState.framework.toLowerCase() === name.toLowerCase();
      html += '<button type="button" class="framework-chip' +
        (isActive ? ' framework-chip--active' : '') +
        '" data-framework="' + escapeHtml(name) + '">' +
        escapeHtml(name) + '</button>';
    });

    frameworkChips.innerHTML = html;

    if (filterState.framework !== 'all') {
      var exists = frameworks.some(function (name) {
        return name.toLowerCase() === filterState.framework.toLowerCase();
      });
      if (!exists) {
        filterState.framework = 'all';
      }
    }
  }

  function syncFilterOptions() {
    var categories = getAvailableCategories(filterState.tool);
    populateSelect(categoryFilter, categories, 'All Categories');

    if (filterState.category !== 'all' && !categories[filterState.category]) {
      filterState.category = 'all';
    }
    categoryFilter.value = filterState.category;

    renderFrameworkChips();
  }

  function frameworkMatches(rule, selectedFramework) {
    if (selectedFramework === 'all') {
      return true;
    }

    var target = selectedFramework.toLowerCase();
    var frameworks = getRuleFrameworks(rule);
    var i;

    for (i = 0; i < frameworks.length; i++) {
      if (frameworks[i].toLowerCase() === target) {
        return true;
      }
      if (frameworks[i].toLowerCase().indexOf(target) !== -1 ||
          target.indexOf(frameworks[i].toLowerCase()) !== -1) {
        return true;
      }
    }

    return (rule.tags || []).some(function (tag) {
      return safeStr(tag).toLowerCase() === target ||
        safeStr(tag).toLowerCase().indexOf(target) !== -1;
    });
  }

  function ruleMatchesFilters(rule) {
    if (!ruleMatchesToolCategory(rule)) {
      return false;
    }

    if (!frameworkMatches(rule, filterState.framework)) {
      return false;
    }

    if (!filterState.search) {
      return true;
    }

    var q = filterState.search.toLowerCase();
    var toolKey = normalizeToolKey(rule);
    var categoryKey = normalizeCategoryKey(rule);
    var frameworks = getRuleFrameworks(rule);
    var searchText = [
      rule.title,
      getToolLabel(toolKey),
      getCategoryLabel(toolKey, categoryKey),
      frameworks.join(' '),
      rule.description,
      (rule.tags || []).join(' '),
      rule.content
    ].map(safeStr).join(' ').toLowerCase();

    return searchText.indexOf(q) !== -1;
  }

  function getFilteredRules() {
    return allRules.filter(ruleMatchesFilters);
  }

  function renderBadge(text, type) {
    return '<span class="rule-badge rule-badge--' + type + '">' + escapeHtml(text) + '</span>';
  }

  var LICENSE_URLS = {
    'MIT': 'https://opensource.org/licenses/MIT',
    'Apache-2.0': 'https://opensource.org/licenses/Apache-2.0',
    'CC0-1.0': 'https://creativecommons.org/publicdomain/zero/1.0/',
    'CC BY 4.0': 'https://creativecommons.org/licenses/by/4.0/'
  };

  function getRuleSource(rule) {
    var source = rule.source;
    if (!source) {
      return { label: '', url: '' };
    }
    if (typeof source === 'string') {
      return { label: source, url: safeStr(rule.sourceUrl) };
    }
    return {
      label: safeStr(source.label),
      url: safeStr(source.url)
    };
  }

  function renderMetaLink(label, url) {
    if (!label) {
      return '';
    }
    if (url) {
      return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer" class="rule-meta__link">' +
        escapeHtml(label) + '</a>';
    }
    return '<span class="rule-meta__value">' + escapeHtml(label) + '</span>';
  }

  function renderRuleMeta(rule) {
    var source = getRuleSource(rule);
    var license = safeStr(rule.license).trim();
    var licenseUrl = safeStr(rule.licenseUrl) || LICENSE_URLS[license] || '';
    var items = [];

    if (source.label) {
      items.push(
        '<span class="rule-meta__item">' +
          '<span class="rule-meta__label">Source</span> ' +
          renderMetaLink(source.label, source.url) +
        '</span>'
      );
    }

    if (license) {
      items.push(
        '<span class="rule-meta__item">' +
          '<span class="rule-meta__label">License</span> ' +
          renderMetaLink(license, licenseUrl) +
        '</span>'
      );
    }

    if (!items.length) {
      return '';
    }

    return '<div class="rule-meta">' + items.join('') + '</div>';
  }

  function createRuleCard(rule) {
    var toolKey = normalizeToolKey(rule);
    var categoryKey = normalizeCategoryKey(rule);
    var frameworks = getRuleFrameworks(rule);
    var displayFrameworks = frameworks.length ? frameworks : [normalizeFrameworkName(rule.framework)].filter(Boolean);

    var frameworkBadges = displayFrameworks.slice(0, 3).map(function (fw) {
      return renderBadge(fw, 'framework');
    }).join('');

    var tagsHtml = (rule.tags || []).slice(0, 5).map(function (tag) {
      return '<button type="button" class="tag-chip" data-tag="' + escapeHtml(tag) + '">' +
        escapeHtml(tag) + '</button>';
    }).join('');

    return (
      '<article class="rule-card rounded-xl p-5 sm:p-6 flex flex-col h-full" data-id="' + escapeHtml(safeStr(rule.id)) + '">' +
        '<div class="flex flex-wrap gap-1.5 mb-3">' +
          renderBadge(getToolLabel(toolKey), 'tool') +
          renderBadge(getCategoryLabel(toolKey, categoryKey), 'category') +
          frameworkBadges +
        '</div>' +
        '<h2 class="text-base sm:text-lg font-bold text-white mb-3 leading-snug">' +
          '<a href="rules/' + escapeHtml(rule.id) + '.html" class="rule-card__title">' + escapeHtml(safeStr(rule.title)) + '</a>' +
        '</h2>' +
        '<p class="text-gray-400 text-sm leading-relaxed flex-1 mb-4">' + escapeHtml(safeStr(rule.description)) + '</p>' +
        '<div class="flex flex-wrap gap-1.5 mb-4">' + tagsHtml + '</div>' +
        renderRuleMeta(rule) +
        '<div class="flex flex-col sm:flex-row gap-2 mt-auto">' +
          '<a href="rules/' + escapeHtml(rule.id) + '.html" class="btn-preview flex-1 py-3 px-4 min-h-[44px] rounded-lg text-sm font-semibold text-center inline-flex items-center justify-center">Open Page</a>' +
          '<button type="button" class="btn-preview flex-1 py-3 px-4 min-h-[44px] rounded-lg text-sm font-semibold" data-preview-id="' + escapeHtml(rule.id) + '">' +
            'Preview' +
          '</button>' +
          '<button type="button" class="btn-copy flex-1 py-3 px-4 min-h-[44px] rounded-lg text-white font-semibold text-sm" data-copy-id="' + escapeHtml(rule.id) + '">' +
            'Copy Rule' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

  function renderRules() {
    var filtered = getFilteredRules();
    var hasActiveFilters = filterState.tool !== 'all' ||
      filterState.category !== 'all' ||
      filterState.framework !== 'all' ||
      filterState.search;

    if (hasActiveFilters) {
      resultCount.textContent = 'Showing ' + filtered.length + ' rule' + (filtered.length === 1 ? '' : 's');
    } else {
      resultCount.textContent = 'Showing ' + allRules.length + ' rules';
    }

    if (filtered.length === 0) {
      rulesGrid.innerHTML = '';
      emptyState.classList.remove('hidden');
      emptyState.setAttribute('aria-hidden', 'false');
      syncUrlFromState();
      return;
    }

    emptyState.classList.add('hidden');
    emptyState.setAttribute('aria-hidden', 'true');

    var cardsHtml = '';
    filtered.forEach(function (rule) {
      cardsHtml += createRuleCard(rule);
    });
    rulesGrid.innerHTML = cardsHtml;

    rulesGrid.querySelectorAll('[data-copy-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyRule(btn.getAttribute('data-copy-id'), btn);
      });
    });

    rulesGrid.querySelectorAll('[data-preview-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openRuleModal(btn.getAttribute('data-preview-id'));
      });
    });

    rulesGrid.querySelectorAll('.tag-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        applyTagFilter(chip.getAttribute('data-tag'));
      });
    });

    syncUrlFromState();
  }

  function copyText(text, ruleId, triggerEl) {
    function onSuccess() {
      var rule = allRules.find(function (r) { return r.id === ruleId; });
      var toolKey = rule ? normalizeToolKey(rule) : 'cursor';

      if (triggerEl) {
        triggerEl.classList.add('copied');
        var originalText = triggerEl.getAttribute('data-original-label') || triggerEl.textContent;
        triggerEl.setAttribute('data-original-label', originalText);
        triggerEl.textContent = 'Copied!';
        setTimeout(function () {
          triggerEl.classList.remove('copied');
          triggerEl.textContent = originalText;
        }, 2000);
      }

      showToast('Rule copied! ' + getToolUsageHint(toolKey));
    }

    if (!text) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(function () {
        fallbackCopy(text, ruleId, triggerEl, onSuccess);
      });
    } else {
      fallbackCopy(text, ruleId, triggerEl, onSuccess);
    }
  }

  function copyRule(ruleId, btn) {
    var rule = allRules.find(function (r) { return r.id === ruleId; });
    if (!rule) {
      return;
    }
    copyText(safeStr(rule.content), ruleId, btn);
  }

  function fallbackCopy(text, ruleId, btn, onSuccess) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand('copy');
      onSuccess();
    } catch (err) {
      if (btn) {
        btn.textContent = 'Copy failed';
        setTimeout(function () {
          btn.textContent = 'Copy Rule';
        }, 2000);
      }
    }

    document.body.removeChild(textarea);
  }

  function showToast(message) {
    if (!toastContainer) {
      return;
    }

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });

    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4500);
  }

  function openRuleModal(ruleId) {
    if (!ruleModal) {
      return;
    }

    var rule = allRules.find(function (r) { return r.id === ruleId; });
    if (!rule) {
      return;
    }

    var toolKey = normalizeToolKey(rule);
    var titleEl = ruleModal.querySelector('#ruleModalTitle');
    var bodyEl = ruleModal.querySelector('#ruleModalBody');
    var copyBtn = ruleModal.querySelector('#ruleModalCopy');

    if (titleEl) {
      titleEl.textContent = rule.title;
    }
    if (bodyEl) {
      bodyEl.textContent = safeStr(rule.content);
    }
    if (copyBtn) {
      copyBtn.setAttribute('data-copy-id', rule.id);
    }

    ruleModal.querySelector('#ruleModalHint').textContent = getToolUsageHint(toolKey);
    ruleModal.classList.remove('hidden');
    ruleModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    if (copyBtn) {
      copyBtn.focus();
    }
  }

  function closeRuleModal() {
    if (!ruleModal) {
      return;
    }
    ruleModal.classList.add('hidden');
    ruleModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function applyTagFilter(tag) {
    if (!tag) {
      return;
    }

    var frameworks = getFrameworksWithRules();
    var tagLower = tag.toLowerCase();
    var matchedFramework = frameworks.find(function (fw) {
      return fw.toLowerCase() === tagLower ||
        fw.toLowerCase().indexOf(tagLower) !== -1 ||
        tagLower.indexOf(fw.toLowerCase()) !== -1;
    });

    if (matchedFramework) {
      filterState.framework = matchedFramework;
      filterState.search = '';
      searchInput.value = '';
    } else {
      filterState.search = tag;
      searchInput.value = tag;
      filterState.framework = 'all';
    }

    syncFilterOptions();
    renderRules();
  }

  function resetFilters() {
    filterState.tool = 'all';
    filterState.category = 'all';
    filterState.framework = 'all';
    filterState.search = '';
    searchInput.value = '';
    toolFilter.value = 'all';
    syncFilterOptions();
    renderRules();
  }

  function readStateFromUrl() {
    var params = new URLSearchParams(window.location.search);

    filterState.tool = params.get('tool') || 'all';
    filterState.category = params.get('category') || 'all';
    filterState.framework = params.get('framework') || 'all';
    filterState.search = params.get('q') || '';

    if (TOOL_KEYS.indexOf(filterState.tool) === -1 && filterState.tool !== 'all') {
      filterState.tool = 'all';
    }

    searchInput.value = filterState.search;
    toolFilter.value = filterState.tool;
  }

  function syncUrlFromState() {
    if (!urlSyncEnabled) {
      return;
    }

    var params = new URLSearchParams();

    if (filterState.search) {
      params.set('q', filterState.search);
    }
    if (filterState.tool !== 'all') {
      params.set('tool', filterState.tool);
    }
    if (filterState.category !== 'all') {
      params.set('category', filterState.category);
    }
    if (filterState.framework !== 'all') {
      params.set('framework', filterState.framework);
    }

    var query = params.toString();
    var newUrl = query ? window.location.pathname + '?' + query : window.location.pathname;
    window.history.replaceState(null, '', newUrl);
  }

  function setupSearchKbdHint() {
    if (!searchKbd) {
      return;
    }

    var isMobile = window.matchMedia('(max-width: 639px)').matches;
    var isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);

    if (isMobile) {
      searchKbd.classList.add('hidden');
      return;
    }

    searchKbd.classList.remove('hidden');
    searchKbd.textContent = isMac ? '⌘K' : 'Ctrl+K';
  }

  function setupModal() {
    if (!ruleModal) {
      return;
    }

    ruleModal.querySelectorAll('[data-modal-close]').forEach(function (el) {
      el.addEventListener('click', closeRuleModal);
    });

    var copyBtn = ruleModal.querySelector('#ruleModalCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var ruleId = copyBtn.getAttribute('data-copy-id');
        var rule = allRules.find(function (r) { return r.id === ruleId; });
        if (rule) {
          copyText(safeStr(rule.content), ruleId, copyBtn);
        }
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !ruleModal.classList.contains('hidden')) {
        closeRuleModal();
      }
    });
  }

  toolFilter.addEventListener('change', function () {
    filterState.tool = toolFilter.value;
    filterState.category = 'all';
    filterState.framework = 'all';
    syncFilterOptions();
    renderRules();
  });

  categoryFilter.addEventListener('change', function () {
    filterState.category = categoryFilter.value;
    filterState.framework = 'all';
    syncFilterOptions();
    renderRules();
  });

  frameworkChips.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-framework]');
    if (!chip) {
      return;
    }
    filterState.framework = chip.getAttribute('data-framework');
    renderFrameworkChips();
    renderRules();
  });

  searchInput.addEventListener('input', function (e) {
    clearTimeout(searchDebounceTimer);
    var value = e.target.value.trim();
    searchDebounceTimer = setTimeout(function () {
      filterState.search = value;
      renderRules();
    }, SEARCH_DEBOUNCE_MS);
  });

  resetFiltersBtn.addEventListener('click', resetFilters);

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  readStateFromUrl();
  syncFilterOptions();
  categoryFilter.value = filterState.category;
  urlSyncEnabled = true;
  setupSearchKbdHint();
  setupModal();
  renderRules();

  var previewParam = new URLSearchParams(window.location.search).get('preview');
  if (previewParam) {
    openRuleModal(previewParam);
  }
})();
