
## Documentação Técnica — Nutri&Fit

Este documento é destinado a desenvolvedores que vão manter ou evoluir o aplicativo Nutri&Fit (anteriormente Nutri&Fit). Contém visão arquitetural, como configurar o ambiente, padrões do código, modelos de dados, fluxo de navegação, chaves de armazenamento local e instruções de build/release.

Sumário
- Visão geral
- Tecnologias e dependências
- Estrutura do repositório
- Fluxo de inicialização e navegação
- Modelos de dados e AsyncStorage
- Planos por comorbidade e recipes registry
- Scripts úteis e execução local
- Build e publicação (EAS / Expo)
- Testes e lint
- Contribuição e guidelines

1) Visão geral
O aplicativo é uma aplicação mobile construída com Expo + React Native em TypeScript. Ele oferece cadastro de usuário, cálculo de IMC, registros de pesagem, planos alimentares e de exercícios adaptados por perfil e por comorbidade, além de um registro básico de receitas.

2) Tecnologias e dependências principais
- React Native (via Expo)
- Expo SDK
- TypeScript
- Formik + Yup (validação de formulários)
- AsyncStorage (persistência local)
- react-native-chart-kit (gráficos)
- react-native-animatable, expo-linear-gradient, @expo/vector-icons

3) Estrutura do repositório
- `App.tsx` — entrypoint: gerencia a tela atual via estado `screen` e passa `onNavigate` para telas.
- `app.json`, `eas.json` — configurações do Expo/EAS; mantenha `slug` consistente com o projeto EAS.
- `src/screens/` — telas (Dashboard, Dieta, Exercicios, Cadastro, Home, Imc, Pesagem, Configuracoes, etc.).
- `src/components/` — componentes reutilizáveis (SideMenu, MetricCard, modais).
- `src/constants/` — registries como `ComorbidityPlans.ts` e `Recipes.ts`, `Colors.ts`.
- `src/contexts/` — `UserContext.tsx` (controle do usuário globalmente se necessário).
- `src/utils/` — utilitários (share, backup, data helpers).

4) Fluxo de inicialização e navegação
- Ao iniciar, `App.tsx` verifica `AsyncStorage.getItem('user')`:
   - Se o objeto `user` existir e conter campos essenciais (`nome`, `altura`, `peso`) o app inicia em `Dashboard` e habilita o menu lateral.
   - Senão, inicia em `Home` e o menu fica desativado até o cadastro ser completado.
- A navegação no projeto atual usa um state string `screen` em `App.tsx` (não há stack navigator completo). Para transferir dados entre telas o app usa o próprio `user` em AsyncStorage ou chaves temporárias como `selectedComorbidades` e `selectedRecipe`.

5) Modelos de dados e AsyncStorage
- `user` (persistido em `AsyncStorage` sob a chave `'user'`):
   - `nome`, `idade`, `genero`, `altura`, `peso`, `estado` (perfil de atividade), `hasComorbidades` (bool), `comorbidades` (string[]), `comorbidadeOutros` (string)
- `pesagens` (chave `'pesagens'`): array de objetos `{ data: string, peso: number }`.
- `selectedComorbidades`, `selectedComorbidadeOutros` — chaves temporárias usadas ao navegar entre Dashboard → Dieta/Exercicios (hoje as telas priorizam o `user` salvo).
- `selectedRecipe` — objeto de receita salvo antes de abrir `RecipeScreen`.

6) Planos por comorbidade e recipes registry
- `src/constants/ComorbidityPlans.ts` — mapeia nome da comorbidade → { diet: { title, content, weeklyMenu }, exercise: { title, content, weeklyExercise } }.
- `src/constants/Recipes.ts` — array com receitas contendo `id`, `title`, `description`, `ingredients[]`, `steps[]`, `heating?`, `tags[]`.
- Combinação de planos: quando várias comorbidades estão selecionadas, Dieta/Exercicios usam uma fusão (união) diária das sugestões (sem regras clínicas de prioridade). Revisões futuras podem implementar regras de conflito prioridades (p.ex. priorizar restrições renais sobre recomendações gerais).

7) Scripts úteis e execução local
- Instalar dependências:
   - `npm install`
- Rodar no Expo:
   - `npx expo start` (ou `expo start`)
- Android emulador ou dispositivo:
   - `npx expo run:android` (configuração nativa) ou use o expo Go

8) Build & publicação (EAS)
- Arquivo `eas.json` contém profiles `development`, `preview`, `production`.
- Importante: `app.json.expo.extra.eas.projectId` deve apontar para o projeto EAS correto e `app.json.expo.slug` deve coincidir com o slug do projeto no EAS. Caso contrário o build falha com mensagem sobre slug mismatch.
- Exemplo de comando de build (PowerShell):
   - `eas build -p android --profile production`
- Recomenda-se configurar corretamente `android.package` em `app.json` para coincidir com o identificador do app.

9) Testes e lint
- Execute linters e TypeScript:
   - `npm run lint` (se existir) ou `npx tsc --noEmit` para checar tipos
- Testes unitários não estão configurados por padrão; considere adicionar `jest` e `@testing-library/react-native` para cobertura.

10) Contribuição e guidelines
- Padronize commits com mensagens claras.
- Faça branches por feature e abra PRs com descrição do objetivo e arquivos alterados.
- Antes de abrir PR, rode `npm run lint` e `npx tsc`.

11) Pontos de atenção conhecidos
- Navegação baseada em `screen` string é simples, mas limita passagem de params; migrar para `react-navigation` com stacks/params melhora manutenibilidade.
- Combinação de planos por comorbidade é atualmente uma união sem regras clínicas; para uso clínico é necessário revisão por profissionais de saúde.

12) Contatos e suporte para desenvolvedores
- Mantenedor: ver seção `CONTRIBUTING.md` ou `package.json` `author` (se preenchido).

---
Se quiser, eu gero também um `CONTRIBUTING.md` e um checklist de revisão de PRs, ou posso adaptar este documento para inglês.
