/**
 * Render RULES_DATA into #rulesGrid with Tool → Category → Framework filters.
 */
(function () {
  'use strict';

  var TAXONOMY = window.FILTER_TAXONOMY || {};
  var TOOL_KEYS = ['cursor', 'windsurf', 'universal'];

  var rulesGrid = document.getElementById('rulesGrid');
  var searchInput = document.getElementById('searchInput');
  var resultCount = document.getElementById('resultCount');
  var emptyState = document.getElementById('emptyState');
  var toolFilter = document.getElementById('toolFilter');
  var categoryFilter = document.getElementById('categoryFilter');
  var frameworkFilter = document.getElementById('frameworkFilter');
  var resetFiltersBtn = document.getElementById('resetFilters');

  if (!rulesGrid || !searchInput || !resultCount || !emptyState ||
      !toolFilter || !categoryFilter || !frameworkFilter || !resetFiltersBtn) {
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

  var RULE_CATEGORY_OVERRIDES = {
    'python-scraper': 'backend',
    'supabase-db': 'database',
    'react-native': 'frontend',
    'rust-systems': 'backend',
    'ai-ml-python': 'ai',
    'typescript-general': 'quality'
  };

  var FRAMEWORK_ALIASES = {
    Tailwind: 'Tailwind CSS',
    'AI/ML': 'OpenAI API',
    Python: 'Python'
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

    return safeStr(ruleFallbackCategoryLabel(categoryKey));
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

  function getAvailableCategories(toolKey) {
    if (toolKey === 'all') {
      var merged = {};
      TOOL_KEYS.forEach(function (key) {
        var tool = TAXONOMY[key];
        if (!tool || !tool.categories) {
          return;
        }
        Object.keys(tool.categories).forEach(function (catKey) {
          merged[catKey] = tool.categories[catKey].label;
        });
      });
      return merged;
    }

    var selected = TAXONOMY[toolKey];
    if (!selected || !selected.categories) {
      return {};
    }

    var categories = {};
    Object.keys(selected.categories).forEach(function (catKey) {
      categories[catKey] = selected.categories[catKey].label;
    });
    return categories;
  }

  function getAvailableFrameworks(toolKey, categoryKey) {
    var frameworks = [];
    var seen = {};

    function addFramework(name) {
      if (name && !seen[name.toLowerCase()]) {
        seen[name.toLowerCase()] = true;
        frameworks.push(name);
      }
    }

    function collectFromToolCategory(key, catKey) {
      var tool = TAXONOMY[key];
      if (!tool || !tool.categories || !tool.categories[catKey]) {
        return;
      }
      tool.categories[catKey].frameworks.forEach(addFramework);
    }

    if (toolKey === 'all' && categoryKey === 'all') {
      TOOL_KEYS.forEach(function (key) {
        var tool = TAXONOMY[key];
        if (!tool || !tool.categories) {
          return;
        }
        Object.keys(tool.categories).forEach(function (catKey) {
          collectFromToolCategory(key, catKey);
        });
      });
      return frameworks.sort();
    }

    if (toolKey === 'all') {
      TOOL_KEYS.forEach(function (key) {
        collectFromToolCategory(key, categoryKey);
      });
      return frameworks.sort();
    }

    if (categoryKey === 'all') {
      var selectedTool = TAXONOMY[toolKey];
      if (!selectedTool || !selectedTool.categories) {
        return frameworks;
      }
      Object.keys(selectedTool.categories).forEach(function (catKey) {
        collectFromToolCategory(toolKey, catKey);
      });
      return frameworks.sort();
    }

    collectFromToolCategory(toolKey, categoryKey);
    return frameworks;
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

  function populateFrameworkSelect(frameworks) {
    var html = '<option value="all">All Frameworks</option>';
    frameworks.forEach(function (name) {
      html += '<option value="' + escapeHtml(name) + '">' + escapeHtml(name) + '</option>';
    });
    frameworkFilter.innerHTML = html;
  }

  function syncFilterOptions() {
    var categories = getAvailableCategories(filterState.tool);
    populateSelect(categoryFilter, categories, 'All Categories');

    if (filterState.category !== 'all' && !categories[filterState.category]) {
      filterState.category = 'all';
    }
    categoryFilter.value = filterState.category;

    var frameworks = getAvailableFrameworks(filterState.tool, filterState.category);
    populateFrameworkSelect(frameworks);

    if (filterState.framework !== 'all') {
      var frameworkExists = frameworks.some(function (name) {
        return name.toLowerCase() === filterState.framework.toLowerCase();
      });
      if (!frameworkExists) {
        filterState.framework = 'all';
      }
    }
    frameworkFilter.value = filterState.framework;
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
    var toolKey = normalizeToolKey(rule);
    var categoryKey = normalizeCategoryKey(rule);

    if (filterState.tool !== 'all' && toolKey !== filterState.tool) {
      return false;
    }

    if (filterState.category !== 'all' && categoryKey !== filterState.category) {
      return false;
    }

    if (!frameworkMatches(rule, filterState.framework)) {
      return false;
    }

    if (!filterState.search) {
      return true;
    }

    var q = filterState.search.toLowerCase();
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

  function createRuleCard(rule) {
    var toolKey = normalizeToolKey(rule);
    var categoryKey = normalizeCategoryKey(rule);
    var frameworks = getRuleFrameworks(rule);
    var displayFrameworks = frameworks.length ? frameworks : [normalizeFrameworkName(rule.framework)].filter(Boolean);

    var frameworkBadges = displayFrameworks.map(function (fw) {
      return renderBadge(fw, 'framework');
    }).join('');

    var tagsHtml = (rule.tags || []).slice(0, 4).map(function (tag) {
      return '<span class="text-xs px-2 py-0.5 rounded bg-gray-800/80 text-gray-500 border border-gray-700/50">' +
        escapeHtml(tag) + '</span>';
    }).join('');

    return (
      '<article class="rule-card rounded-xl p-5 sm:p-6 flex flex-col h-full" data-id="' + escapeHtml(safeStr(rule.id)) + '">' +
        '<div class="flex flex-wrap gap-1.5 mb-3">' +
          renderBadge(getToolLabel(toolKey), 'tool') +
          renderBadge(getCategoryLabel(toolKey, categoryKey), 'category') +
          frameworkBadges +
        '</div>' +
        '<h2 class="text-base sm:text-lg font-bold text-white mb-3 leading-snug">' + escapeHtml(safeStr(rule.title)) + '</h2>' +
        '<p class="text-gray-400 text-sm leading-relaxed flex-1 mb-4">' + escapeHtml(safeStr(rule.description)) + '</p>' +
        '<div class="flex flex-wrap gap-1.5 mb-5">' + tagsHtml + '</div>' +
        '<button type="button" class="btn-copy w-full py-3 px-4 min-h-[44px] rounded-lg text-white font-semibold text-sm mt-auto" data-copy-id="' + escapeHtml(rule.id) + '">' +
          'Copy Rule' +
        '</button>' +
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
        copyRule(btn);
      });
    });
  }

  function copyRule(btn) {
    var ruleId = btn.getAttribute('data-copy-id');
    var rule = allRules.find(function (r) {
      return r.id === ruleId;
    });

    if (!rule) {
      return;
    }

    function onSuccess() {
      btn.classList.add('copied');
      btn.textContent = 'Copied!';
      setTimeout(function () {
        btn.classList.remove('copied');
        btn.textContent = 'Copy Rule';
      }, 2000);
    }

    var textToCopy = safeStr(rule.content);
    if (!textToCopy) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(onSuccess).catch(function () {
        fallbackCopy(textToCopy, btn, onSuccess);
      });
    } else {
      fallbackCopy(textToCopy, btn, onSuccess);
    }
  }

  function fallbackCopy(text, btn, onSuccess) {
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
      btn.textContent = 'Copy failed';
      setTimeout(function () {
        btn.textContent = 'Copy Rule';
      }, 2000);
    }

    document.body.removeChild(textarea);
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

  frameworkFilter.addEventListener('change', function () {
    filterState.framework = frameworkFilter.value;
    renderRules();
  });

  searchInput.addEventListener('input', function (e) {
    filterState.search = e.target.value.trim();
    renderRules();
  });

  resetFiltersBtn.addEventListener('click', resetFilters);

  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  syncFilterOptions();
  renderRules();
})();
