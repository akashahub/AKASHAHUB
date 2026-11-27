# Akasha Local — publicação GitHub-first

## Objetivo

Publicar demonstrações aprovadas como arquivos versionados no repositório, mantendo os endereços:

`https://akashahub.com.br/demo/<slug>/`

A publicação final não deve gravar o HTML público em `alLocalPublishedSites` nem depender do Firebase Hosting para servir os sites.

## Estado atual auditado

- Repositório: `akashahub/AKASHAHUB`, branch padrão `main`, público.
- O domínio principal contém um site estático na raiz e diversas rotas/áreas que precisam continuar funcionando.
- `CNAME` contém `akashahub.com.br`.
- `firebase.json` publica a raiz do repositório via Firebase Hosting e reescreve `/demo/**` para `/demo/index.html`.
- `.github/workflows/firebase-hosting.yml` executa deploy de produção no Firebase Hosting a cada push em `main`.
- `.github/workflows/firebase-hosting-preview.yml` executa previews do Firebase Hosting em pull requests.
- `demo/index.html` é atualmente um visualizador que consulta `alLocalPublishedSites` no Firestore.
- A fábrica em `al/local/index.html` gera HTML, mantém editor e versões e hoje publica o HTML em `alLocalPublishedSites`.
- A fábrica já possui oito modelos por segmento e personalização por lote. O limite de lote atual é 15.

## Arquitetura de destino

1. **CRM e produção continuam no Firebase.** Auth, Firestore, empresas, lotes, demonstrações, atividades e histórico continuam funcionando como hoje.
2. **Arquivos publicados ficam no GitHub.** Cada site aprovado vira um diretório próprio:
   `demo/<slug>/index.html`
   e, quando necessário, arquivos locais em `demo/<slug>/assets/`.
3. **Publicação pelo painel é autenticada no servidor.** O navegador não recebe PAT, chave privada de GitHub App nem token de instalação.
4. **Backend publicador:** endpoint autenticado valida o mentor, verifica que a demonstração está aprovada, normaliza e valida o slug, limita tamanho/arquivos e grava os arquivos pela API do GitHub. A credencial fica em secret do backend. Preferência: GitHub App com permissão mínima de Contents (write) no repositório.
5. **Histórico e reversão:** commits do GitHub versionam cada publicação. O CRM guarda slug, commit SHA, caminho, data e estado de publicação. Despublicar remove ou substitui apenas o diretório correspondente por commit; não apaga cadastro, versões nem atividades do CRM.
6. **Entrega web:** GitHub Pages pode servir os arquivos estáticos, mas o domínio personalizado está no nível do site inteiro, não somente no caminho `/demo`. Portanto, a migração de `akashahub.com.br` exige validar Pages, DNS, HTTPS e compatibilidade das rotas existentes antes da virada.

## Regras de segurança e integridade

- Nunca colocar PAT, GitHub App private key ou installation token no HTML/JavaScript do navegador, Firestore ou arquivos públicos.
- Não aceitar slug com barras, segmentos `..`, caracteres de controle ou colisões silenciosas.
- Não sobrescrever diretório de outro negócio sem confirmação e verificação do vínculo businessId/demoId.
- Publicar somente demonstração com `workflowStatus === "Aprovado"` e HTML revisado.
- Validar links, recursos externos, caminhos absolutos e referências a assets antes da publicação.
- Não remover nem migrar documentos antigos de `alLocalPublishedSites` durante a primeira fase. Eles ficam preservados para rollback/auditoria.
- Não desativar os workflows Firebase, reescritas, CNAME, DNS ou configuração de domínio antes da migração completa e de um teste de retorno.
- Manter prévias privadas e compartilhamentos existentes separados da publicação oficial.

## Plano de execução

### Fase 1 — preparação (sem impacto na produção)
- [x] Auditar os arquivos e workflows de publicação atuais.
- [x] Confirmar branch padrão, permissões do repositório e presença do arquivo CNAME.
- [x] Registrar arquitetura, riscos e critérios de corte neste documento.
- [ ] Confirmar a configuração real de GitHub Pages e DNS do domínio.
- [ ] Escolher/provisionar backend seguro para o publicador e guardar a credencial como secret.

### Fase 2 — publicador GitHub
- [ ] Criar endpoint de publicação autenticado e restrito a mentores.
- [ ] Implementar escrita/atualização de `demo/<slug>/index.html` pela API do GitHub.
- [ ] Salvar commit SHA e metadados no documento da demonstração.
- [ ] Implementar despublicação e atualização de slug com operações seguras.
- [ ] Manter compatibilidade com versões, CRM, compartilhamentos e prévias atuais.

### Fase 3 — entrega estática e migração de domínio
- [ ] Configurar Pages em ambiente de validação sem alterar o domínio principal.
- [ ] Testar páginas profundas, assets, autenticação, Firestore e demais rotas do site.
- [ ] Validar DNS, certificado HTTPS, cache e redirecionamentos.
- [ ] Planejar janela de corte e procedimento de rollback.
- [ ] Só depois da validação, migrar o domínio e retirar o deploy Firebase Hosting.

### Fase 4 — ativação
- [ ] Trocar a ação do painel para publicar via backend GitHub.
- [ ] Testar um site piloto com slug novo e conteúdo aprovado.
- [ ] Confirmar URL pública e assets em desktop/mobile.
- [ ] Testar atualização, despublicação e rollback.
- [ ] Remover o visualizador Firestore antigo e regras específicas apenas quando não houver dependência ativa.

## Critérios obrigatórios antes de produção

- GitHub Pages está configurado e publicado com sucesso.
- O domínio personalizado aponta para a hospedagem correta e HTTPS está válido.
- A home, login, dashboard, /al/local/, /afplataforma/ e demais rotas essenciais continuam operando.
- O botão da fábrica grava no GitHub somente após validação do backend.
- Nenhum segredo existe no cliente.
- Um site piloto foi publicado, atualizado, despublicado e restaurado com sucesso.
- Há rollback documentado e testado.

## Limite desta etapa

Este commit é apenas documentação de preparação em branch separada. Não altera `main`, não altera DNS, não configura Pages, não desliga Firebase Hosting e não publica sites reais.
