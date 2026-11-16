# Legacy Vault · estrutura inicial

Página: `/afplataforma/legacy-vault/`

## Arquitetura
- Arquivos e mídias são hospedados no Google Drive.
- Esta página é a interface de navegação e não armazena arquivos.
- `drive-links.js` é o catálogo de pastas e links: preencher os campos `folderUrl` e `url` com links reais do Drive.
- A página só renderiza após autenticação Firebase da AF Plataforma.
- O compartilhamento efetivo dos arquivos é controlado também pelas permissões do Google Drive.

## Fases e pilares
Cada fase tem uma pasta geral e seis bibliotecas por pilar. A Biblioteca Geral tem três categorias transversais. Os botões ficam desativados visualmente até existir um link válido de `drive.google.com` ou `docs.google.com`.

## Integração na AF Plataforma
- Cada dashboard de fase inclui um botão para abrir o Legacy Vault já focado na fase correspondente.
- Cada modal de atalho da fase também inclui o acesso à biblioteca daquela fase.
- O atalho de apoio transversal abre a Biblioteca Geral.

## Segurança e próximos passos
A autenticação impede que a página seja exibida sem login, mas não substitui a proteção dos arquivos. Não usar links públicos para pastas que contenham materiais privados. Para conteúdo individual de mentorandos, criar pastas separadas e conceder acesso apenas aos usuários autorizados. Próxima evolução: painel de administração de links com persistência no Firestore e conexão OAuth/API do Google Drive, mantendo o Drive como único armazenamento dos arquivos.
