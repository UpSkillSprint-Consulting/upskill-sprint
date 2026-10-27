(function () {
  "use strict";

  var SQL_VERSION = "1.10.3";
  var CDNS = [
    { script: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/" + SQL_VERSION + "/sql-wasm.js", base: "https://cdnjs.cloudflare.com/ajax/libs/sql.js/" + SQL_VERSION + "/" },
    { script: "https://cdn.jsdelivr.net/npm/sql.js@" + SQL_VERSION + "/dist/sql-wasm.js", base: "https://cdn.jsdelivr.net/npm/sql.js@" + SQL_VERSION + "/dist/" }
  ];
  var db = null;
  var dbReady = false;
  var currentStarter = "";
  var liveTimer = null;
  var completedChallenges = new Set(JSON.parse(localStorage.getItem("uss-sql-challenges") || "[]"));

  var examples = {
    select: "SELECT order_id, product, grade, quantity\nFROM production_orders;",
    from: "SELECT *\nFROM customers;",
    where: "SELECT order_id, product, quantity\nFROM production_orders\nWHERE status = 'Complete' AND quantity > 150;",
    order: "SELECT product, grade, quantity\nFROM production_orders\nORDER BY quantity DESC;",
    group: "SELECT line, SUM(quantity) AS total_quantity\nFROM production_orders\nGROUP BY line;",
    having: "SELECT line, SUM(quantity) AS total_quantity\nFROM production_orders\nGROUP BY line\nHAVING SUM(quantity) > 500;",
    join: "SELECT p.order_id, p.product, c.customer_name\nFROM production_orders AS p\nJOIN customers AS c\n  ON p.customer_id = c.customer_id;",
    limit: "SELECT order_id, product, quantity\nFROM production_orders\nORDER BY quantity DESC\nLIMIT 5;"
  };

  var challenges = [
    {
      id: 1, title: "Choose columns with SELECT", level: "Foundation",
      task: "Return order_id, product, and grade from production_orders. Sort by order_id.",
      starter: "SELECT order_id, product\nFROM production_orders\nORDER BY order_id;",
      hint: "Place the three column names after SELECT and separate them with commas.",
      solution: "SELECT order_id, product, grade\nFROM production_orders\nORDER BY order_id;"
    },
    {
      id: 2, title: "Filter completed orders", level: "Foundation",
      task: "Return order_id, product, status, and quantity for Complete orders. Sort by order_id.",
      starter: "SELECT order_id, product, status, quantity\nFROM production_orders\nWHERE \nORDER BY order_id;",
      hint: "status is text, so compare it with the quoted value 'Complete'.",
      solution: "SELECT order_id, product, status, quantity\nFROM production_orders\nWHERE status = 'Complete'\nORDER BY order_id;"
    },
    {
      id: 3, title: "Sort highest quantity first", level: "Foundation",
      task: "Return order_id, product, and quantity for every order, with the largest quantity first.",
      starter: "SELECT order_id, product, quantity\nFROM production_orders\nORDER BY quantity ;",
      hint: "Use DESC after quantity to sort from highest to lowest.",
      solution: "SELECT order_id, product, quantity\nFROM production_orders\nORDER BY quantity DESC;"
    },
    {
      id: 4, title: "Summarize by production line", level: "Aggregation",
      task: "Return line and SUM(quantity) as total_quantity. Produce one row per line and sort by line.",
      starter: "SELECT line, SUM(quantity) AS total_quantity\nFROM production_orders\nGROUP BY \nORDER BY line;",
      hint: "Group by the non-aggregated column: line.",
      solution: "SELECT line, SUM(quantity) AS total_quantity\nFROM production_orders\nGROUP BY line\nORDER BY line;"
    },
    {
      id: 5, title: "Filter summarized lines", level: "Aggregation",
      task: "Return line and total quantity only for lines whose SUM(quantity) is greater than 600. Sort highest total first.",
      starter: "SELECT line, SUM(quantity) AS total_quantity\nFROM production_orders\nGROUP BY line\nHAVING \nORDER BY total_quantity DESC;",
      hint: "The condition depends on a group total, so use HAVING SUM(quantity) > 600.",
      solution: "SELECT line, SUM(quantity) AS total_quantity\nFROM production_orders\nGROUP BY line\nHAVING SUM(quantity) > 600\nORDER BY total_quantity DESC;"
    },
    {
      id: 6, title: "Join orders to customers", level: "Relationships",
      task: "Return order_id, product, customer_name, and region. Join production_orders p to customers c and sort by order_id.",
      starter: "SELECT p.order_id, p.product, c.customer_name, c.region\nFROM production_orders AS p\nJOIN customers AS c\n  ON \nORDER BY p.order_id;",
      hint: "Both tables share customer_id. Match p.customer_id to c.customer_id.",
      solution: "SELECT p.order_id, p.product, c.customer_name, c.region\nFROM production_orders AS p\nJOIN customers AS c\n  ON p.customer_id = c.customer_id\nORDER BY p.order_id;"
    },
    {
      id: 7, title: "Join orders to quality tests", level: "Relationships",
      task: "Return order_id, product, test_type, result_value, unit, and test_status for tests marked Review. Sort by order_id and test_id.",
      starter: "SELECT p.order_id, p.product, q.test_type, q.result_value, q.unit, q.test_status\nFROM production_orders AS p\nJOIN quality_tests AS q\n  ON p.order_id = q.order_id\nWHERE \nORDER BY p.order_id, q.test_id;",
      hint: "Filter the quality table with q.test_status = 'Review'.",
      solution: "SELECT p.order_id, p.product, q.test_type, q.result_value, q.unit, q.test_status\nFROM production_orders AS p\nJOIN quality_tests AS q\n  ON p.order_id = q.order_id\nWHERE q.test_status = 'Review'\nORDER BY p.order_id, q.test_id;"
    },
    {
      id: 8, title: "Return the five largest orders", level: "Result control",
      task: "Return order_id, product, and quantity for the five largest orders.",
      starter: "SELECT order_id, product, quantity\nFROM production_orders\nORDER BY quantity DESC\nLIMIT ;",
      hint: "Place the number 5 after LIMIT.",
      solution: "SELECT order_id, product, quantity\nFROM production_orders\nORDER BY quantity DESC\nLIMIT 5;"
    },
    {
      id: 9, title: "Final: combine seven clauses", level: "Capstone",
      task: "For Complete orders, return line, COUNT(*) as completed_orders, and SUM(quantity) as total_quantity. Keep lines with more than 2 completed orders, sort total_quantity highest first, and return the top 3 lines.",
      starter: "SELECT line,\n       COUNT(*) AS completed_orders,\n       SUM(quantity) AS total_quantity\nFROM production_orders\nWHERE \nGROUP BY \nHAVING \nORDER BY \nLIMIT ;",
      hint: "Use status = 'Complete', GROUP BY line, HAVING COUNT(*) > 2, ORDER BY total_quantity DESC, and LIMIT 3.",
      solution: "SELECT line,\n       COUNT(*) AS completed_orders,\n       SUM(quantity) AS total_quantity\nFROM production_orders\nWHERE status = 'Complete'\nGROUP BY line\nHAVING COUNT(*) > 2\nORDER BY total_quantity DESC\nLIMIT 3;"
    }
  ];

  var editor = document.getElementById("sql-editor");
  var feedback = document.getElementById("lab-feedback");
  var resultsScroll = document.getElementById("results-scroll");
  var rowCount = document.getElementById("row-count");
  var challengeSelect = document.getElementById("challenge-select");
  var challengeBrief = document.getElementById("challenge-brief");
  var challengeProgress = document.getElementById("challenge-progress");
  var liveToggle = document.getElementById("live-run-toggle");
  var coachToggle = document.getElementById("coach-toggle");

  function escapeHtml(value) {
    return String(value == null ? "NULL" : value)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function loadSqlJs(index) {
    index = index || 0;
    if (index >= CDNS.length) return Promise.reject(new Error("The SQL engine could not be downloaded."));
    return loadScript(CDNS[index].script).then(function () {
      if (typeof window.initSqlJs !== "function") throw new Error("SQL library did not initialize.");
      return window.initSqlJs({ locateFile: function (file) { return CDNS[index].base + file; } });
    }).catch(function () { return loadSqlJs(index + 1); });
  }

  function initializeDatabase(SQL) {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE customers (
        customer_id INTEGER PRIMARY KEY,
        customer_name TEXT NOT NULL,
        region TEXT NOT NULL,
        industry TEXT NOT NULL
      );
      CREATE TABLE production_orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        order_date TEXT NOT NULL,
        product TEXT NOT NULL,
        grade TEXT NOT NULL,
        line TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT NOT NULL,
        scrap_tonnes REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      );
      CREATE TABLE quality_tests (
        test_id INTEGER PRIMARY KEY,
        order_id INTEGER NOT NULL,
        test_type TEXT NOT NULL,
        result_value REAL NOT NULL,
        unit TEXT NOT NULL,
        test_status TEXT NOT NULL,
        test_date TEXT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES production_orders(order_id)
      );
      INSERT INTO customers VALUES
        (1,'Prairie Pipeline','West','Energy'),
        (2,'Northern Energy','Central','Energy'),
        (3,'Atlas Fabrication','West','Manufacturing'),
        (4,'Great Lakes Infrastructure','East','Construction'),
        (5,'Arctic Transmission','North','Energy'),
        (6,'Metro Steelworks','Central','Manufacturing'),
        (7,'Coastal Projects','East','Construction'),
        (8,'Frontier Processing','West','Mining');
      INSERT INTO production_orders VALUES
        (1001,1,'2026-06-02','24-inch Pipe','X70','ERW',120,'Complete',1.8),
        (1002,2,'2026-06-03','Steel Coil','480AT-3','Rolling',210,'Complete',2.4),
        (1003,3,'2026-06-04','16-inch Pipe','X52','ERW',150,'Complete',1.1),
        (1004,4,'2026-06-05','Spiral Pipe','X60','Spiral',140,'Complete',2.0),
        (1005,5,'2026-06-06','Steel Coil','L485M','Rolling',85,'In Process',0.7),
        (1006,6,'2026-06-07','Slit Coil','GR.52-2','Slitter',95,'Complete',0.9),
        (1007,7,'2026-06-08','36-inch Pipe','X70','Spiral',225,'Complete',3.1),
        (1008,8,'2026-06-09','Steel Coil','480AT-3','Rolling',175,'Complete',1.9),
        (1009,1,'2026-06-10','20-inch Pipe','X65','ERW',190,'Complete',2.2),
        (1010,2,'2026-06-11','Slit Coil','GR.60-2','Slitter',110,'Complete',1.0),
        (1011,3,'2026-06-12','30-inch Pipe','X65','Spiral',155,'Complete',1.7),
        (1012,4,'2026-06-13','Steel Coil','500AT-3','Rolling',160,'Complete',2.1),
        (1013,5,'2026-06-14','18-inch Pipe','X52','ERW',130,'Complete',1.2),
        (1014,6,'2026-06-15','Slit Coil','GR.52-2','Slitter',105,'Complete',0.8),
        (1015,7,'2026-06-16','42-inch Pipe','X70','Spiral',180,'Complete',2.9),
        (1016,8,'2026-06-17','Steel Coil','L485M','Rolling',145,'Complete',1.6),
        (1017,1,'2026-06-18','24-inch Pipe','X70','ERW',165,'Scheduled',0.0),
        (1018,2,'2026-06-19','Slit Coil','GR.60-2','Slitter',90,'Hold',1.4);
      INSERT INTO quality_tests VALUES
        (501,1001,'Yield Strength',512,'MPa','Pass','2026-06-03'),
        (502,1001,'Tensile Strength',625,'MPa','Pass','2026-06-03'),
        (503,1002,'Charpy Energy',98,'J','Review','2026-06-04'),
        (504,1003,'Yield Strength',475,'MPa','Pass','2026-06-05'),
        (505,1004,'Flattening',1,'Pass/Fail','Pass','2026-06-06'),
        (506,1006,'Width',1015,'mm','Pass','2026-06-08'),
        (507,1007,'Charpy Energy',112,'J','Pass','2026-06-09'),
        (508,1008,'Yield Strength',496,'MPa','Pass','2026-06-10'),
        (509,1009,'Yield Strength',503,'MPa','Review','2026-06-11'),
        (510,1009,'Tensile Strength',612,'MPa','Pass','2026-06-11'),
        (511,1010,'Width',1008,'mm','Pass','2026-06-12'),
        (512,1011,'Charpy Energy',87,'J','Review','2026-06-13'),
        (513,1012,'Yield Strength',523,'MPa','Pass','2026-06-14'),
        (514,1013,'Flattening',1,'Pass/Fail','Pass','2026-06-15'),
        (515,1014,'Width',1004,'mm','Pass','2026-06-16'),
        (516,1015,'Charpy Energy',119,'J','Pass','2026-06-17'),
        (517,1016,'Yield Strength',488,'MPa','Review','2026-06-18'),
        (518,1002,'Tensile Strength',605,'MPa','Pass','2026-06-04'),
        (519,1004,'Yield Strength',462,'MPa','Pass','2026-06-06'),
        (520,1007,'Yield Strength',507,'MPa','Pass','2026-06-09');
    `);
    dbReady = true;
    document.getElementById("db-status").textContent = "SQLite engine ready — 3 tables, 46 records";
    document.getElementById("db-status-dot").classList.add("ready");
    runQuery(false);
  }

  function showMessage(type, title, body, correction) {
    var correctionHtml = correction ? "<pre>" + escapeHtml(correction) + "</pre>" : "";
    feedback.innerHTML = '<div class="message ' + type + '"><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(body) + '</p>' + correctionHtml + '</div>';
  }

  function normalizeQuery(query) {
    return query.replace(/--.*$/gm, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\s+/g, " ").trim();
  }

  function queryGuard(query) {
    var normalized = normalizeQuery(query);
    if (!normalized) return { title: "The editor is empty", body: "Write a SELECT query or load an example before running the lab." };
    if (/[“”‘’]/.test(query)) return { title: "Smart quotation marks detected", body: "SQL requires straight quotation marks. Replace curly quotes with ' or \".", correction: query.replace(/[‘’]/g, "'").replace(/[“”]/g, '"') };
    if (!/^(SELECT|WITH|PRAGMA\s+table_info)/i.test(normalized)) return { title: "Only read-only queries are allowed", body: "This learning lab accepts SELECT and WITH queries. INSERT, UPDATE, DELETE, DROP, and ALTER are disabled to protect the practice database." };
    if (/^SELECT\b/i.test(normalized) && !/\bFROM\b/i.test(normalized) && /\b(order_id|product|grade|line|quantity|status|customer_name|test_type)\b/i.test(normalized)) return { title: "FROM clause is missing", body: "You selected database columns, but SQL has not been told which table contains them.", correction: "SELECT order_id, product\nFROM production_orders;" };
    if (/\b(TOP)\s+\d+/i.test(normalized)) return { title: "TOP is SQL Server syntax", body: "This browser lab uses SQLite. Move the row limit to the end of the query with LIMIT.", correction: "SELECT product, quantity\nFROM production_orders\nORDER BY quantity DESC\nLIMIT 5;" };
    var positions = ["SELECT", "FROM", "JOIN", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"].map(function (clause) {
      var re = new RegExp("\\b" + clause.replace(" ", "\\s+") + "\\b", "i");
      var match = normalized.match(re);
      return { clause: clause, index: match ? match.index : -1 };
    });
    var selected = positions.filter(function (p) { return p.index >= 0 && p.clause !== "JOIN"; });
    for (var i = 1; i < selected.length; i++) {
      if (selected[i].index < selected[i - 1].index) {
        return { title: "The clauses are out of order", body: selected[i].clause + " appears before " + selected[i - 1].clause + ". Use SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, then LIMIT.", correction: "SELECT …\nFROM …\nWHERE …\nGROUP BY …\nHAVING …\nORDER BY …\nLIMIT …;" };
      }
    }
    if (/\bWHERE\b[\s\S]*\b(SUM|COUNT|AVG|MIN|MAX)\s*\(/i.test(normalized)) return { title: "Aggregate condition placed in WHERE", body: "WHERE filters rows before groups exist. Move a condition based on SUM, COUNT, AVG, MIN, or MAX to HAVING." };
    if (/\bLIMIT\s*(;|$)/i.test(normalized)) return { title: "LIMIT needs a number", body: "State how many rows to return, for example LIMIT 5." };
    return null;
  }

  function coachError(error, query) {
    var message = String(error && error.message ? error.message : error);
    var lower = message.toLowerCase();
    var tableMatch = message.match(/no such table:\s*([^\s]+)/i);
    var columnMatch = message.match(/no such column:\s*([^\s]+)/i);
    if (tableMatch) return { title: "Table not found", body: "The database cannot find " + tableMatch[1] + ". Check the schema panel for the exact table name.", correction: "Available tables: production_orders, quality_tests, customers" };
    if (columnMatch) {
      var token = columnMatch[1].replace(/[;,.]$/, "");
      if (/complete|pass|review|hold|scheduled/i.test(token)) return { title: "Text value may be missing quotation marks", body: token + " was interpreted as a column name. Enclose text values in straight single quotation marks.", correction: "WHERE status = 'Complete'" };
      return { title: "Column not found", body: "The database cannot find " + token + ". Check spelling and confirm that the column belongs to the table in FROM or JOIN.", correction: "Open the schema panel and copy the exact column name." };
    }
    if (lower.indexOf("ambiguous column name") >= 0) return { title: "Ambiguous column name", body: "More than one joined table contains that column. Prefix it with the table alias, such as p.order_id or q.order_id." };
    if (lower.indexOf("misuse of aggregate") >= 0) return { title: "Aggregate used in the wrong clause", body: "Aggregate functions are calculated after row filtering. Use HAVING for conditions based on SUM, COUNT, AVG, MIN, or MAX." };
    if (lower.indexOf("incomplete input") >= 0) return { title: "The query is incomplete", body: "A clause, value, closing parenthesis, or expression is missing. Review the final line and any open parentheses." };
    if (lower.indexOf("unrecognized token") >= 0) return { title: "Unrecognized character or quotation mark", body: "Check for curly quotes, an unmatched quote, or a symbol copied from formatted text." };
    if (lower.indexOf("near \"where\"") >= 0 || lower.indexOf("near \"from\"") >= 0 || lower.indexOf("near \"group\"") >= 0 || lower.indexOf("near \"order\"") >= 0) return { title: "Syntax problem near a clause", body: "The clause may be out of order, a comma may be missing, or the previous expression may be incomplete. Compare your query with SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY → LIMIT." };
    if (lower.indexOf("syntax error") >= 0) return { title: "SQL syntax error", body: "SQLite could not interpret part of the statement. Check commas, quotation marks, parentheses, clause order, and spelling. Original message: " + message };
    return { title: "The query could not run", body: message + ". Review the schema and change one part of the query at a time." };
  }

  function resultFromQuery(query) {
    var sets = db.exec(query);
    if (!sets.length) return { columns: [], values: [] };
    return sets[sets.length - 1];
  }

  function renderResult(result) {
    var columns = result.columns || [];
    var values = result.values || [];
    rowCount.textContent = values.length + (values.length === 1 ? " row" : " rows");
    if (!columns.length) {
      resultsScroll.innerHTML = '<div class="empty-results">Query completed, but it did not return a result set.</div>';
      return;
    }
    var html = '<table class="results-table"><thead><tr>' + columns.map(function (c) { return "<th>" + escapeHtml(c) + "</th>"; }).join("") + '</tr></thead><tbody>';
    html += values.map(function (row) { return "<tr>" + row.map(function (cell) { return "<td>" + escapeHtml(cell) + "</td>"; }).join("") + "</tr>"; }).join("");
    html += "</tbody></table>";
    resultsScroll.innerHTML = html;
  }

  function canonical(result, ordered) {
    var rows = (result.values || []).map(function (r) { return r.map(function (v) { return v == null ? null : v; }); });
    if (!ordered) rows.sort(function (a, b) { return JSON.stringify(a).localeCompare(JSON.stringify(b)); });
    return JSON.stringify({ columns: (result.columns || []).map(function (c) { return c.toLowerCase(); }), rows: rows });
  }

  function evaluateChallenge(result) {
    var challenge = challenges[parseInt(challengeSelect.value, 10) - 1];
    if (!challenge) return;
    try {
      var expected = resultFromQuery(challenge.solution);
      var ordered = /ORDER\s+BY/i.test(challenge.solution);
      if (canonical(result, ordered) === canonical(expected, ordered)) {
        completedChallenges.add(challenge.id);
        localStorage.setItem("uss-sql-challenges", JSON.stringify(Array.from(completedChallenges)));
        updateChallengeProgress();
        showMessage("success", "Correct result", "Your query answers Challenge " + challenge.id + " correctly. Try changing the query to explore the data, or move to the next challenge.");
      } else {
        showMessage("warn", "The query ran, but the result does not match the task", "Compare the requested columns, filters, grouping, sort order, and row limit with the challenge instructions. Use the hint if you are stuck.");
      }
    } catch (e) {
      showMessage("warn", "The query ran", "The result is valid, but the challenge checker could not compare it. Continue exploring the output.");
    }
  }

  function runQuery(fromUser) {
    if (!dbReady) { showMessage("warn", "SQL engine is still loading", "Wait a moment, then run the query again."); return; }
    var query = editor.value;
    var guard = queryGuard(query);
    if (guard) {
      showMessage("error", guard.title, guard.body, guard.correction);
      rowCount.textContent = "Query not run";
      return;
    }
    try {
      var started = performance.now();
      var result = resultFromQuery(query);
      renderResult(result);
      evaluateChallenge(result);
      if (!fromUser && !feedback.querySelector(".message.success")) showMessage("success", "Query ran successfully", "Returned " + result.values.length + " rows in " + Math.max(1, Math.round(performance.now() - started)) + " ms.");
    } catch (error) {
      var coached = coachToggle.checked ? coachError(error, query) : { title: "SQLite error", body: String(error.message || error) };
      showMessage("error", coached.title, coached.body, coached.correction);
      rowCount.textContent = "Query failed";
    }
  }

  function setEditor(query, scrollToLab) {
    editor.value = query;
    currentStarter = query;
    updateEditorPosition();
    if (scrollToLab) document.getElementById("sql-lab").scrollIntoView({ behavior: "smooth", block: "start" });
    if (dbReady) runQuery(false);
    editor.focus();
  }

  function populateChallenges() {
    challengeSelect.innerHTML = challenges.map(function (c) { return '<option value="' + c.id + '">' + c.id + '. ' + escapeHtml(c.title) + '</option>'; }).join("");
    var cards = document.getElementById("challenge-cards");
    cards.innerHTML = challenges.map(function (c) {
      return '<article class="challenge-card"><span class="challenge-number">Challenge ' + c.id + ' · ' + escapeHtml(c.level) + '</span><h3>' + escapeHtml(c.title) + '</h3><p>' + escapeHtml(c.task) + '</p><button class="button secondary small" type="button" data-open-challenge="' + c.id + '">Open in lab</button></article>';
    }).join("");
    selectChallenge(1, false);
  }

  function selectChallenge(id, scroll) {
    var challenge = challenges[id - 1];
    if (!challenge) return;
    challengeSelect.value = String(id);
    challengeBrief.innerHTML = '<strong>' + escapeHtml(challenge.level) + '</strong><p>' + escapeHtml(challenge.task) + '</p>';
    setEditor(challenge.starter, !!scroll);
    updateChallengeProgress();
  }

  function updateChallengeProgress() {
    challengeProgress.textContent = completedChallenges.size + " of " + challenges.length + " challenges completed";
    Array.prototype.forEach.call(document.querySelectorAll("[data-open-challenge]"), function (btn) {
      var done = completedChallenges.has(parseInt(btn.getAttribute("data-open-challenge"), 10));
      btn.textContent = done ? "Completed — open again" : "Open in lab";
    });
  }

  function formatSql(query) {
    var text = normalizeQuery(query);
    var clauses = ["SELECT", "FROM", "LEFT JOIN", "INNER JOIN", "JOIN", "WHERE", "GROUP BY", "HAVING", "ORDER BY", "LIMIT"];
    clauses.forEach(function (clause) {
      var re = new RegExp("\\s+" + clause.replace(" ", "\\s+") + "\\s+", "ig");
      text = text.replace(re, "\n" + clause + " ");
    });
    return text.replace(/\s*;?$/, ";");
  }

  function updateEditorPosition() {
    var before = editor.value.slice(0, editor.selectionStart);
    var lines = before.split("\n");
    document.getElementById("editor-position").textContent = "Line " + lines.length + ", column " + (lines[lines.length - 1].length + 1);
  }

  document.addEventListener("click", function (event) {
    var exampleBtn = event.target.closest(".load-example");
    if (exampleBtn) setEditor(examples[exampleBtn.getAttribute("data-example")], true);
    var challengeBtn = event.target.closest("[data-open-challenge]");
    if (challengeBtn) selectChallenge(parseInt(challengeBtn.getAttribute("data-open-challenge"), 10), true);
  });

  challengeSelect.addEventListener("change", function () { selectChallenge(parseInt(challengeSelect.value, 10), false); });
  document.getElementById("run-query").addEventListener("click", function () { runQuery(true); });
  document.getElementById("reset-query").addEventListener("click", function () { setEditor(currentStarter || challenges[0].starter, false); });
  document.getElementById("hint-query").addEventListener("click", function () {
    var c = challenges[parseInt(challengeSelect.value, 10) - 1];
    showMessage("warn", "Hint for Challenge " + c.id, c.hint);
  });
  document.getElementById("solution-query").addEventListener("click", function () {
    var c = challenges[parseInt(challengeSelect.value, 10) - 1];
    setEditor(c.solution, false);
    showMessage("warn", "Solution loaded", "Run and study the query, then reset the challenge and rebuild it without looking.");
  });
  document.getElementById("format-query").addEventListener("click", function () { editor.value = formatSql(editor.value); updateEditorPosition(); if (liveToggle.checked) runQuery(false); });

  editor.addEventListener("keydown", function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); runQuery(true); }
  });
  editor.addEventListener("input", function () {
    updateEditorPosition();
    clearTimeout(liveTimer);
    if (liveToggle.checked) liveTimer = setTimeout(function () { runQuery(false); }, 700);
  });
  editor.addEventListener("click", updateEditorPosition);
  editor.addEventListener("keyup", updateEditorPosition);

  function checkQuiz() {
    var questions = Array.prototype.slice.call(document.querySelectorAll(".quiz-q"));
    var score = 0;
    questions.forEach(function (question) {
      var answer = question.getAttribute("data-answer");
      var selected = question.querySelector("input:checked");
      var feedbackEl = question.querySelector(".quiz-feedback");
      Array.prototype.forEach.call(question.querySelectorAll(".quiz-option"), function (label) { label.classList.remove("correct", "incorrect"); });
      if (selected && selected.value === answer) {
        score += 1;
        selected.closest(".quiz-option").classList.add("correct");
        feedbackEl.textContent = "Correct. " + question.getAttribute("data-explanation");
      } else {
        if (selected) selected.closest(".quiz-option").classList.add("incorrect");
        var correct = question.querySelector('input[value="' + answer + '"]');
        if (correct) correct.closest(".quiz-option").classList.add("correct");
        feedbackEl.textContent = "Review: " + question.getAttribute("data-explanation");
      }
      feedbackEl.hidden = false;
    });
    document.getElementById("quiz-score").textContent = "Your score: " + score + " out of " + questions.length + ".";
    document.dispatchEvent(new CustomEvent("upskill-quiz-result", { detail: { score: score, total: questions.length } }));
  }

  document.getElementById("check-quiz-button").addEventListener("click", checkQuiz);
  document.getElementById("retry-quiz-button").addEventListener("click", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".quiz-q"), function (q) {
      Array.prototype.forEach.call(q.querySelectorAll("input"), function (input) { input.checked = false; });
      Array.prototype.forEach.call(q.querySelectorAll(".quiz-option"), function (label) { label.classList.remove("correct", "incorrect"); });
      q.querySelector(".quiz-feedback").hidden = true;
    });
    document.getElementById("quiz-score").textContent = "Your score: 0 out of 10.";
  });

  populateChallenges();
  loadSqlJs(0).then(initializeDatabase).catch(function () {
    document.getElementById("db-status").textContent = "SQL engine unavailable";
    showMessage("error", "The SQL engine could not load", "Check your internet connection or content-blocking settings, then reload the page. The lesson text and quiz remain available.");
  });
}());
