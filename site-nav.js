/* Shared primary navigation.
   The tab name is a normal link (one click to the full directory).
   The chevron is a separate button so hover is never the only way to open.
   Markup is also written into each page by scripts/sync-site-nav.mjs;
   this file only toggles state, except lesson counts, which are filled
   from the catalog after it renders (never hard-coded). */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root.document) {
    root.USSNav = api;
    var boot = function () { api.enhance(root.document); };
    /* JSDOM leaves readyState "loading" and never fires DOMContentLoaded.
       A parsed body is enough; enhance is idempotent. */
    if (root.document.body) boot();
    else root.document.addEventListener('DOMContentLoaded', boot);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var TABS = [
    {
      id: 'start', label: 'Start Here', href: '/start-here', head: 'Learning paths',
      items: [
        ['Quality Improvement Basics', '/start-here#quality-improvement-basics'],
        ['Data Analysis Basics', '/start-here#data-analysis-basics'],
        ['Lean Six Sigma Tools', '/start-here#lean-six-sigma-tools'],
        ['Excel and Power BI Skills', '/start-here#excel-and-power-bi-skills'],
        ['Statistics for Decision-Making', '/start-here#statistics-for-decision-making']
      ],
      foot: [['See all learning paths →', '/start-here', 'primary']]
    },
    {
      id: 'lessons', label: 'Lessons', href: '/lessons', head: 'Lesson library', count: true, wide: false,
      items: [
        ['Data Analytics', '/lessons#data-analytics', 'data-analytics'],
        ['Quality Engineering', '/lessons#quality-engineering', 'quality-engineering'],
        ['Lean Six Sigma', '/lessons#lean-six-sigma', 'lean-six-sigma'],
        ['Statistics', '/lessons#statistics', 'statistics'],
        ['Power BI, Excel & SQL', '/lessons#power-bi-excel-sql', 'power-bi-excel-sql'],
        ['Project Management', '/lessons#project-management', 'project-management'],
        ['Business Decision-Making', '/lessons#business-decision-making', 'business-decision-making'],
        ['AI for Work', '/lessons#ai-for-work', 'ai-for-work']
      ],
      foot: [['View all lessons →', '/lessons', 'primary', 'total'], ['Request a topic', '/request-topic', 'secondary']]
    },
    {
      id: 'exam', label: 'Exam Practice', href: '/exam-practice', head: 'Certifications', wide: true,
      items: [
        ['CSSBB', 'Six Sigma Black Belt', '/exam-practice#exam-cssbb'],
        ['CQE', 'Quality Engineer', '/exam-practice#exam-cqe'],
        ['CMBB', 'Six Sigma Master Black Belt', '/exam-practice#exam-mbb'],
        ['CSSGB', 'Six Sigma Green Belt', '/exam-practice#exam-cssgb'],
        ['CMQ/OE', 'Manager of Quality / Org. Excellence', '/exam-practice#exam-cmq'],
        ['CRE', 'Reliability Engineer', '/exam-practice#exam-cre'],
        ['PMP', 'Project Management Professional', '/exam-practice#exam-pmp'],
        ['NPPE', 'National Professional Practice Exam', '/exam-practice#exam-nppe'],
        ['CQA', 'Quality Auditor', null]
      ],
      foot: [['All exams →', '/exam-practice', 'primary'], ['My exams', '/exam-practice#my-exams', 'secondary']]
    },
    {
      id: 'tools', label: 'Engineering Tools', href: '/engineering-tools', head: 'Tools',
      items: [
        ['Engineering & Statistics Calculator', '/tools/engineering-statistics-calculator'],
        ['Unit Converter', '/tools/unit-converter'],
        ['Material Specification Lookup', '/engineering-tools/grade-specification-lookup/'],
        ['Material Specification Compliance Checker', '/tools/material-specification-compliance-checker'],
        ['Steel Phase & Transformation Explorer', '/tools/steel-phase-explorer']
      ],
      foot: [['All tools →', '/engineering-tools', 'primary'], ['Suggest a tool', '/engineering-tools#suggest-a-tool', 'secondary']]
    },
    {
      id: 'services', label: 'Services', href: '/services', head: 'Services', wide: true,
      items: [
        ['Corporate Training', '/services#corporate-training', 'Team workshops on Lean Six Sigma and quality tools'],
        ['One-on-One Coaching', '/services#one-on-one-coaching', 'Excel, Power BI, Minitab, statistics'],
        ['Consulting Support', '/services#consulting-support', 'Root cause analysis, KPIs, quality investigations'],
        ['Custom Lessons', '/services#custom-lessons', "Training built around your team's needs"],
        ['Data & Dashboard Support', '/services#data-dashboard-support', 'Excel, Power BI and SQL help']
      ],
      foot: [['Book a consultation', '/contact', 'book']]
    },
    {
      id: 'about', label: 'About', href: '/about', head: 'About',
      items: [
        ['About UpSkill Sprint', '/about', 'Who builds the lessons and why'],
        ['FAQ', '/faq', 'Free lessons, accounts, exams'],
        ['Request a Topic', '/request-topic', 'Tell us the lesson you need'],
        ['Contact', '/contact', 'Questions and partnerships']
      ],
      foot: [['skillsprintconsulting@gmail.com', 'mailto:skillsprintconsulting@gmail.com', 'primary']]
    }
  ];

  function esc(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function chevron() {
    return '<svg class="nav-chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9l6 6 6-6"></path></svg>';
  }

  function rowHtml(tab, item) {
    if (tab.id === 'exam') {
      var name = '<span class="nav-acronym">' + esc(item[0]) + '</span><span class="nav-name">' + esc(item[1]) + '</span>';
      if (!item[2]) return '<span class="nav-row nav-exam is-soon" aria-disabled="true"><span class="nav-acronym">' + esc(item[0]) + '</span><span class="nav-name">' + esc(item[1]) + '</span><span class="nav-soon">Coming soon</span></span>';
      return '<a class="nav-row nav-exam" href="' + esc(item[2]) + '">' + name + '</a>';
    }
    if (tab.id === 'services' || tab.id === 'about') {
      return '<a class="nav-row nav-rich" href="' + esc(item[1]) + '"><span class="nav-name">' + esc(item[0]) + '</span><span class="nav-desc">' + esc(item[2]) + '</span></a>';
    }
    if (tab.id === 'lessons') {
      return '<a class="nav-row" href="' + esc(item[1]) + '"><span class="nav-name">' + esc(item[0]) + '</span><span class="nav-count" data-nav-count="' + esc(item[2]) + '" hidden></span><span class="nav-soon" data-nav-soon hidden>Soon</span></a>';
    }
    return '<a class="nav-row" href="' + esc(item[1]) + '"><span class="nav-name">' + esc(item[0]) + '</span></a>';
  }

  function footHtml(tab, mobile) {
    return tab.foot.map(function (part) {
      var cls = part[2] === 'book' ? 'nav-book' : (part[2] === 'secondary' ? 'nav-foot-secondary' : 'nav-foot-primary');
      if (mobile && part[2] !== 'secondary') cls += ' nav-acc-all';
      var attr = part[3] === 'total' ? ' data-nav-total-link' : '';
      return '<a class="' + cls + '" href="' + esc(part[1]) + '"' + attr + '>' + esc(part[0]) + '</a>';
    }).join('');
  }

  function panelInner(tab) {
    var head = '<div class="nav-panel-head"><span>' + esc(tab.head) + '</span>' +
      (tab.count ? '<span data-nav-total hidden></span>' : '') + '</div>';
    var rows = '<div class="nav-rows">' + tab.items.map(function (item) { return rowHtml(tab, item); }).join('') + '</div>';
    var footClass = tab.foot.length === 1 && tab.foot[0][2] === 'book' ? 'nav-foot nav-foot-solo' : 'nav-foot';
    return head + rows + '<div class="' + footClass + '">' + footHtml(tab, false) + '</div>';
  }

  function markup(kind, current) {
    var mobile = kind === 'mobile';
    return TABS.map(function (tab) {
      var on = tab.id === current ? ' aria-current="page"' : '';
      if (mobile) {
        return '<div class="nav-acc" data-nav-acc="' + tab.id + '">' +
          '<button type="button" class="nav-acc-btn" data-nav-tab="' + tab.id + '"' + on + ' aria-expanded="false" aria-controls="nav-m-' + tab.id + '">' +
          '<span>' + esc(tab.label) + '</span>' + chevron() + '</button>' +
          '<div class="nav-acc-panel" id="nav-m-' + tab.id + '" hidden>' +
          tab.items.map(function (item) { return rowHtml(tab, item); }).join('') +
          footHtml(tab, true) + '</div></div>';
      }
      return '<div class="nav-item' + (tab.wide ? ' nav-item-wide' : '') + '" data-nav-item="' + tab.id + '">' +
        '<a class="nav-tab-link" data-nav-tab="' + tab.id + '" href="' + tab.href + '"' + on + '>' + esc(tab.label) + '</a>' +
        '<button type="button" class="nav-chevron" aria-expanded="false" aria-controls="nav-d-' + tab.id + '" aria-label="Show ' + esc(tab.label) + ' menu">' + chevron() + '</button>' +
        '<div class="nav-panel" id="nav-d-' + tab.id + '" hidden>' + panelInner(tab) + '</div></div>';
    }).join('') + (mobile
      ? '<div class="nav-drawer-footer"><a class="nav-drawer-account" href="/sign-in.html">Account</a><a class="nav-drawer-browse" href="/lessons">Browse lessons</a></div>'
      : '');
  }

  function hrefs() {
    var list = [];
    TABS.forEach(function (tab) {
      list.push(tab.href);
      tab.items.forEach(function (item) {
        var href = tab.id === 'exam' ? item[2] : item[1];
        if (href) list.push(href);
      });
      tab.foot.forEach(function (part) { if (part[1].indexOf('mailto:') !== 0) list.push(part[1]); });
    });
    return list;
  }

  var closeTimer = 0;
  var drawerOpener = null;

  function finePointer() {
    return !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }

  function desktopOpen() {
    return !!(window.matchMedia && window.matchMedia('(min-width: 1441px)').matches);
  }

  function openItem(item) {
    if (!item) return;
    var nav = item.closest('nav');
    if (nav) nav.querySelectorAll('.nav-item.is-open').forEach(function (other) {
      if (other !== item) closeItem(other);
    });
    item.classList.add('is-open');
    var btn = item.querySelector('.nav-chevron');
    var panel = item.querySelector('.nav-panel');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
  }

  function closeItem(item) {
    if (!item) return;
    item.classList.remove('is-open');
    var btn = item.querySelector('.nav-chevron');
    var panel = item.querySelector('.nav-panel');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
  }

  function closeDesktop() {
    document.querySelectorAll('nav.desktop-nav .nav-item.is-open').forEach(closeItem);
  }

  function openAcc(acc) {
    var nav = acc.parentNode;
    if (nav) Array.prototype.forEach.call(nav.querySelectorAll('.nav-acc.is-open'), function (other) {
      if (other !== acc) closeAcc(other);
    });
    acc.classList.add('is-open');
    var btn = acc.querySelector('.nav-acc-btn');
    var panel = acc.querySelector('.nav-acc-panel');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    if (panel) panel.hidden = false;
  }

  function closeAcc(acc) {
    acc.classList.remove('is-open');
    var btn = acc.querySelector('.nav-acc-btn');
    var panel = acc.querySelector('.nav-acc-panel');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
  }

  function drawerBoxes() {
    return document.querySelectorAll('input.mnav-check');
  }

  function closeDrawer() {
    drawerBoxes().forEach(function (box) {
      if (!box.checked) return;
      box.checked = false;
      box.dispatchEvent(new Event('change', { bubbles: true }));
    });
    document.body.classList.remove('nav-drawer-open');
  }

  function focusMenuButton() {
    var button = document.querySelector('button.uss-menu-toggle:not([hidden])') || document.querySelector('label.mobile-menu-btn');
    if (button && button.focus) button.focus();
  }

  function lessonCounts() {
    if (document.documentElement.getAttribute('data-lesson-catalog-ready') !== 'true') return;
    var total = 0;
    document.querySelectorAll('[data-nav-count]').forEach(function (node) {
      if (node.closest('[data-nav-count-done]')) return;
    });
    var seen = {};
    document.querySelectorAll('[data-nav-count]').forEach(function (node) {
      var id = node.getAttribute('data-nav-count');
      if (seen[id]) return;
      seen[id] = true;
      var section = document.getElementById(id);
      var count = section ? section.querySelectorAll('[data-lesson-item]').length : 0;
      total += count;
      document.querySelectorAll('[data-nav-count="' + id + '"]').forEach(function (el) {
        var soon = el.parentNode && el.parentNode.querySelector('[data-nav-soon]');
        if (!count) {
          el.hidden = true;
          el.textContent = '';
          if (soon) soon.hidden = false;
        } else {
          el.hidden = false;
          el.textContent = String(count);
          if (soon) soon.hidden = true;
        }
      });
    });
    document.querySelectorAll('[data-nav-total]').forEach(function (el) {
      el.hidden = false;
      el.textContent = total + (total === 1 ? ' lesson' : ' lessons');
    });
    document.querySelectorAll('[data-nav-total-link]').forEach(function (el) {
      el.textContent = 'View all ' + total + (total === 1 ? ' lesson' : ' lessons') + ' →';
    });
  }

  function trapTab(event) {
    if (event.key !== 'Tab' || desktopOpen()) return;
    var box = document.querySelector('input.mnav-check:checked');
    if (!box) return;
    var nav = box.parentNode && box.parentNode.querySelector('nav.mobile-nav');
    if (!nav) nav = document.querySelector('nav.mobile-nav');
    var toggle = document.querySelector('button.uss-menu-toggle');
    var nodes = [];
    if (toggle && !toggle.hidden) nodes.push(toggle);
    if (nav) nav.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function (el) {
      if (el.closest('[hidden]')) return;
      if (el.tabIndex < 0) return;
      nodes.push(el);
    });
    if (!nodes.length) return;
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function enhance(doc) {
    if (!doc || doc.documentElement.getAttribute('data-nav-ready') === 'true') {
      lessonCounts();
      return;
    }
    doc.documentElement.setAttribute('data-nav-ready', 'true');
    var header = doc.querySelector('header.site');
    if (header && header.getBoundingClientRect) {
      var height = header.getBoundingClientRect().height;
      if (height > 40) doc.documentElement.style.setProperty('--nav-header-offset', Math.round(height) + 'px');
    }
    doc.addEventListener('click', function (event) {
      var target = event.target;
      if (!target.closest) return;
      var chevronBtn = target.closest('.nav-chevron');
      if (chevronBtn) {
        var item = chevronBtn.closest('.nav-item');
        if (item.classList.contains('is-open')) closeItem(item);
        else openItem(item);
        return;
      }
      var accBtn = target.closest('.nav-acc-btn');
      if (accBtn) {
        var acc = accBtn.closest('.nav-acc');
        if (acc.classList.contains('is-open')) closeAcc(acc);
        else openAcc(acc);
        return;
      }
      if (target.closest('.nav-panel a, .nav-acc-panel a, .nav-drawer-footer a')) {
        closeDesktop();
        document.querySelectorAll('.nav-acc.is-open').forEach(closeAcc);
        closeDrawer();
        return;
      }
      if (!target.closest('.nav-item')) closeDesktop();
    });
    /* Hover opens on a fine pointer only, with a short close delay so the
       pointer can cross the gap from the tab into the panel. */
    doc.addEventListener('pointerover', function (event) {
      if (!finePointer() || !desktopOpen() || !event.target.closest) return;
      var item = event.target.closest('.nav-item');
      if (!item) return;
      var from = event.relatedTarget;
      if (from && item.contains(from)) return;
      clearTimeout(closeTimer);
      openItem(item);
    });
    doc.addEventListener('pointerout', function (event) {
      if (!finePointer() || !event.target.closest) return;
      var item = event.target.closest('.nav-item');
      if (!item) return;
      var to = event.relatedTarget;
      if (to && item.contains(to)) return;
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { closeItem(item); }, 200);
    });
    doc.addEventListener('focusout', function (event) {
      var item = event.target.closest && event.target.closest('.nav-item.is-open');
      if (!item) return;
      var next = event.relatedTarget;
      if (next && item.contains(next)) return;
      setTimeout(function () {
        if (!item.contains(doc.activeElement)) closeItem(item);
      }, 0);
    });
    doc.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' && event.target.classList && event.target.classList.contains('nav-chevron')) {
        var downItem = event.target.closest('.nav-item');
        openItem(downItem);
        var first = downItem.querySelector('.nav-panel a');
        if (first) { event.preventDefault(); first.focus(); }
        return;
      }
      if (event.key !== 'Escape') { trapTab(event); return; }
      var open = doc.querySelector('nav.desktop-nav .nav-item.is-open');
      if (open) {
        var btn = open.querySelector('.nav-chevron');
        closeItem(open);
        if (btn) btn.focus();
        return;
      }
      var checked = doc.querySelector('input.mnav-check:checked');
      if (checked) {
        closeDrawer();
        if (drawerOpener && drawerOpener.focus) drawerOpener.focus();
        else focusMenuButton();
      }
    });
    doc.addEventListener('change', function (event) {
      if (!event.target.classList || !event.target.classList.contains('mnav-check')) return;
      doc.body.classList.toggle('nav-drawer-open', event.target.checked);
      if (event.target.checked) {
        drawerOpener = doc.activeElement;
        var firstBtn = doc.querySelector('nav.mobile-nav .nav-acc-btn');
        if (firstBtn) firstBtn.focus();
      }
    });
    doc.addEventListener('upskill:lesson-catalog-ready', lessonCounts);
    lessonCounts();
  }

  return { tabs: TABS, markup: markup, hrefs: hrefs, enhance: enhance, lessonCounts: lessonCounts };
});
