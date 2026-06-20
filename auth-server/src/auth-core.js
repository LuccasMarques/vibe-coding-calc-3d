const crypto = require('crypto');

const HASH_PREFIX = 'scrypt';
const SCRYPT_OPTIONS = Object.freeze({
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64,
});

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const secret = String(password ?? '');
  if(!secret) throw new Error('Password ausente.');
  const derived = crypto.scryptSync(secret, salt, SCRYPT_OPTIONS.keylen, {
    N: SCRYPT_OPTIONS.N,
    r: SCRYPT_OPTIONS.r,
    p: SCRYPT_OPTIONS.p,
  }).toString('hex');
  return [HASH_PREFIX, SCRYPT_OPTIONS.N, SCRYPT_OPTIONS.r, SCRYPT_OPTIONS.p, salt, derived].join('$');
}

function verifyPassword(password, hashed) {
  const secret = String(password ?? '');
  if(!secret || !hashed) return false;
  const [prefix, N, r, p, salt, expected] = String(hashed).split('$');
  if(prefix !== HASH_PREFIX || !salt || !expected) return false;
  const actual = crypto.scryptSync(secret, salt, expected.length / 2, {
    N: Number(N) || SCRYPT_OPTIONS.N,
    r: Number(r) || SCRYPT_OPTIONS.r,
    p: Number(p) || SCRYPT_OPTIONS.p,
  }).toString('hex');
  const actualBuffer = Buffer.from(actual, 'hex');
  const expectedBuffer = Buffer.from(expected, 'hex');
  if(actualBuffer.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function parseAuthConfig(env = process.env) {
  return {
    username: String(env.AUTH_USERNAME || '').trim(),
    passwordHash: String(env.AUTH_PASSWORD_HASH || '').trim(),
    displayName: String(env.AUTH_DISPLAY_NAME || '').trim(),
  };
}

function buildSessionUser(username, displayName) {
  return {
    id: username,
    name: displayName || username,
    email: username.includes('@') ? username : `${username}@local`,
  };
}

module.exports = {
  hashPassword,
  verifyPassword,
  parseAuthConfig,
  buildSessionUser,
};
