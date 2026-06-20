const { hashPassword } = require('./auth-core');

const password = process.argv[2];

if(!password) {
  console.error('Uso: node src/hash-password.js "sua-senha"');
  process.exit(1);
}

console.log(hashPassword(password));
