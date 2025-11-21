const ComorbidityPlans: Record<string, { diet: { title: string; content: string; weeklyMenu?: Array<{ breakfast: string[]; lunch: string[]; dinner: string[] }> }; exercise: { title: string; content: string } }> = {
  Diabetes: {
    diet: {
      title: 'Dieta para Controle Glicêmico',
      content: 'Focar em alimentos de baixo índice glicêmico, aumentar ingestão de fibras, fracionar refeições e priorizar carboidratos complexos. Evitar picos glicêmicos com redução de açúcares simples e bebidas adoçadas.',
      weeklyMenu: [
        { breakfast: ['Iogurte natural + aveia', 'Frutas vermelhas'], lunch: ['Arroz integral', 'Peito de frango grelhado', 'Salada de folhas'], dinner: ['Peixe assado', 'Quinoa', 'Legumes no vapor'] },
        { breakfast: ['Omelete de claras + espinafre', 'Pão integral'], lunch: ['Quinoa', 'Filé de peixe', 'Vagem'], dinner: ['Sopa de legumes', 'Tofu grelhado'] },
        { breakfast: ['Vitamina de abacate com leite vegetal', 'Torrada integral'], lunch: ['Arroz integral', 'Feijão', 'Frango ao forno'], dinner: ['Salada com grãos', 'Atum'] },
        { breakfast: ['Pão integral com queijo branco', 'Mamão'], lunch: ['Macarrão integral', 'Carne magra', 'Brócolis'], dinner: ['Legumes assados', 'Ovos mexidos'] },
        { breakfast: ['Iogurte natural + chia', 'Fruta'], lunch: ['Peito de frango', 'Batata-doce', 'Salada'], dinner: ['Salmão grelhado', 'Arroz integral', 'Aspargos'] },
        { breakfast: ['Tapioca com cottage', 'Frutas'], lunch: ['Quinoa', 'Carne magra', 'Legumes'], dinner: ['Sopa de abóbora', 'Peito de frango'] },
        { breakfast: ['Ovos mexidos', 'Pão integral', 'Fruta pequena'], lunch: ['Arroz integral', 'Peixe', 'Salada verde'], dinner: ['Vegetais ao forno', 'Grão-de-bico'] },
      ]
    },
    exercise: {
      title: 'Exercícios para Diabetes',
      content: 'Programa com caminhadas diárias moderadas (30–45 min), treinos de resistência leve a moderada 2–3x/semana para melhorar sensibilidade à insulina e composição corporal.'
    ,
    weeklyExercise: [
      { day: 'Segunda', activities: [ { name: 'Caminhada moderada', details: '30 minutos em ritmo confortável' }, { name: 'Alongamento', details: '10 minutos focando grandes grupos musculares' } ] },
      { day: 'Terça', activities: [ { name: 'Treino de resistência leve', details: 'Circuito com peso corporal 3 séries' } ] },
      { day: 'Quarta', activities: [ { name: 'Caminhada rápida', details: '30 minutos com variação de ritmo' } ] },
      { day: 'Quinta', activities: [ { name: 'Treino de resistência leve', details: 'Foco em membros inferiores 3x12' } ] },
      { day: 'Sexta', activities: [ { name: 'Bicicleta leve', details: '30 minutos em ritmo confortável' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento e mobilidade', details: '15 minutos' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Caminhada leve ou passeio' } ] },
    ]
    }
  },
  'Hipertensão': {
    diet: {
      title: 'Dieta para Hipertensão (DASH-like)',
      content: 'Reduzir consumo de sódio, aumentar ingestão de frutas, verduras e laticínios magros. Priorizar alimentos ricos em potássio, magnésio e fibras; evitar alimentos processados ricos em sal.',
      weeklyMenu: [
        { breakfast: ['Iogurte natural', 'Aveia', 'Frutas'], lunch: ['Quinoa', 'Peito de frango', 'Salada sem sal'], dinner: ['Peixe assado', 'Legumes cozidos'] },
        { breakfast: ['Pão integral', 'Abacate'], lunch: ['Arroz integral', 'Feijão', 'Legumes variados'], dinner: ['Sopa de legumes', 'Tofu'] },
        { breakfast: ['Omelete com tomate e espinafre'], lunch: ['Peito de frango', 'Purê de batata doce', 'Salada'], dinner: ['Filé de peixe', 'Quinoa', 'Brócolis'] },
        { breakfast: ['Iogurte + granola sem sal'], lunch: ['Salada grande com grãos', 'Atum'], dinner: ['Sopa leve', 'Ovos cozidos'] },
        { breakfast: ['Tapioca com queijo branco'], lunch: ['Peito de frango', 'Legumes grelhados'], dinner: ['Quinoa', 'Legumes no vapor'] },
        { breakfast: ['Smoothie verde', 'Pão integral'], lunch: ['Arroz integral', 'Peixe', 'Salada'], dinner: ['Sopa de legumes', 'Frango grelhado'] },
        { breakfast: ['Ovos mexidos', 'Frutas'], lunch: ['Feijão', 'Arroz', 'Legumes'], dinner: ['Filé de peixe', 'Vegetais'] },
      ]
    },
    exercise: {
      title: 'Exercícios para Hipertensão',
      content: 'Atividades aeróbicas moderadas (30 min, 5x/semana) como caminhada, bicicleta ou natação. Incluir alongamento e exercícios de baixo impacto; monitorar pressão arterial conforme orientação médica.'
    ,
    weeklyExercise: [
      { day: 'Segunda', activities: [ { name: 'Caminhada moderada', details: '30 minutos' } ] },
      { day: 'Terça', activities: [ { name: 'Alongamento e mobilidade', details: '15 minutos' } ] },
      { day: 'Quarta', activities: [ { name: 'Bicicleta leve', details: '30 minutos' } ] },
      { day: 'Quinta', activities: [ { name: 'Treino funcional leve', details: 'Circuito de 20 minutos' } ] },
      { day: 'Sexta', activities: [ { name: 'Caminhada rápida', details: '30 minutos' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento', details: '15 minutos' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Passeio leve' } ] },
    ]
    }
  },
  'Doença cardíaca': {
    diet: {
      title: 'Dieta Cardiosaludável',
      content: 'Reduzir gorduras saturadas e trans, priorizar gorduras saudáveis (ômega-3), aumentar fibras e vegetais. Moderação de sódio e controle de colesterol alimentar.',
      weeklyMenu: [
        { breakfast: ['Aveia com frutas', 'Chá'], lunch: ['Salmão grelhado', 'Quinoa', 'Salada'], dinner: ['Legumes cozidos', 'Peito de frango'] },
        { breakfast: ['Iogurte natural', 'Granola'], lunch: ['Arroz integral', 'Peixe assado', 'Brócolis'], dinner: ['Sopa de legumes', 'Tofu'] },
        { breakfast: ['Omelete com espinafre'], lunch: ['Quinoa', 'Frango grelhado', 'Salada'], dinner: ['Peixe cozido', 'Legumes ao vapor'] },
        { breakfast: ['Pão integral', 'Abacate'], lunch: ['Salada com grãos e atum'], dinner: ['Salmão assado', 'Legumes'] },
        { breakfast: ['Smoothie de frutas vermelhas'], lunch: ['Peito de frango', 'Batata doce', 'Salada'], dinner: ['Sopa leve', 'Peixe'] },
        { breakfast: ['Iogurte + chia'], lunch: ['Arroz integral', 'Peixe', 'Legumes'], dinner: ['Quinoa', 'Frango grelhado'] },
        { breakfast: ['Ovos mexidos', 'Fruta'], lunch: ['Salada grande com proteína magra'], dinner: ['Peixe', 'Vegetais'] },
      ]
    },
    exercise: {
      title: 'Exercícios para Doença Cardíaca',
      content: 'Exercícios aeróbicos de intensidade baixa a moderada com progressão supervisionada. Priorizar atividades seguras e consultar cardiologista antes de iniciar.'
    ,
    weeklyExercise: [
      { day: 'Segunda', activities: [ { name: 'Caminhada leve', details: '20-30 minutos' } ] },
      { day: 'Terça', activities: [ { name: 'Alongamento e mobilidade', details: '15 minutos' } ] },
      { day: 'Quarta', activities: [ { name: 'Bicicleta leve', details: '20-30 minutos' } ] },
      { day: 'Quinta', activities: [ { name: 'Treino de resistência leve', details: 'Foco em estabilidade e resistência' } ] },
      { day: 'Sexta', activities: [ { name: 'Caminhada moderada', details: '30 minutos' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento', details: '15 minutos' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Passeio leve' } ] },
    ]
    }
  },
  Asma: {
    diet: {
      title: 'Dieta e Inflamação (Asma)',
      content: 'Dieta equilibrada rica em frutas e vegetais antioxidantes pode ajudar no controle inflamatório. Identificar e evitar alimentos gatilho individuais.',
      weeklyMenu: [
        { breakfast: ['Iogurte natural', 'Frutas vermelhas'], lunch: ['Peito de frango', 'Quinoa', 'Salada'], dinner: ['Sopa de legumes', 'Peixe'] },
        { breakfast: ['Aveia com maçã'], lunch: ['Arroz integral', 'Peixe grelhado', 'Legumes'], dinner: ['Salada de grãos', 'Tofu'] },
        { breakfast: ['Omelete com ervas'], lunch: ['Quinoa', 'Frango ao forno', 'Legumes'], dinner: ['Peixe assado', 'Vegetais'] },
        { breakfast: ['Smoothie antioxidante'], lunch: ['Peito de frango', 'Salada grande'], dinner: ['Sopa leve', 'Peixe'] },
        { breakfast: ['Iogurte + granola'], lunch: ['Arroz integral', 'Feijão', 'Legumes'], dinner: ['Quinoa', 'Peixe'] },
        { breakfast: ['Pão integral com abacate'], lunch: ['Peixe', 'Vegetais grelhados'], dinner: ['Sopa de legumes', 'Tofu'] },
        { breakfast: ['Ovos mexidos', 'Fruta'], lunch: ['Salada com proteína magra'], dinner: ['Peixe', 'Vegetais'] },
      ]
    },
    exercise: {
      title: 'Exercícios para Asma',
      content: 'Atividades aeróbicas progressivas e controladas (caminhada, ciclismo), evitar exercícios intensos em ambientes com gatilhos; usar medicação preventiva quando prescrita.'
    ,
    weeklyExercise: [
      { day: 'Segunda', activities: [ { name: 'Caminhada leve', details: '20-30 minutos' } ] },
      { day: 'Terça', activities: [ { name: 'Alongamento respiratório', details: '10 minutos de exercícios de respiração' } ] },
      { day: 'Quarta', activities: [ { name: 'Ciclismo leve', details: '20-30 minutos' } ] },
      { day: 'Quinta', activities: [ { name: 'Treino intervalado leve', details: '10-15 minutos com esforço moderado' } ] },
      { day: 'Sexta', activities: [ { name: 'Caminhada', details: '30 minutos' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento e mobilidade', details: '15 minutos' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Passeio leve' } ] },
    ]
    }
  },
  'Doença renal': {
    diet: {
      title: 'Dieta para Saúde Renal',
      content: 'Ajustes de proteína e eletrólitos conforme estágio renal — controle de sódio, potássio e fósforo quando indicado. Sempre seguir orientação de nefrologista/nutricionista especializado.',
      weeklyMenu: [
        { breakfast: ['Pão integral com queijo branco', 'Fruta baixa em potássio (maçã)'], lunch: ['Arroz branco', 'Peito de frango', 'Salada sem sal'], dinner: ['Sopa leve', 'Peixe cozido'] },
        { breakfast: ['Iogurte natural (porção moderada)'], lunch: ['Quinoa em porção moderada', 'Legumes cozidos', 'Tofu'], dinner: ['Purê de abóbora', 'Peito de frango'] },
        { breakfast: ['Ovos mexidos', 'Pão integral'], lunch: ['Arroz branco', 'Peixe grelhado', 'Legumes'], dinner: ['Sopa de legumes', 'Peito de frango'] },
        { breakfast: ['Tapioca com queijo branco'], lunch: ['Quinoa moderada', 'Frango grelhado', 'Salada'], dinner: ['Legumes assados', 'Tofu'] },
        { breakfast: ['Smoothie leve (sem banana)'], lunch: ['Arroz branco', 'Peixe', 'Legumes'], dinner: ['Sopa leve', 'Peito de frango'] },
        { breakfast: ['Omelete simples'], lunch: ['Quinoa', 'Legumes cozidos', 'Peixe'], dinner: ['Purê de batata', 'Peito de frango'] },
        { breakfast: ['Pão integral com geleia sem açúcar'], lunch: ['Arroz branco', 'Peixe', 'Salada'], dinner: ['Sopa leve', 'Tofu'] },
      ]
    },
    exercise: {
      title: 'Exercícios para Doença Renal',
      content: 'Exercícios de baixa a moderada intensidade para manter função cardiovascular e força muscular; monitorar fadiga e sinais clínicos durante treinos.'
    ,
    weeklyExercise: [
      { day: 'Segunda', activities: [ { name: 'Caminhada leve', details: '20-30 minutos' } ] },
      { day: 'Terça', activities: [ { name: 'Alongamento e mobilidade', details: '15 minutos' } ] },
      { day: 'Quarta', activities: [ { name: 'Bicicleta leve', details: '20-30 minutos' } ] },
      { day: 'Quinta', activities: [ { name: 'Treino de resistência leve', details: 'Foco em grandes grupos musculares com baixo peso' } ] },
      { day: 'Sexta', activities: [ { name: 'Caminhada', details: '30 minutos' } ] },
      { day: 'Sábado', activities: [ { name: 'Alongamento', details: '15 minutos' } ] },
      { day: 'Domingo', activities: [ { name: 'Descanso ativo', details: 'Passeio leve' } ] },
    ]
    }
  },
  Outros: {
    diet: {
      title: 'Recomendações Gerais',
      content: 'Recomendações gerais: dieta balanceada, variedade de alimentos, hidratação adequada e evitar excessos. Consulte profissional para adaptações específicas.',
      weeklyMenu: [
        { breakfast: ['Iogurte + granola', 'Fruta'], lunch: ['Arroz integral', 'Peito de frango', 'Salada'], dinner: ['Sopa de legumes', 'Peixe'] },
        { breakfast: ['Ovos mexidos', 'Pão integral'], lunch: ['Quinoa', 'Peixe', 'Legumes'], dinner: ['Salada com grãos', 'Tofu'] },
        { breakfast: ['Smoothie de frutas'], lunch: ['Arroz integral', 'Frango grelhado', 'Legumes'], dinner: ['Peixe assado', 'Vegetais'] },
        { breakfast: ['Tapioca com queijo'], lunch: ['Peito de frango', 'Batata-doce', 'Salada'], dinner: ['Quinoa', 'Legumes'] },
        { breakfast: ['Iogurte', 'Fruta'], lunch: ['Arroz integral', 'Peixe', 'Salada'], dinner: ['Sopa leve', 'Tofu'] },
        { breakfast: ['Pão integral', 'Abacate'], lunch: ['Quinoa', 'Frango', 'Legumes'], dinner: ['Peixe', 'Vegetais'] },
        { breakfast: ['Ovos mexidos', 'Fruta'], lunch: ['Arroz integral', 'Peixe', 'Salada'], dinner: ['Legumes ao forno', 'Tofu'] },
      ]
    },
    exercise: {
      title: 'Atividade Física Recomendada',
      content: 'Atividades seguras e adaptadas ao nível de condicionamento: caminhada, alongamento, treinos de força leve e progressão gradual conforme tolerância.'
    }
  }
};

export default ComorbidityPlans;
