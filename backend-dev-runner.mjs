import { spawn } from 'node:child_process';

const services = [
  {
    name: 'traffic',
    cmd: ['npx', ['nx', 'serve', 'td-traffic-service']],
    env: { NODE_OPTIONS: '--inspect=9229' },
  },
  {
    name: 'rest',
    cmd: ['npx', ['nx', 'serve', 'td-rest-gateway']],
    env: { NODE_OPTIONS: '--inspect=9230' },
  },
  {
    name: 'socket',
    cmd: ['npx', ['nx', 'serve', 'td-socket-gateway']],
    env: { NODE_OPTIONS: '--inspect=9231' },
  },
];

const state = new Map(); // name -> { child, restarts, firstAt, timer }
let shuttingDown = false;

function prefixStream(name, stream, write) {
  let buf = '';
  stream.setEncoding('utf8');
  stream.on('data', (chunk) => {
    buf += chunk;
    let idx;
    while ((idx = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, idx + 1);
      buf = buf.slice(idx + 1);
      write(`[${name}] ${line}`);
    }
  });
  stream.on('end', () => {
    if (buf) write(`[${name}] ${buf}\n`);
  });
}

function killTree(child, signal = 'SIGTERM') {
  if (!child || child.killed) return;
  try {
    // Works on macOS/Linux when spawned with detached: true
    process.kill(-child.pid, signal);
  } catch {
    try {
      child.kill(signal);
    } catch {}
  }
}

function backoffMs(attempt) {
  // exponential backoff: 250ms, 500ms, 1s, 2s, ... capped at 10s + jitter
  const base = Math.min(10_000, 250 * Math.pow(2, Math.max(0, attempt - 1)));
  const jitter = Math.floor(Math.random() * 250);
  return base + jitter;
}

function canRestart(meta) {
  // basic “too many restarts” guard: 20 restarts in 60s => stop trying
  const WINDOW_MS = 60_000;
  const MAX = 20;

  const now = Date.now();
  if (!meta.firstAt || now - meta.firstAt > WINDOW_MS) {
    meta.firstAt = now;
    meta.restarts = 0;
  }
  meta.restarts++;
  return meta.restarts <= MAX;
}

function startService(service) {
  const {
    name,
    cmd: [bin, args],
    env: serviceEnv,
  } = service;

  const meta = state.get(name) ?? { child: null, restarts: 0, firstAt: 0, timer: null };
  state.set(name, meta);

  if (meta.timer) clearTimeout(meta.timer);

  const child = spawn(bin, args, {
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
    detached: true,
    env: {
      ...process.env,
      ...(serviceEnv ?? {}),
    },
  });

  meta.child = child;

  prefixStream(name, child.stdout, (s) => process.stdout.write(s));
  prefixStream(name, child.stderr, (s) => process.stderr.write(s));

  child.on('error', (err) => {
    process.stderr.write(`[${name}] failed to start: ${err.message}\n`);
    scheduleRestart(service, meta);
  });

  child.on('exit', (code, signal) => {
    meta.child = null;

    if (shuttingDown) return;

    process.stderr.write(
      `[${name}] exited (code=${code ?? 'null'}, signal=${signal ?? 'null'})\n`
    );
    scheduleRestart(service, meta);
  });
}

function scheduleRestart(service, meta) {
  if (shuttingDown) return;

  if (!canRestart(meta)) {
    process.stderr.write(
      `[${service.name}] restarting too frequently; giving up. Stop the runner and fix the crash.\n`
    );
    // If you prefer to keep the runner alive even if one service gives up,
    // remove the next line.
    process.exitCode = 1;
    return;
  }

  const delay = backoffMs(meta.restarts);
  process.stderr.write(`[${service.name}] restarting in ${delay}ms (attempt ${meta.restarts})\n`);
  meta.timer = setTimeout(() => startService(service), delay);
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const meta of state.values()) {
    if (meta.timer) clearTimeout(meta.timer);
    if (meta.child) killTree(meta.child, 'SIGTERM');
  }

  setTimeout(() => {
    for (const meta of state.values()) {
      if (meta.child) killTree(meta.child, 'SIGKILL');
    }
  }, 5000).unref();

  process.exitCode = code;
}

// start all
for (const s of services) startService(s);

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
