# Diário pessoal privado

Aplicação estática em `/diariopessoal` para o GitHub Pages, com login Google via Supabase OAuth e vídeos em Storage privado.

## Ativação

1. No Supabase Auth, habilite o provedor **Google**. No Google Cloud Console, crie um OAuth Client Web e cadastre como callback a URL exibida pelo Supabase em `Authentication > Providers > Google` (normalmente `https://SEU_PROJETO.supabase.co/auth/v1/callback`). Informe Client ID e Client Secret no provedor Google do Supabase.
2. No Supabase, desative o cadastro público. O primeiro login Google criará a sessão; apenas `srklehn@gmail.com` e `yanfili.simon@gmail.com` são aceitos pela aplicação e pelas políticas RLS.
3. Abra o SQL Editor e execute [`schema.sql`](./schema.sql).
4. Copie `config.example.js` para `config.js` e preencha `url` e `anonKey`. A chave deve ser somente a chave pública `anon`; nunca use `service_role`.
5. No Supabase Auth, configure:
   - Site URL: `https://akashahub.com.br/diariopessoal/`
   - Redirect URL: `https://akashahub.com.br/diariopessoal/**`
6. Ative MFA/TOTP manualmente nas configurações da conta Supabase.
7. Faça commit de `config.js` apenas se ele contiver dados públicos do frontend; não salve chaves secretas.

A tela também oferece uma senha extra local opcional. Ela não substitui o Supabase Auth nem as políticas RLS.
