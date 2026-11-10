# Akasha Trading · Backlog de implementação

Este backlog transforma as especificações 2.3–2.6 em entregas verificáveis. As tarefas não autorizam, por si só, alterações destrutivas em produção.

## Épico A · Descoberta e baseline

- [ ] A1. Inventariar todas as coleções Firestore relevantes e regras completas.
- [ ] A2. Confirmar projeto Firebase, ambientes e configuração de Auth.
- [ ] A3. Executar Diário atual em navegador e validar sintaxe/comportamento.
- [ ] A4. Capturar baseline de regressão AF, Zen Negócios, Zen Mercado e Diário.
- [ ] A5. Confirmar rotas e estratégia de hospedagem.

## Épico B · Modelo de dados e autorização (2.3)

- [ ] B1. Aprovar dicionário de dados e nomes definitivos.
- [ ] B2. Aprovar matriz de perfis e permissões.
- [ ] B3. Criar schema em ambiente de desenvolvimento.
- [ ] B4. Implementar regras deny-by-default.
- [ ] B5. Testar propriedade, organização, papéis e entitlements no Emulator Suite.
- [ ] B6. Revisar logs, retenção e exclusão.

## Épico C · Diário e adaptador (2.4)

- [ ] C1. Especificar fixtures a partir do formato real legado.
- [ ] C2. Criar adaptador isolado e somente leitura.
- [ ] C3. Criar exportação de backup verificável.
- [ ] C4. Criar fluxo de importação opt-in.
- [ ] C5. Implementar IDs estáveis e idempotência.
- [ ] C6. Implementar relatório de importação e retomada.
- [ ] C7. Comparar contagem e campos antes/depois.
- [ ] C8. Manter chaves e rota legadas intactas.

## Épico D · Segurança e migração (2.5)

- [ ] D1. Separar desenvolvimento, homologação e produção.
- [ ] D2. Revisar segredos, configuração e dependências.
- [ ] D3. Implementar rate limiting e validação de payload.
- [ ] D4. Revisar privacidade e retenção.
- [ ] D5. Ensaiar rollback.
- [ ] D6. Executar piloto opt-in com dados de teste.

## Épico E · Qualidade e aceite (2.6)

- [ ] E1. Unit tests.
- [ ] E2. Firestore Rules tests.
- [ ] E3. Integration tests.
- [ ] E4. E2E por perfil.
- [ ] E5. Testes responsivos e acessibilidade.
- [ ] E6. Regressão AF Plataforma e Zen Negócios.
- [ ] E7. Regressão do Diário e exportação.
- [ ] E8. Evidências e aprovação de release.

## Ordem de execução

1. A1–A5: baseline.
2. B1–B6: dados e permissões.
3. C1–C8: integração do Diário.
4. D1–D6: segurança e piloto.
5. E1–E8: validação final.

## Definition of Done

Uma tarefa só é concluída com código revisado, teste correspondente, evidência registrada e documentação atualizada. Migração ou alteração em produção exige aprovação específica e rollback disponível.
