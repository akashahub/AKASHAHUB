# Akasha Hub — Cliente 360, Biblioteca e LeituraCall

**Status:** especificação consolidada para implementação incremental e íntegra.  
**Data:** 2026-11-20  
**Repositório:** `akashahub/AKASHAHUB` · branch `main`

## 1. Objetivo

Construir uma experiência conectada em que cada pessoa tenha um único perfil no Akasha Hub, reunindo compras, livros, acessos, histórico de LeituraCall, mapas mentais, permissões de ferramentas e acompanhamento. O sistema deve preservar as páginas, autenticação, regras, produtos e fluxos já existentes. Nenhuma funcionalidade existente deve ser removida ou substituída sem auditoria e validação.

## 2. Jornada de compra e entrega dos livros

1. A pessoa pode comprar sem estar autenticada no site, usando o checkout Stripe e informando seu e-mail.
2. O webhook só concede acesso após validar a assinatura Stripe e confirmar pagamento efetivamente pago. Eventos assíncronos pagos também devem ser tratados.
3. Identificar o produto por Price ID / Payment Link ID confirmado no servidor, nunca confiar em metadados enviados pelo navegador.
4. Registrar o evento de compra com ID de sessão Stripe único, produto, valor, moeda, e-mail, status de pagamento, status de entrega e vínculo de usuário quando houver.
5. Enviar automaticamente o PDF correspondente ao mesmo e-mail registrado no checkout. Preferência: PDF como anexo e também um link seguro de acesso/recuperação. Usar remetente verificado e registrar falhas para reenvio.
6. Após o checkout, encaminhar para uma página de confirmação do Akasha Hub com explicação simples: “Seu livro foi enviado para o e-mail da compra. Entre ou crie sua conta para acessar sua biblioteca.”
7. Se já houver sessão Firebase Auth, reconciliar a compra com a conta correspondente ao e-mail autenticado e abrir o livro.
8. Se não houver sessão, oferecer login/cadastro por Google e por e-mail. Após login, reconciliar compras pendentes do mesmo e-mail verificado, liberar os livros e redirecionar à biblioteca.
9. Não criar automaticamente uma conta silenciosa nem associar compras a uma conta Google de e-mail diferente. Se o e-mail do Google divergir do e-mail do checkout, oferecer fluxo explícito de confirmação/recuperação.
10. PDFs em armazenamento privado. Nunca publicar livros pagos em pasta pública do GitHub ou em URL permanente aberta. Links temporários devem ser gerados após verificar a titularidade.
11. Os quatro Payment Links atuais devem ser preservados: O Eixo, Casa Digital, Dinheiro com Critério e O Que Permanece. Pontes permanece indisponível até existir produto/arquivo/checkout aprovado.

## 3. Perfil central e administração

A página `/admin/perfis/` será a visão administrativa Cliente 360, preservando a autenticação restrita ao mentor/administrador. Cada perfil deverá reunir:

- Identidade: UID, nome, e-mail verificado, telefone e dados básicos já existentes.
- Compras: livros e outros produtos, data, valor, Stripe Session/Payment ID, status do pagamento e da entrega.
- Acessos: livros, cursos, áreas e ferramentas liberadas, origem da permissão e situação atual.
- LeituraCall: quantidade, datas, tipo de call, status e links para os registros.
- Sessão de Alinhamento: mapa mental, direcionamentos e materiais liberados ao cliente.
- Histórico de alterações e origem dos dados, evitando duplicação de perfis por e-mail.

A integração deverá respeitar o Firebase Auth/Firestore já usado pelo login e pela tela de perfis, além das tabelas de compras existentes no Supabase. Antes de definir a fonte canônica de cada dado, mapear os campos e regras atuais; não criar um segundo cadastro concorrente.

## 4. LeituraCall — central do mentor

Criar `/leituracall/registros/`, restrita ao mentor. Ela deverá permitir:

- Buscar e selecionar um cliente existente pelo perfil/e-mail; criar um registro vinculado ao UID quando disponível.
- Registrar calls gratuitas, pagas, de Leitura de Essência, Sessão de Alinhamento e outros tipos necessários.
- Salvar data, tipo, participantes, contexto informado, objetivos, necessidades, observações do mentor, direcionamentos, próximos passos e status.
- Abrir um roteiro guiado em modal, reutilizando o conteúdo já existente em `/central/funil/` e a Sessão de Alinhamento já existente na Gestão do Mentor do `/afplataforma`.
- Exibir o roteiro em etapas simples, com notas do mentor e possibilidade de salvar rascunho/concluir sem perder o que foi anotado.
- Permitir anexar/associar mapa mental e materiais da sessão.
- Exibir histórico cronológico do cliente e ligação direta para o perfil em `/admin/perfis/`.

O roteiro não deve ser copiado e mantido em versões divergentes: identificar os blocos-fonte atuais e reutilizá-los ou criar uma fonte única compartilhada, preservando os textos e a ordem existentes.

## 5. Área do cliente — `/dashboard/`

