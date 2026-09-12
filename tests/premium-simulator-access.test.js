const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = name => fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
function gate(rpc) {
  const classes = new Set();
  const redirects = [];
  const timers = [];
  let change;
  const body = {
    getAttribute: key => ({'data-access-resource':'exam:/test-bank','data-required-access':'premium'})[key],
    classList: {add: key => classes.add(key), remove: key => classes.delete(key)}
  };
  vm.runInNewContext(read('access-control.js'), {
    document: {body, readyState:'complete'},
    window: {
      location: {pathname:'/test-bank.html',search:'',replace: url => redirects.push(url)},
      setTimeout: fn => (timers.push(fn), timers.length), clearTimeout: () => {},
      UpskillAuth: {isConfigured: () => true, onChange: fn => {change = fn;}, getClient: () => ({rpc})}
    }
  });
  return {classes, redirects, timers, change: user => change(user)};
}
const flush = () => new Promise(resolve => setImmediate(resolve));
test('simulator and directory declare Premium minimum', () => {
  assert.match(read('test-bank.html'), /<body[^>]*data-required-access="premium"[^>]*data-access-resource="exam:\/test-bank"/);
  assert.match(read('lessons.html'), /Premium and higher/);
  assert.match(read('supabase/premium-simulator-access.sql'), /'exam:\/test-bank', 'premium'/);
});
test('signed-out users go to sign in; lower tiers are denied', async () => {
  const g = gate(() => Promise.resolve({data:false}));
  g.change(null);
  assert.match(g.redirects[0], /sign-in.html\?next=/);
  const h = gate(() => Promise.resolve({data:false}));
  h.change({id:'registered'}); await flush();
  assert.match(h.redirects[0], /access=premium/);
  assert.equal(h.classes.has('auth-ready'), false);
});
test('server authorization reveals content and sign-out locks it again', async () => {
  const g = gate((name, args) => {
    assert.equal(name, 'can_access_content');
    assert.equal(args.requested_resource_key, 'exam:/test-bank');
    return Promise.resolve({data:true});
  });
  g.change({id:'premium'}); await flush();
  assert.equal(g.classes.has('auth-ready'), true);
  g.change(null);
  assert.equal(g.classes.has('auth-ready'), false);
});
test('RPC errors and hanging requests fail closed; stale replies cannot unlock', async () => {
  const g = gate(() => Promise.reject(new Error('offline')));
  g.change({id:'premium'}); await flush();
  assert.match(g.redirects[0], /access=unavailable/);
  let finish;
  const h = gate(() => new Promise(resolve => {finish = resolve;}));
  h.change({id:'premium'}); await flush();
  h.timers[0](); finish({data:true}); await flush();
  assert.equal(h.classes.has('auth-ready'), false);
  assert.match(h.redirects[0], /access=unavailable/);
});
