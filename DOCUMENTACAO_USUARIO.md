# Documentação do Usuário — Nutri&Fit

Este documento é um guia para usuários finais, descrevendo as principais telas e como usar o aplicativo Nutri&Fit.

Sumário
- Introdução
- Requisitos mínimos
- Fluxo inicial e cadastro
- Tela por tela (Home, Cadastro, Dashboard, IMC, Dieta, Exercícios, Pesagem, Nutricionista, Configurações)
- Comorbidades e planos
- Receitas
- Backup e restauração
- Perguntas frequentes (FAQ)

1) Introdução
Nutri&Fit ajuda você a acompanhar peso, IMC, planos alimentares e rotinas de exercício. As recomendações são orientativas; sempre procure um profissional de saúde para prescrições específicas.

2) Requisitos mínimos
- Dispositivo Android/iOS compatível com Expo/React Native
- Conexão de internet para instalação e atualizações (o app funciona offline para dados locais)

3) Fluxo inicial e cadastro
- Ao abrir o app, se você já tiver preenchido seus dados, o app abre no `Dashboard`.
- Se for novo usuário, você verá a `Home`. Toque em "Começar Agora" para acessar o `Cadastro`.
- Campos importantes no cadastro:
  - Nome, Idade, Gênero, Altura (m), Peso (kg), Perfil de atividade.
  - Informe se possui comorbidades e quais — você pode escolher itens pré-definidos ou usar "Outros" para descrever.
- Após salvar, o app leva você ao `Dashboard` e habilita o menu lateral.

4) Telas e funcionalidades
- Home
  - Boas-vindas e acesso rápido para começar cadastro.
- Cadastro
  - Informe seus dados pessoais e perfil de atividade. Esses dados alimentam cálculos de IMC e recomendações.
- Dashboard
  - Visão central com métricas, gráficos de evolução e comorbidades.
  - Botão "Editar Perfil" permite atualizar os dados a qualquer momento.
- IMC
  - Exibe IMC atual, categoria e dicas.
- Dieta
  - Mostra um plano alimentar sugerido com base no IMC e, se aplicável, nas comorbidades.
  - Exibe cardápios semanais; você pode alternar dias e ver detalhes.
  - Lista de receitas recomendadas; toque em uma receita para ver ingredientes e modo de preparo.
- Exercícios
  - Plano semanal de exercícios baseado no perfil de atividade e comorbidades.
  - Cada dia lista atividades com instruções básicas.
- Pesagem
  - Registre seu peso periodicamente para acompanhar evolução.
- Nutricionista
  - Área para registrar contatos e recomendações de profissionais.
- Configurações
  - Exportar/Importar dados, backups, e opções de suporte.

5) Comorbidades e planos
- Ao informar comorbidades no cadastro, o app adapta as recomendações de dieta e exercício.
- Quando você seleciona múltiplas comorbidades, o app cria um menu/exercício combinado (união das sugestões). Essas recomendações são gerais e devem ser validadas por um profissional.

6) Receitas
- A lista de receitas mostra título e breve descrição. Ao abrir uma receita, você verá:
  - Ingredientes
  - Modo de preparo (passo-a-passo)
  - Instruções de aquecimento (forno, airfryer, micro-ondas) se aplicável

7) Backup e restauração
- Use a tela `Configurações` para exportar seus dados (CSV/backup) e para restaurar de um arquivo.
- Recomendamos fazer backup antes de reinstalar o app ou trocar de aparelho.

8) FAQ / Problemas comuns
- O app não abre no Dashboard mesmo após cadastro: verifique se o cadastro foi salvo (Configurações → Restaurar/Ver dados). O app habilita o menu quando o `user` com campos essenciais estiver salvo.
- Erro ao gerar APK/EAS: confirme `app.json.slug` corresponde ao projeto EAS e que o `projectId` está correto.

9) Contato e suporte
- Use a tela `Configurações` para encontrar informações de contato e suporte.

---
Se desejar eu posso formatar esses arquivos em inglês, gerar uma versão resumida para a página do GitHub (README) e montar imagens/schemas do fluxo operacional.
