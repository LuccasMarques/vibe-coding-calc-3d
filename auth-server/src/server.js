const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { verifyPassword, parseAuthConfig, buildSessionUser } = require('./auth-core');

const app = express();
const port = Number(process.env.PORT) || 8787;
const frontendOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:8000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);
const sessionSecret = process.env.SESSION_SECRET || 'dev-secret-change-me';
const cookieSecure = String(process.env.COOKIE_SECURE || 'true') === 'true';
const cookieSameSite = process.env.COOKIE_SAMESITE || 'none';
const authConfig = parseAuthConfig(process.env);

app.use(cors({
  origin(origin, callback) {
    if(!origin || frontendOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin não autorizado'));
  },
  credentials: true,
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: cookieSecure,
    sameSite: cookieSameSite,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.get('/api/session', (req, res) => {
  if(req.session.user) return res.json({ authenticated: true, user: req.session.user });
  return res.status(401).json({ authenticated: false });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const inputUser = String(username || '').trim();
  const inputPassword = String(password || '');
  if(!authConfig.username || !authConfig.passwordHash) {
    return res.status(500).send('Autenticação não configurada.');
  }
  if(inputUser !== authConfig.username) {
    return res.status(401).send('Credenciais inválidas.');
  }
  if(!verifyPassword(inputPassword, authConfig.passwordHash)) {
    return res.status(401).send('Credenciais inválidas.');
  }

  req.session.user = buildSessionUser(authConfig.username, authConfig.displayName);
  const requestOrigin = req.headers.origin && frontendOrigins.includes(req.headers.origin) ? req.headers.origin : null;
  const targetOrigin = requestOrigin || frontendOrigins[0] || 'http://localhost:8000';
  res.json({ ok: true, redirect: targetOrigin });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid', { path: '/' });
    res.json({ ok: true });
  });
});

app.listen(port, () => {
  console.log(`Auth server on http://localhost:${port}`);
});
