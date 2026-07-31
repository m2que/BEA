import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import handler from '../api/bea.ts';

const DEFAULT_PORT = 3000;

const loadLocalEnv = () => {
  const envPath = resolve(process.cwd(), '.env.local');

  if (!existsSync(envPath)) {
    return;
  }

  const fileContents = readFileSync(envPath, 'utf8');
  for (const rawLine of fileContents.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};

loadLocalEnv();

const port = Number(process.env.PORT || DEFAULT_PORT);

const sendJson = (res, statusCode, payload, extraHeaders = {}) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
};

const createHandlerResponse = (res) => ({
  setHeader(name, value) {
    res.setHeader(name, value);
  },
  status(code) {
    return {
      json(body) {
        sendJson(res, code, body);
      }
    };
  }
});

const server = createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { error: 'Missing request URL.' });
    return;
  }

  const requestUrl = new URL(req.url, `http://${req.headers.host || `localhost:${port}`}`);

  if (requestUrl.pathname !== '/api/bea') {
    sendJson(res, 404, { error: 'Not found.' });
    return;
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    });
    res.end();
    return;
  }

  let rawBody = '';

  req.on('data', (chunk) => {
    rawBody += chunk;
  });

  req.on('end', async () => {
    let parsedBody = {};

    if (rawBody) {
      try {
        parsedBody = JSON.parse(rawBody);
      } catch {
        sendJson(res, 400, { error: 'Invalid JSON body.' });
        return;
      }
    }

    try {
      await handler(
        {
          method: req.method,
          body: parsedBody
        },
        createHandlerResponse(res)
      );
    } catch (error) {
      console.error('Local API server error:', error);
      sendJson(res, 500, { error: 'Local API server failed.' });
    }
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`BEA local API listening on http://0.0.0.0:${port}`);
});