Criar navegação lateral (no desktop à direita, conforme solicitado; adaptável no celular) com módulos condicionados às permissões:

1. **Minha Biblioteca:** livros comprados, leitura/download protegido e recomendações de livros ainda não adquiridos com link de compra.
2. **Minhas Leituras:** registros de Leitura de Essência liberados para aquele cliente.
3. **Sessão de Alinhamento:** registro e mapa mental da sessão, visíveis somente ao cliente dono e ao mentor autorizado.
4. **Arquitetura de Legado / AF Plataforma:** exibir e abrir apenas quando houver permissão válida.
5. **QuiteI:** acesso ao app liberado pelo Akasha Hub, após confirmar rota e política de acesso atuais.
6. **Cashflow:** acesso ao app liberado pelo Akasha Hub, após confirmar rota e política de acesso atuais.
7. **Meu Perfil / Ajuda:** dados da conta, recuperação de compra e suporte.

Se a pessoa não tiver um livro, o card permanece visível como recomendação de compra, claramente separado dos itens liberados. Ferramentas liberadas gratuitamente devem ser identificadas como acesso aberto, sem simular compra.

## 6. Registros oficiais e cópia pessoal do cliente

- O registro original escrito pelo mentor é a **versão oficial**, preservada e não editável pelo cliente.
- O cliente pode criar/editar uma **cópia pessoal** de suas anotações.
- Um botão “Restaurar versão do mentor” deve descartar apenas a cópia pessoal e recriá-la a partir da versão oficial, após confirmação. Nunca apagar ou sobrescrever a versão oficial.
- O mapa mental oficial pode ser disponibilizado em modo de visualização/download controlado. Se o cliente puder editar uma cópia, ela deve ser separada do original.
- Acesso por UID autenticado e políticas de autorização; não basta ocultar links na interface.

## 7. Segurança, privacidade e integridade

- Cliente só lê seus próprios registros, compras e concessões.
- Somente mentor/administrador autorizado cria ou edita registros oficiais e permissões.
- Cliente não pode alterar UID, e-mail de titularidade, valor, status de pagamento, concessões ou notas oficiais.
- Verificação de webhook Stripe, idempotência por evento/sessão, tratamento de reenvios e logs sem expor dados sensíveis.
- Armazenamento privado para PDFs, mapas mentais e anexos.
- RLS/Firestore Rules alinhadas à autenticação real; nunca confiar em campos editáveis pelo usuário como prova de permissão.
- Manter backup e compatibilidade retroativa; alterações de schema aditivas sempre que possível.

## 8. Auditoria técnica inicial já realizada

- O login existente usa **Firebase Authentication**, com e-mail/senha e Google já presentes em `/login/`.
- O cadastro/login registra atividade no documento `users/{uid}` do Firestore.
- `/admin/perfis/` já existe e usa Firebase Auth/Firestore; o código visível contém restrição por UID administrador. A integração deve preservar essa proteção.
- `/leituracall/` e `/central/funil/` já existem.
- `/members/` está atualmente redirecionando para a página inicial; não é uma biblioteca funcional para compradores.
- O webhook Supabase `stripeWebhook` já valida assinatura Stripe e processa produtos antigos, mas os quatro Payment Links novos da coleção Arquitetura de Legado ainda não estão mapeados para entrega. Não declarar a entrega automática pronta até implementar e testar esse caminho.
- A tabela Supabase `store_purchase_events` já registra sessão, pagamento, e-mail, produto e status de e-mail; `purchases` também existe. Antes de alterar, inspecionar constraints, índices, políticas e usos atuais.
- Os PDFs da coleção foram fornecidos em um ZIP nesta conversa; arquivos confirmados: edição reunida, O Eixo, Casa Digital, Dinheiro com Critério e O Que Permanece. Pontes não está no pacote. Os PDFs devem ser enviados para bucket privado antes de ativar a entrega.

## 9. Sequência de implementação

### Fase A — fundação e reconciliação
1. Inventariar regras Firebase, Auth providers, coleções Firestore, estrutura completa de `/admin/perfis/`, `/dashboard/`, roteiros do funil e Gestão do Mentor.
2. Definir mapeamento canônico perfil ↔ UID ↔ e-mail verificado ↔ compras Stripe, sem duplicar clientes.
3. Auditar schema, índices, constraints e RLS das tabelas Supabase de compras e eventos.
4. Preparar bucket privado e catálogo servidor-side dos quatro livros.

### Fase B — compra e entrega
1. Atualizar o webhook com os quatro Price IDs/Payment Link IDs, pagamento confirmado, idempotência, registro de compra e envio de PDF por e-mail.
2. Criar confirmação pós-checkout, login/cadastro com retorno e reconciliação pós-login.
3. Liberar biblioteca segura no dashboard e oferecer recuperação/reenvio.
4. Testar com Stripe em modo de teste, sem gerar cobranças reais.

