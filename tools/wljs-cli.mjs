#!/usr/bin/env node
// wljs: a small command-line client for the local WLJS Notebook HTTP API (127.0.0.1 only).
// It lets an AI agent, or a person, evaluate Wolfram Language and edit notebooks in a running WLJS server
// without an MCP connection. Endpoints and fields mirror WLJS's own wljs-api module (Frontend.wl).
//
// Usage: wljs <command> [args]   (run `wljs help`)
// Environment: WLJS_API (default http://127.0.0.1:20560)
import { readFileSync } from 'node:fs';

const BASE = process.env.WLJS_API || 'http://127.0.0.1:20560';
if (!/^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(BASE)) {
  console.error(`Refusing non-local WLJS_API ${BASE}: this client only talks to a server on this computer.`);
  process.exit(2);
}

const HELP = `wljs: drive a local WLJS Notebook server (${BASE})

  status                              server ready?, kernels, open notebooks
  eval [opts] <code | -f file>        evaluate in a WLJS kernel (no notebook needed)
       --time <s>  --max <chars>  --kernel <id>  --dir <path>  --summarize
  docs <query> [--lines n]            search WLJS's bundled documentation
  nb list | nb focused                notebooks the server knows about
  nb new [--with-cell]                create a quick notebook; prints its id and the URL to open it
  nb url <path.wln>                   URL that opens an existing .wln file in WLJS
  cells list <notebook-id>
  cells read <cell-id> [--max n]
  cells add <notebook-id> [--type Input] [--display codemirror] [--after id|--before id] [--hidden] <content | -f file>
  cells eval <cell-id> [--time <s>] [--max n]
  cells delete <cell-id>
  call <api-path> [json]              raw call, e.g. call notebook/list/ '{}'

Cell types and displays follow WLJS: an Input cell whose first line is .md, .html, .js, .slide, .wlx or
.mermaid becomes that kind of cell. Notebooks must be open in a window (browser or app) before cell commands work.`;

async function post(path, body = {}) {
  const url = new URL('/api/' + path.replace(/^\/?(api\/)?/, ''), BASE);
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8', accept: 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  });
  const text = await r.text();
  let data; try { data = JSON.parse(text); } catch { data = text; }
  if (!r.ok) throw new Error(`HTTP ${r.status} from ${url.pathname}: ${typeof data === 'string' ? data : JSON.stringify(data)}`);
  return data;
}

// Long operations return {"Promise": id}; poll /api/promise/ until it is ready.
async function call(path, body = {}, timeoutMs = 120000) {
  const first = await post(path, body);
  if (!(first && typeof first === 'object' && typeof first.Promise === 'string' && Object.keys(first).length === 1)) return first;
  const t0 = Date.now();
  for (let wait = 50; Date.now() - t0 < timeoutMs; wait = Math.min(wait * 1.5, 500)) {
    const s = await post('promise/', { Promise: first.Promise });
    if (s && s.ReadyQ) return s.Result;
    await new Promise((res) => setTimeout(res, wait));
  }
  throw new Error(`Timed out after ${timeoutMs} ms waiting for ${path}`);
}

function parse(argv, flags) {
  const opts = {}, rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-f') { opts.file = argv[++i]; continue; }
    if (a.startsWith('--')) {
      const k = a.slice(2);
      if (flags.bool?.includes(k)) opts[k] = true; else opts[k] = argv[++i];
      continue;
    }
    rest.push(a);
  }
  return { opts, rest };
}
const content = (o, rest) => (o.file ? readFileSync(o.file, 'utf8') : rest.join(' '));
const out = (x) => console.log(typeof x === 'string' ? x : JSON.stringify(x, null, 2));
const need = (v, what) => { if (!v) { console.error(`Missing ${what}. Run: wljs help`); process.exit(2); } return v; };
const num = (v) => (v === undefined ? undefined : Number(v));
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined));

const [cmd, sub, ...args] = process.argv.slice(2);
try {
  switch (cmd) {
    case undefined: case 'help': case '--help': out(HELP); break;
    case 'status': {
      const [ready, kernels, nbs] = await Promise.all([post('ready/'), post('kernel/list/'), post('notebook/list/')]);
      out({ server: BASE, ready: !!ready?.ReadyQ, kernels, notebooks: nbs });
      break;
    }
    case 'eval': {
      const { opts, rest } = parse([sub, ...args].filter((x) => x !== undefined), { bool: ['summarize'] });
      const time = num(opts.time) ?? 20;
      out(await call('kernel/evaluate/', clean({
        Expression: need(content(opts, rest), 'code'), TimeLimit: time, MaxCharacters: num(opts.max),
        Kernel: opts.kernel, Directory: opts.dir, Summarize: opts.summarize || undefined,
      }), (time + 30) * 1000));
      break;
    }
    case 'docs': {
      const { opts, rest } = parse([sub, ...args].filter((x) => x !== undefined), {});
      out(await call('docs/find/', clean({ Query: need(rest.join(' '), 'query'), LinesCount: num(opts.lines) })));
      break;
    }
    case 'nb': {
      const { opts, rest } = parse(args, { bool: ['with-cell'] });
      if (sub === 'list') out(await post('notebook/list/'));
      else if (sub === 'focused') out(await post('notebook/focused/'));
      else if (sub === 'new') {
        const r = await post('notebook/new/', { NoCells: !opts['with-cell'] });
        out({ ...r, openUrl: `${BASE}/${r.PathEncoded}` });
      } else if (sub === 'url') out(`${BASE}/${encodeURIComponent(need(rest[0], 'path'))}`);
      else need(null, 'nb subcommand');
      break;
    }
    case 'cells': {
      const { opts, rest } = parse(args, { bool: ['hidden'] });
      if (sub === 'list') out(await call('notebook/cells/list/', { Notebook: need(rest[0], 'notebook id') }));
      else if (sub === 'read') out(await call('notebook/cells/readcontent/', clean({ Cell: need(rest[0], 'cell id'), MaxCharacters: num(opts.max) })));
      else if (sub === 'add') {
        const [nbId, ...body] = rest;
        out(await call('notebook/cells/add/', clean({
          Notebook: need(nbId, 'notebook id'), Content: content(opts, body), Type: opts.type, Display: opts.display,
          After: opts.after, Before: opts.before, Hidden: opts.hidden || undefined,
        })));
      } else if (sub === 'eval') {
        const time = num(opts.time) ?? 20;
        out(await call('notebook/cells/evaluate/', clean({ Cell: need(rest[0], 'cell id'), TimeLimit: time, MaxCharacters: num(opts.max) }), (time + 30) * 1000));
      } else if (sub === 'delete') out(await call('notebook/cells/delete/', { Cell: need(rest[0], 'cell id') }));
      else need(null, 'cells subcommand');
      break;
    }
    case 'call': out(await call(need(sub, 'api path'), args[0] ? JSON.parse(args[0]) : {})); break;
    default: console.error(`Unknown command ${cmd}. Run: wljs help`); process.exit(2);
  }
} catch (e) {
  const down = e.cause?.code === 'ECONNREFUSED';
  console.error(down ? `WLJS is not running at ${BASE}. Start it: wljs-server start` : `Error: ${e.message}`);
  process.exit(1);
}
