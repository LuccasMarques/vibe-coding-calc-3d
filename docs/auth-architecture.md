# Arquitetura de login — CALC3D

Objetivo:

proteger o acesso à precificadora com uma sessão própria do servidor, sem depender de Google ou outro provedor externo.

Fluxo ideal:

1. O usuário abre a PWA no GitHub Pages.
2. A tela mostra apenas o formulário de login.
3. O usuário informa usuário e senha.
4. O frontend envia essas credenciais ao backend por `POST`.
5. O backend valida a senha com hash seguro.
6. Se estiver tudo certo, o backend cria uma sessão própria do app.
7. A precificadora só libera a interface principal quando a sessão existir.

Por que essa arquitetura:

- não há dependência de Google Cloud ou qualquer outro provedor;
- o Pages continua estático;
- a segurança real fica no servidor;
- o frontend não guarda segredo;
- a sessão pode ser revogada no backend;
- a solução é simples para um uso privado.

Arquivos envolvidos:

- `index.html`: porta de entrada e gate de login;
- `src/js/app-state.js`: configuração da autenticação;
- `auth-server/src/server.js`: login, sessão e logout;
- `auth-server/src/auth-core.js`: hash e validação da senha;
- `auth-server/src/hash-password.js`: utilitário para gerar o hash da senha;
- `auth-server/package.json`: execução do backend;
- `auth-server/.env.example`: variáveis de ambiente.

Notas:

- o frontend deve usar `credentials: 'include'` para ler a sessão;
- o cookie de sessão deve ser `HttpOnly`;
- em produção, o backend precisa estar em HTTPS;
- para publicar, configure `FRONTEND_ORIGIN` com a URL do Pages.

Como preparar a senha:

1. escolha a senha;
2. gere o hash com:

```powershell
cd auth-server
npm run hash-password -- "sua-senha"
```

3. copie o valor gerado para `AUTH_PASSWORD_HASH` no `.env`.
