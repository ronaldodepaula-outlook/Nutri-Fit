# Contributing to Nutri&Fit

Obrigado por contribuir com o Nutri&Fit! Este documento descreve as práticas e expectativas para contribuições (issues, branches e pull requests).

## Como contribuir

1. Fork o repositório e crie uma branch a partir de `main` com nome descritivo:
   - `feature/nome-da-feature`
   - `fix/descricao-bug`
   - `chore/dependencias`

2. Mantenha a branch atualizada com `main` antes de abrir o PR.

3. Faça commits pequenos e atômicos com mensagens claras. Siga um formato simples:
   - `feat: adicionar X` 
   - `fix: corrigir Y`
   - `chore: atualizar dependência Z`

## Requisitos antes de abrir um Pull Request

- Rode os checks locais:
  - `npm install`
  - `npx tsc --noEmit`  (TypeScript type-check)
  - `npm run lint` (se disponível)

- Garanta que novos componentes/arquitetura mantenham o padrão do projeto (TypeScript, componentes funcionais, estilos consistentes).

- Adicione testes quando aplicável. O projeto não tem suíte de testes configurada por padrão; adicione instruções no PR se você incluir testes.

## Pull Request Checklist
- [ ] A branch foi atualizada com `main` e não há conflitos.
- [ ] TypeScript compila sem erros (`npx tsc --noEmit`).
- [ ] Lint passou (`npm run lint` se aplicável).
- [ ] Descrição do PR explica claramente a mudança e o motivo.
- [ ] Inclui mudanças no `DOCUMENTACAO_TECNICA.md` caso tenha alterações no comportamento, armazenamento ou modelos de dados.
- [ ] Não comitei credenciais ou segredos.

## Code review
- Seja claro e objetivo nos comentários.
- Sugira alternativas e explique motivos de design.
- Para mudanças grandes, considere abrir uma issue ou um RFC antes da implementação.

## Estilo de código
- Usar TypeScript com tipagens explícitas quando fizer sentido.
- Componentes funcionais com hooks.
- Evitar modificações grandes em arquivos não relacionados ao escopo do PR.

## Processo de merge
- PRs aprovados por pelo menos 1 revisor podem ser mesclados.
- Mantenha a mensagem de merge clara e referencie a issue relacionada quando houver.

## Comunicação
- Use issues para bugs e discussões de features.
- No PR, explique claramente as mudanças e qualquer passo para testar localmente.

Obrigado por ajudar a melhorar o Nutri&Fit! Se quiser, posso adicionar um template de PR (GitHub `PULL_REQUEST_TEMPLATE.md`) e um arquivo `ISSUE_TEMPLATE.md` também.
