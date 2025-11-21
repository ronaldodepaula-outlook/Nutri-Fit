# Nutri&Fit (anteriormente Nutri&Fit)

Aplicativo móvel para acompanhamento de saúde: IMC, pesagem, planos alimentares e de exercícios adaptados por perfil e comorbidades.

Badges
- Build: (adicione seu badge de EAS/CI aqui)
- License: (adicionar badge se aplicável)

Visão rápida
- Tecnologia: React Native + Expo + TypeScript
- Objetivo: Fornecer recomendações alimentares e de exercícios orientativas e rastrear progresso do usuário.

Documentação
- Documentação Técnica: `DOCUMENTACAO_TECNICA.md`
- Documentação do Usuário: `DOCUMENTACAO_USUARIO.md`

Começando (dev)
1. Clone o repositório:
```bash
git clone <repo-url>
cd Nutri&Fit
```
2. Instale dependências:
```powershell
npm install
```
3. Rode no Expo:
```powershell
npx expo start
```
4. Para Android (emulador ou dispositivo):
```powershell
npx expo run:android
```

Build (EAS)
- Garanta que `app.json.expo.slug` corresponde ao slug do projeto EAS e que `app.json.expo.extra.eas.projectId` aponta para o projeto correto.
- Comando exemplo (PowerShell):
```powershell
eas build -p android --profile production
```

Fluxo operacional importante
- Na inicialização o `App.tsx` verifica se `AsyncStorage` contém o objeto `user`. Se os campos essenciais estiverem preenchidos, o app abre no `Dashboard` e habilita o menu. Caso contrário, abre na `Home` e pede cadastro.
- Para navegação entre telas o app usa um `screen` state em `App.tsx`. Alguns dados são transmitidos via `AsyncStorage` (p.ex. `selectedRecipe`, `selectedComorbidades`).

Contribuindo
- Abra PRs por feature.
- Execute `npx tsc --noEmit` e corretores/lint antes de abrir PR.

Problemas comuns
- Erro EAS `slug mismatch`: verifique `app.json.expo.slug` e `extra.eas.projectId`.

Contato
- Adicione informações de contato no `Configurações` do app ou no `package.json` `author`.

---
Este README é um resumo para o GitHub; confira `DOCUMENTACAO_TECNICA.md` para detalhes de desenvolvimento e `DOCUMENTACAO_USUARIO.md` para guias de uso final.

## Arquitetura e Fluxo (Diagrama)

Veja o diagrama resumido do fluxo de telas e principais chaves de armazenamento local em `assets/diagrams/flow.svg`:

![Fluxo Nutri&Fit](./assets/diagrams/flow.svg)

Para exemplos de payloads JSON e modelos de dados veja `DOCUMENTACAO_TECNICA_EXTRAS.md`.