### Fase C — Cliente 360 e LeituraCall
1. Integrar compras e acessos à página `/admin/perfis/`.
2. Criar `/leituracall/registros/` e o modal de roteiro reutilizado.
3. Integrar os registros, tipos de call e mapas mentais ao perfil do cliente.
4. Criar permissões e cópia pessoal separada da versão oficial.

### Fase D — dashboard e ferramentas
1. Criar menu e módulos de biblioteca, leituras, sessão de alinhamento, AF Plataforma, QuiteI e Cashflow.
2. Confirmar as rotas e gates de cada ferramenta antes de expor os links.
3. Implementar recomendações de compra e estados de acesso.

### Fase E — validação e publicação
1. Rodar testes de compra paga, evento duplicado, falha de e-mail, reenvio, login Google, login por e-mail, e-mail divergente, usuário já logado e usuário sem conta.
2. Testar isolamento entre dois clientes e restrição do mentor.
3. Validar que o registro oficial não pode ser alterado pelo cliente e que “Restaurar” afeta somente a cópia pessoal.
4. Verificar páginas, links, console, regras e deploy antes de declarar concluído.

## 10. Critério de conclusão

Só considerar concluído quando um pagamento de teste gerar registro único no perfil certo, enviar o PDF para o e-mail do checkout, liberar o livro à conta autenticada correta, mostrar o histórico no painel do mentor e no dashboard do cliente, e impedir que outro cliente acesse esses dados. O sistema deve passar pelos testes de segurança e regressão sem quebrar fluxos existentes.


## 11. Complemento da auditoria técnica — 20/11/2026

- O projeto Supabase já possui o bucket `livros`, configurado como **privado**. Ele contém PDFs de produtos anteriores, mas não contém os quatro arquivos novos da coleção Arquitetura de Legado.
- `store_purchase_events` possui chave primária em `session_id`, adequada como base de idempotência por sessão. A tabela está com RLS ativado e sem políticas; o acesso atual é compatível com operações server-side via service role, não com consulta direta pelo navegador.
- `purchases` tem campos genéricos e não possui constraint única identificada para `payment_id`; não usar essa tabela como única barreira contra eventos duplicados.
- `akasha_customers.email` é único, mas não contém UID Firebase na estrutura atual; não assumir que já está sincronizada com `users/{uid}`.
- A tela `/admin/perfis/` lista apenas a coleção Firestore `users`; ainda não agrega compras nem registros de calls.
- O dashboard atual é uma página de comunidade/posts e ainda não contém a navegação de biblioteca, leituras, sessão de alinhamento, QuiteI e Cashflow descrita neste plano.
- As regras atuais do Firestore já possuem `isAfMentor()`, `users/{uid}`, `leituras/{uid}` e coleções de gestão do mentor. Para registros oficiais de LeituraCall, adicionar regras específicas e restritivas; não reutilizar coleções de chamadas de vídeo ou regras públicas.
- O webhook atual já usa o serviço de e-mail Resend para outros produtos, mas a disponibilidade das variáveis de envio deve ser verificada no ambiente da Edge Function sem expor seus valores.
- O Advisor do Supabase reportou tabelas com RLS habilitado e sem policies (incluindo `purchases`, `store_purchase_events` e `akasha_customers`), além de avisos sobre uma função SECURITY DEFINER pública e proteção contra senhas vazadas desativada. Não abrir policies amplas para resolver isso; revisar a intenção e manter as tabelas financeiras acessíveis somente pelo backend quando esse for o desenho correto.



## 12. Implementação inicial da Central LeituraCall — 20/11/2026

- Criada a rota `/leituracall/registros/` com acesso restrito ao UID administrador e aos quatro e-mails já reconhecidos por `isAfMentor()`.
- A tela carrega perfis da coleção existente `users` e permite vincular cada registro ao UID, sem criar cadastro paralelo.
- Formulário inicial registra tipo, data, status, origem, contexto, objetivos, observações privadas do mentor, síntese, direcionamentos, próximos passos e data de retorno.
- Registros oficiais são gravados na nova coleção Firestore `leituracallRecords`; a interface não expõe esses registros aos clientes.
- A Central do Funil é aberta em modal por iframe, reutilizando a rota existente. O Mapa de Alinhamento é aberto pela rota já existente.
- Adicionado atalho para a Central LeituraCall no cabeçalho de `/admin/perfis/`.
- Adicionada regra de Firestore para que somente `isAfMentor()` possa ler ou escrever `leituracallRecords`.
- **Atenção:** a regra foi atualizada no arquivo versionado `afplataforma/firestore.rules`, mas ainda precisa ser publicada no Firebase Console/deploy de regras antes que a nova tela consiga ler e gravar. A publicação não foi executada nesta etapa.
- **Ainda não implementado:** sincronização automática do histórico no detalhe do perfil, cópia pessoal do cliente, compartilhamento seletivo de materiais e integração dos dados do Mapa de Alinhamento com o registro. A primeira versão apenas oferece link para a ferramenta atual, preservando sua implementação.
- **Validação pendente:** login de mentor, leitura de perfis, criação/edição de registros e isolamento de acesso precisam ser testados após publicar as regras.
