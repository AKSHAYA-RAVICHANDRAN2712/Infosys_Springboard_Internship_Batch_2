require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const { pool } = require('./db');
const patientsRouter = require('./routes/patients');
const outcomesRouter = require('./routes/outcomes');
const collaborationsRouter = require('./routes/collaborations');
const guidanceRouter = require('./routes/guidance');

const app = express();

// If the frontend has been built and copied into ./public (see the
// root README's "single link" instructions: `npm run build` in
// medisphere-m4-frontend, then copy its dist/ here), this backend
// serves it directly -- so the whole app runs as one process on one
// link: http://localhost:<PORT>. If ./public doesn't exist, this
// server just runs as an API only (the normal two-terminal dev setup).
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SERVE_FRONTEND = fs.existsSync(path.join(PUBLIC_DIR, 'index.html'));

const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5177')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());

if (!SERVE_FRONTEND) {
  app.get('/', (req, res) => {
    res.json({ message: 'MediSphere Milestone 4 API is running (frontend not built into ./public yet)' });
  });
}

app.get(
  '/api/health',
  async (req, res) => {
    try {
      await pool.query('SELECT 1;');
      res.json({ status: 'ok', database: 'connected' });
    } catch (err) {
      res.status(503).json({ status: 'error', database: 'unreachable', message: err.message });
    }
  }
);

app.use('/api/patients', patientsRouter);
app.use('/api', outcomesRouter); // /api/outcome-metrics, /api/outcomes*
app.use('/api/collaborations', collaborationsRouter);
app.use('/api', guidanceRouter); // /api/guidance*, /api/compliance*

// 404 for anything else under /api
app.use('/api', (req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.originalUrl}` });
});

if (SERVE_FRONTEND) {
  app.use(express.static(PUBLIC_DIR));
  // SPA fallback: any non-API GET request returns index.html so
  // react-router can handle the route client-side.
  app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
  });
}

// Central error handler -- every route uses asyncHandler so errors land here.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
  res.status(status).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`MediSphere Milestone 4 API listening on http://localhost:${PORT}`);
});
