/**
 * On page load, read RULES_DATA from rules.js and render into #rulesGrid
 */
(function () {
  'use strict';

  // 1. DOM elements
  var rulesGrid = document.getElementById('rulesGrid');
  var searchInput = document.getElementById('searchInput');
  var resultCount = document.getElementById('resultCount');
  var emptyState = document.getElementById('emptyState');
  var categoryFilters = document.getElementById('categoryFilters');

  if (!rulesGrid || !searchInput || !resultCount || !emptyState || !categoryFilters) {
    console.error('Required DOM elements missing — check index.html IDs');
    return;
  }

  // 2. Read rules data from rules.js
  var allRules = Array.isArray(window.RULES_DATA) ? window.RULES_DATA : [];
  if (allRules.length === 0) {
    console.warn('No rules loaded — ensure rules.js defines window.RULES_DATA before app.js');
  }

  // 3. Filter state
  var activeFilter = 'All';
  var searchQuery = '';

  var FILTER_OPTIONS = [
    'All',
    'Cursor',
    'Windsurf',
    'Frontend',
    'Backend',
    'Fullstack',
    'SaaS',
    'Python',
    'Next.js',
    'React',
    'Supabase'
  ];

  var FILTER_CATEGORY_MAP = {
    Frontend: 'Frontend',
    Backend: 'Backend',
    Fullstack: 'Fullstack'
  };

  // Escape special characters for safe HTML output (XSS prevention)
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Match rule against category, framework, or tags (case-insensitive)
  function safeStr(value) {
    return value == null ? '' : String(value);
  }

  function fieldMatches(rule, term) {
    var q = term.toLowerCase();

    if (safeStr(rule.category).toLowerCase().indexOf(q) !== -1) {
      return true;
    }

    if (safeStr(rule.framework).toLowerCase().indexOf(q) !== -1) {
      return true;
    }

    return (rule.tags || []).some(function (tag) {
      return safeStr(tag).toLowerCase().indexOf(q) !== -1;
    });
  }

  // Match rule against active filter button
  function ruleMatchesFilter(rule, filter) {
    if (filter === 'All') {
      return true;
    }

    if (filter === 'Cursor' || filter === 'Windsurf') {
      return rule.tool === filter;
    }

    if (FILTER_CATEGORY_MAP[filter] && rule.category === FILTER_CATEGORY_MAP[filter]) {
      return true;
    }

    return fieldMatches(rule, filter);
  }

  // Filter rules by search query and active filter
  function getFilteredRules() {
    return allRules.filter(function (rule) {
      var matchFilter = ruleMatchesFilter(rule, activeFilter);

      if (!searchQuery) {
        return matchFilter;
      }

      var q = searchQuery.toLowerCase();
      var searchText = [
        rule.title,
        rule.tool,
        rule.category,
        rule.framework,
        rule.description,
        (rule.tags || []).join(' '),
        rule.content
      ].map(safeStr).join(' ').toLowerCase();

      var matchSearch = searchText.indexOf(q) !== -1;
      return matchFilter && matchSearch;
    });
  }

  // Render filter buttons
  function renderFilterButtons() {
    var html = '';

    FILTER_OPTIONS.forEach(function (filter) {
      var isActive = filter === activeFilter;
      html += '<button type="button" class="filter-btn shrink-0 px-4 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-colors';
      if (isActive) {
        html += ' active';
      }
      html += '" data-filter="' + escapeHtml(filter) + '">' + escapeHtml(filter) + '</button>';
    });

    categoryFilters.innerHTML = html;

    categoryFilters.querySelectorAll('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeFilter = btn.getAttribute('data-filter');
        renderFilterButtons();
        renderRules();
      });
    });
  }

  // Build HTML for a single rule card
  function createRuleCard(rule) {
    var tagsHtml = (rule.tags || []).map(function (tag) {
      return '<span class="text-xs px-2 py-0.5 rounded bg-gray-800/80 text-gray-500 border border-gray-700/50">' +
        escapeHtml(tag) + '</span>';
    }).join('');

    return (
      '<article class="rule-card rounded-xl p-5 sm:p-6 flex flex-col h-full" data-id="' + escapeHtml(safeStr(rule.id)) + '">' +
        '<h2 class="text-base sm:text-lg font-bold text-white mb-3 leading-snug">' + escapeHtml(safeStr(rule.title)) + '</h2>' +
        '<ul class="text-sm text-gray-400 space-y-1 mb-3">' +
          '<li><span class="text-gray-500">Tool:</span> ' + escapeHtml(safeStr(rule.tool)) + '</li>' +
          '<li><span class="text-gray-500">Category:</span> ' + escapeHtml(safeStr(rule.category)) + '</li>' +
          '<li><span class="text-gray-500">Framework:</span> ' + escapeHtml(safeStr(rule.framework)) + '</li>' +
        '</ul>' +
        '<p class="text-gray-400 text-sm leading-relaxed flex-1 mb-4">' + escapeHtml(safeStr(rule.description)) + '</p>' +
        '<div class="flex flex-wrap gap-1.5 mb-5">' + tagsHtml + '</div>' +
        '<button type="button" class="btn-copy w-full py-3 px-4 min-h-[44px] rounded-lg text-white font-semibold text-sm mt-auto" data-copy-id="' + escapeHtml(rule.id) + '">' +
          'Copy Rule' +
        '</button>' +
      '</article>'
    );
  }

  // Render all rule cards
  function renderRules() {
    var filtered = getFilteredRules();

    resultCount.textContent = filtered.length === allRules.length
      ? allRules.length + ' rules'
      : 'Showing ' + filtered.length + ' of ' + allRules.length + ' rules';

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

    // Bind click handlers to Copy Rule buttons
    rulesGrid.querySelectorAll('[data-copy-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        copyRule(btn);
      });
    });
  }

  // Copy Rule click: copy the content field
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

    // Prefer modern Clipboard API
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

  // Fallback copy for older browsers
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

  // Re-render on search input
  searchInput.addEventListener('input', function (e) {
    searchQuery = e.target.value.trim();
    renderRules();
  });

  // Ctrl/Cmd + K focuses the search input
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Initial render on page load
  renderFilterButtons();
  renderRules();
})();
