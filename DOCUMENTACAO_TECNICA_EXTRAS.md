# Documentação Técnica — Exemplos JSON e ER (Extras)

Este arquivo complementa `DOCUMENTACAO_TECNICA.md` com exemplos práticos de payloads JSON, formatos e um resumo simples das relações entre entidades.

## Exemplos JSON

### `user` (chave: `user` no AsyncStorage)
```json
{
  "nome": "João Silva",
  "idade": "34",
  "genero": "masculino",
  "altura": "1.75",
  "peso": "82.3",
  "estado": "Ativo",
  "hasComorbidades": true,
  "comorbidades": ["Diabetes", "Hipertensão"],
  "comorbidadeOutros": ""
}
```

### `pesagens` (chave: `pesagens`)
```json
[
  { "data": "2025-10-01", "peso": 85.1 },
  { "data": "2025-10-15", "peso": 83.2 },
  { "data": "2025-11-01", "peso": 82.3 }
]
```

### Trecho de `ComorbidityPlans` (formato esperado)
```json
"Diabetes": {
  "diet": {
    "title": "Dieta para Diabetes",
    "content": "Orientações gerais para controle glicêmico...",
    "weeklyMenu": [
      { "breakfast": ["Aveia"], "lunch": ["Peito de frango"], "dinner": ["Sopa de legumes"] },
      { "breakfast": ["Iogurte natural"], "lunch": ["Quinoa"], "dinner": ["Salmão grelhado"] }
    ]
  },
  "exercise": {
    "title": "Exercícios para Diabetes",
    "content": "Atividades com ênfase em aeróbicos e resistência...",
    "weeklyExercise": [
      { "day": "Segunda", "activities": [ { "name": "Caminhada", "details": "30min" } ] },
      { "day": "Terça", "activities": [ { "name": "Bicicleta", "details": "30min" } ] }
    ]
  }
}
```

### Receita (registro em `src/constants/Recipes.ts`)
```json
{
  "id": "frango-batata-doce",
  "title": "Peito de frango com batata-doce",
  "description": "Opção balanceada para almoço",
  "ingredients": ["150g peito de frango", "1 batata-doce média"],
  "steps": ["Temperar e grelhar o frango", "Cozinhar a batata-doce"],
  "heating": { "oven": "200°C por 25-30 minutos" },
  "tags": ["gain", "Diabetes"]
}
```

## Descrição ER (resumo)

- `User` (1) --- (N) `Pesagem`
- `User` referencia `ComorbidityPlan` por nomes em `comorbidades` (string[])
- `Recipes` é um conjunto de receitas independentes; as recomendações são feitas por `tags`

## Observações
- Se você alterar o formato de `user` ou `pesagens`, atualize também os componentes de leitura/escrita (ex.: `loadUser`, `loadPesagens`) e a validação do `CadastroScreen.tsx`.
- Posso gerar JSON Schema para validação automática ou um modelo OpenAPI simplificado para endpoints futuros.
