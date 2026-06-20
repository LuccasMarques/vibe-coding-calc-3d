const assert = require('assert');
const auth = require('../src/auth-core');

const hashed = auth.hashPassword('senha-teste', 'sal-ts');
assert.ok(hashed.startsWith('scrypt$'));
assert.strictEqual(auth.verifyPassword('senha-teste', hashed), true);
assert.strictEqual(auth.verifyPassword('errada', hashed), false);

const config = auth.parseAuthConfig({
  AUTH_USERNAME: 'luccas',
  AUTH_PASSWORD_HASH: hashed,
  AUTH_DISPLAY_NAME: 'Luccas',
});

assert.strictEqual(config.username, 'luccas');
assert.strictEqual(config.passwordHash, hashed);

const user = auth.buildSessionUser(config.username, config.displayName);
assert.strictEqual(user.id, 'luccas');
assert.strictEqual(user.name, 'Luccas');
assert.strictEqual(user.email, 'luccas@local');

console.log('auth-core: ok');
