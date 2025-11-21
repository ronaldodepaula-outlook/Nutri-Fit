type Heating = {
  oven?: string; // e.g. '180°C por 20 minutos'
  airfryer?: string;
  microwave?: string;
};

type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  heating?: Heating;
  tags?: string[]; // comorbidades or 'gain'|'maintenance' etc
};

const Recipes: Recipe[] = [
  {
    id: 'salmao-quinoa',
    title: 'Salmão grelhado com quinoa e aspargos',
    description: 'Prato rico em ômega-3 e proteínas magras, adequado para controle glicêmico e saúde cardíaca.',
    ingredients: ['150g de salmão', '1/2 xícara de quinoa cozida', 'aspargos a gosto', 'azeite, sal e limão'],
    steps: [
      'Tempere o salmão com sal, pimenta e suco de limão.',
      'Grelhe o salmão em frigideira antiaderente por 3-4 minutos de cada lado.',
      'Cozinhe a quinoa conforme instruções da embalagem.',
      'Grelhe os aspargos com um fio de azeite e sirva com o salmão e a quinoa.'
    ],
    heating: { oven: 'Forno 180°C por 12-15 minutos (opcional)', airfryer: 'Airfryer 180°C por 10-12 minutos' },
    tags: ['Doença cardíaca', 'Diabetes', 'maintenance']
  },
  {
    id: 'frango-batata-doce',
    title: 'Peito de frango grelhado com batata-doce',
    description: 'Opção prática e balanceada, boa para ganho de massa ou manutenção com baixo índice glicêmico.',
    ingredients: ['150g peito de frango', '1 batata-doce média', 'sal, ervas finas, azeite'],
    steps: [
      'Tempere o frango com sal e ervas. Grelhe até dourar.',
      'Corte a batata-doce em cubos e asse ou cozinhe até ficar macia.',
      'Sirva o frango com a batata-doce e salada verde.'
    ],
    heating: { oven: 'Forno 200°C por 25-30 minutos (batata-doce)', microwave: 'Micro-ondas: 6-8 minutos para a batata' },
    tags: ['gain', 'Diabetes']
  },
  {
    id: 'sopa-legumes',
    title: 'Sopa leve de legumes',
    description: 'Sopa nutritiva, de fácil digestão e indicada para quem precisa de refeições leves (p.ex. doença renal com adaptações).',
    ingredients: ['Legumes variados (abóbora, cenoura, chuchu)', 'temperos a gosto', 'caldo leve sem sal'],
    steps: [
      'Corte os legumes em cubos e cozinhe em água com caldo leve até ficarem macios.',
      'Bata parcialmente no liquidificador para obter textura cremosa (opcional).',
      'Ajuste temperos e sirva quente.'
    ],
    heating: undefined,
    tags: ['Doença renal', 'Asma', 'maintenance']
  },
  {
    id: 'omelete-legumes',
    title: 'Omelete de legumes',
    description: 'Rápida, rica em proteína e adaptável. Boa para manhãs e recuperação pós-treino.',
    ingredients: ['2 ovos', 'espinafre, tomate, cebola', 'sal e pimenta a gosto'],
    steps: [
      'Bata os ovos e misture os legumes picados.',
      'Cozinhe em frigideira antiaderente até firmar.',
      'Sirva quente.'
    ],
    heating: { microwave: '2-3 minutos dependendo do aparelho' },
    tags: ['gain', 'maintenance', 'Diabetes']
  },
  {
    id: 'salada-graos',
    title: 'Salada de grãos e legumes',
    description: 'Refrescante e rica em fibras — boa para controle glicêmico e hipertensão (sem sal).',
    ingredients: ['Quinoa ou grão de sua preferência', 'legumes variados', 'azeite, limão, ervas'],
    steps: [
      'Cozinhe os grãos conforme instruções.',
      'Misture com legumes picados e tempere com azeite e limão.',
      'Sirva frio ou à temperatura ambiente.'
    ],
    tags: ['Hipertensão', 'Diabetes', 'maintenance']
  }
];

export default Recipes;
