from pathlib import Path

# Fix nullable mastery propagation/rendering in hardening module.
p=Path('test-bank-adaptive-mastery-hardening.js')
s=p.read_text()
anchor="""  function effectiveMastery(state, timestamp) {
"""
assert anchor in s
helper="""  function masteryPercent(value) {
    return Number.isFinite(Number(value)) ? Math.round(Number(value)) + '%' : 'Unavailable';
  }

  function masteryValue(value) {
    return Number.isFinite(Number(value)) ? Math.max(0, Math.min(100, Number(value))) : 0;
  }

"""
s=s.replace(anchor,helper+anchor,1)
s=s.replace("const currentMastery = effectiveMastery(stateFor(question, data), Date.now());","const currentMastery = effectiveMastery(stateFor(question, data), Date.now());")
s=s.replace("Current effective mastery <strong>' + currentMastery + '%</strong>","Current effective mastery <strong>' + masteryPercent(currentMastery) + '</strong>",1)
s=s.replace("if (effectiveMastery(state, timestamp) < MASTERY_THRESHOLD) return 'one of your lower-mastery questions';","const mastery = effectiveMastery(state, timestamp);\n    if (mastery == null) return 'mastery evidence is incomplete and needs another reliable retrieval';\n    if (mastery < MASTERY_THRESHOLD) return 'one of your lower-mastery questions';",1)
old="""      if (!groups[sub]) groups[sub] = { sub: sub, attempted: 0, masterySum: 0 };
      groups[sub].attempted += 1;
      groups[sub].masterySum += effectiveMastery(state, timestamp);
    });
    return Object.keys(groups).sort().map(function (sub) {
      const group = groups[sub];
      return { sub: sub, attempted: group.attempted, avgMastery: Math.round(group.masterySum / group.attempted) };
    });
"""
assert old in s
new="""      if (!groups[sub]) groups[sub] = { sub: sub, attempted: 0, masterySum: 0, unknownMastery: 0 };
      groups[sub].attempted += 1;
      const mastery = effectiveMastery(state, timestamp);
      if (mastery == null) groups[sub].unknownMastery += 1;
      else groups[sub].masterySum += mastery;
    });
    return Object.keys(groups).sort().map(function (sub) {
      const group = groups[sub];
      return { sub: sub, attempted: group.attempted, avgMastery: group.unknownMastery ? null : Math.round(group.masterySum / group.attempted), unknownMastery: group.unknownMastery };
    });
"""
s=s.replace(old,new,1)
old="""    const inner = '<div class=\"tb-sec\">Mastery confidence and coverage</div><div class=\"tb-reliability-grid\"><div><strong>' + summary.attemptedMastery + '%</strong><span>mastery on attempted questions</span></div><div><strong>' + summary.coverage + '%</strong><span>blueprint-weighted question coverage</span></div><div><strong>' + summary.readiness + '%</strong><span>coverage-adjusted readiness</span></div></div>"""
assert old in s
new="""    const inner = '<div class=\"tb-sec\">Mastery confidence and coverage</div><div class=\"tb-reliability-grid\"><div><strong>' + masteryPercent(summary.attemptedMastery) + '</strong><span>mastery on attempted questions</span></div><div><strong>' + masteryPercent(summary.coverage) + '</strong><span>blueprint-weighted question coverage</span></div><div><strong>' + masteryPercent(summary.readiness) + '</strong><span>coverage-adjusted readiness</span></div></div>"""
s=s.replace(old,new,1)
s=s.replace("if (ring.style.getPropertyValue('--p') !== String(summary.attemptedMastery)) ring.style.setProperty('--p', summary.attemptedMastery);","const ringValue = masteryValue(summary.attemptedMastery);\n      if (ring.style.getPropertyValue('--p') !== String(ringValue)) ring.style.setProperty('--p', ringValue);",1)
s=s.replace("const strongText = summary.attemptedMastery + '%';","const strongText = masteryPercent(summary.attemptedMastery);",1)
s=s.replace("['Mastery on attempted questions', summary.attemptedMastery + '%'],","['Mastery on attempted questions', masteryPercent(summary.attemptedMastery)],",1)
s=s.replace("['Blueprint-weighted question coverage', summary.coverage + '% (raw: ' + (summary.rawCoverage == null ? 'Unavailable' : summary.rawCoverage.toFixed(1) + '%') + ')'],","['Blueprint-weighted question coverage', masteryPercent(summary.coverage) + ' (raw: ' + (summary.rawCoverage == null ? 'Unavailable' : summary.rawCoverage.toFixed(1) + '%') + ')'],",1)
s=s.replace("['Coverage-adjusted readiness', summary.readiness + '%'],","['Coverage-adjusted readiness', masteryPercent(summary.readiness)],",1)
s=s.replace("doc.text(row.avgMastery + '%', PAGE_RIGHT, y, { align: 'right' });","doc.text(masteryPercent(row.avgMastery), PAGE_RIGHT, y, { align: 'right' });",1)
p.write_text(s)

