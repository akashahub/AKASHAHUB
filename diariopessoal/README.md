# Diário pessoal privado

Aplicação estática em `/diariopessoal` para o GitHub Pages, com autenticação Supabase e vídeos em Storage privado.

## Ativação

1. No Supabase, crie manualmente os usuários `srklehn@gmail.com` e `yanfili.simon@gmail.com`, com confirmação de e-mail. Desative o cadastro público.
2. Abra o SQL Editor e execute [`schema.sql`](./schema.sql).
3. Copie `config.example.js` para `config.js` e preencha `url` e `anonKey`. A chave deve ser somente a chave pública `anon`; nunca use `service_role`.
4. No Supabase Auth, configure:
   - Site URL: `https://akashahub.com.br/diariopessoal/`
   - Redirect URL: `https://akashahub.com.br/diariopessoal/**`
5. Ative MFA/TOTP manualmente nas configurações da conta Supabase.
6. Faça commit de `config.js` apenas se ele contiver dados públicos do frontend; não salve chaves secretas.

A tela também oferece uma senha extra local opcional. Ela não substitui o Supabase Auth nem as políticas RLS.
