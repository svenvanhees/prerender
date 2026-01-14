#!/usr/bin/env node
require('dotenv').config();
var prerender = require('./lib');

// var server = prerender();
//
// server.use(prerender.sendPrerenderHeader());
// server.use(prerender.browserForceRestart());
// // server.use(prerender.blockResources());
// server.use(prerender.addMetaTags());
// server.use(prerender.removeScriptTags());
// server.use(prerender.httpHeaders());
//
// server.start();


// const prerender = require("prerender");

// const server = prerender({});

const prMemoryCache = require('prerender-memory-cache');

const server = prerender({
  chromeFlags: ['--no-sandbox', '--headless', '--disable-gpu', '--hide-scrollbars', '--disable-dev-shm-usage'],
  forwardHeaders: true,
  chromeLocation: '/usr/bin/chromium-browser'
});

const memCache = Number(process.env.MEMORY_CACHE) || 0;
if (memCache === 1) {
  server.use(prMemoryCache);
}

const s3Cache = Number(process.env.S3_CACHE) || 0;
if (s3Cache === 1) {
  server.use(require('prerender-aws-s3-cache'));
}

server.use(prerender.blacklist());
server.use(prerender.httpHeaders());
server.use(prerender.removeScriptTags());

server.start();