# Fix nullable mastery propagation/rendering in analytics.
p=Path('test-bank-analytics-dashboard.js')
s=p.read_text()
anchor="""  function effectiveMastery(state, timestamp) {
"""
assert anchor in s
helper="""  function masteryPercent(value) {
    return Number.isFinite(Number(value)) ? Math.round(Number(value)) + '%' : 'Unavailable';
  }

  function masteryValue(value) {
    return Number.isFinite(Number(value)) ? Math.max(0, Math.min(100, Number(value))) : 0;
  }

"""
s=s.replace(anchor,helper+anchor,1)
old="""      groups[sub] = groups[sub] || { attempted: 0, masterySum: 0 };
      if (!state || !state.attempts) return;
      groups[sub].attempted += 1;
      groups[sub].masterySum += effectiveMastery(state, timestamp);
"""
assert old in s
new="""      groups[sub] = groups[sub] || { attempted: 0, masterySum: 0, unknownMastery: 0 };
      if (!state || !state.attempts) return;
      groups[sub].attempted += 1;
      const mastery = effectiveMastery(state, timestamp);
      if (mastery == null) groups[sub].unknownMastery += 1;
      else groups[sub].masterySum += mastery;
"""
s=s.replace(old,new,1)
s=s.replace("const avgMastery = group && group.attempted ? Math.round(group.masterySum / group.attempted) : 0;","const avgMastery = group && group.attempted ? (group.unknownMastery ? null : Math.round(group.masterySum / group.attempted)) : 0;",1)
s=s.replace("domainReadiness: Math.round(avgMastery * coverage / 100)","domainReadiness: avgMastery == null ? null : Math.round(avgMastery * coverage / 100), unknownMastery: group ? Number(group.unknownMastery || 0) : 0",1)
old="""      const gap = 100 - item.domainReadiness;
      return Object.assign({ gap: gap, leverage: item.weight * gap }, item);
    }).sort(function (a, b) { return b.leverage - a.leverage; }).slice(0, limit || 3);
"""
assert old in s
new="""      const gap = item.domainReadiness == null ? null : 100 - item.domainReadiness;
      return Object.assign({ gap: gap, leverage: gap == null ? null : item.weight * gap }, item);
    }).sort(function (a, b) {
      if (a.leverage == null && b.leverage == null) return 0;
      if (a.leverage == null) return 1;
      if (b.leverage == null) return -1;
      return b.leverage - a.leverage;
    }).slice(0, limit || 3);
"""
s=s.replace(old,new,1)
s=s.replace("const detail = fullName + ' — ' + item.domainReadiness + '% readiness, ' + item.weightPct + '% of exam';","const detail = fullName + ' — ' + masteryPercent(item.domainReadiness) + ' readiness, ' + item.weightPct + '% of exam';",1)
s=s.replace("const readinessPoly = items.map(function (item, index) { const pt = point(index, item.domainReadiness / 100);","const readinessPoly = items.map(function (item, index) { const pt = point(index, masteryValue(item.domainReadiness) / 100);",1)
s=s.replace("return '<li><span class=\"tb-an-rank\">' + (index + 1) + '</span><span class=\"tb-an-lev-name\">' + esc(item.name) + '</span><span class=\"tb-pill ' + tone(item.domainReadiness) + '\">' + (item.attempted ? item.domainReadiness + '% readiness' : 'not attempted') + '</span></li>';","return '<li><span class=\"tb-an-rank\">' + (index + 1) + '</span><span class=\"tb-an-lev-name\">' + esc(item.name) + '</span><span class=\"tb-pill ' + tone(masteryValue(item.domainReadiness)) + '\">' + (item.attempted ? masteryPercent(item.domainReadiness) + ' readiness' : 'not attempted') + '</span></li>';",1)
s=s.replace("'<div class=\"tb-an-ring\" style=\"--p:' + summary.readiness + '\"><strong>' + summary.readiness + '%</strong><span>readiness</span></div>'","'<div class=\"tb-an-ring\" style=\"--p:' + masteryValue(summary.readiness) + '\"><strong>' + masteryPercent(summary.readiness) + '</strong><span>readiness</span></div>'",1)
s=s.replace("'<div class=\"tb-an-stat\"><b>' + summary.attemptedMastery + '%</b><span>mastery on attempted</span></div>'","'<div class=\"tb-an-stat\"><b>' + masteryPercent(summary.attemptedMastery) + '</b><span>mastery on attempted</span></div>'",1)
s=s.replace("'<div class=\"tb-an-stat\"><b>' + summary.coverage + '%</b><span>blueprint-weighted coverage</span></div>'","'<div class=\"tb-an-stat\"><b>' + masteryPercent(summary.coverage) + '</b><span>blueprint-weighted coverage</span></div>'",1)
s=s.replace("'<div class=\"tb-an-domain-head\"><span>' + esc(item.name) + ' <i>(' + item.weightPct + '% of exam)</i></span><b class=\"tb-pill ' + tone(item.avgMastery) + '\">' + item.avgMastery + '%</b></div>'","'<div class=\"tb-an-domain-head\"><span>' + esc(item.name) + ' <i>(' + item.weightPct + '% of exam)</i></span><b class=\"tb-pill ' + tone(masteryValue(item.avgMastery)) + '\">' + masteryPercent(item.avgMastery) + '</b></div>'",1)
s=s.replace("'<div class=\"tb-an-bar-track\"><div class=\"tb-an-bar-fill ' + tone(item.avgMastery) + '\" style=\"width:' + item.avgMastery + '%\"></div></div>'","'<div class=\"tb-an-bar-track\"><div class=\"tb-an-bar-fill ' + tone(masteryValue(item.avgMastery)) + '\" style=\"width:' + masteryValue(item.avgMastery) + '%\"></div></div>'",1)
p.write_text(s)
