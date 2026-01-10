export interface Exercise {
  id: string;
  name: string;
  description: string;
  position: 'standing' | 'front' | 'back';
  muscleGroup: 'chest' | 'abs' | 'hips';
  muscleDetail: string;
  tips: string[];
  commonMistakes: string[];
  gifUrl: string;
  caloriesPerMinute: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Circuit {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  sex: 'male' | 'female' | 'both';
  exercises: CircuitExercise[];
  totalDuration: number;
  restBetweenExercises: number;
  restBetweenSets: number;
  sets: number;
}

export interface CircuitExercise {
  exerciseId: string;
  duration: number;
  reps?: number;
}

// Exercise database with ExerciseDB API GIFs
export const exercises: Exercise[] = [
  // CHEST EXERCISES
  {
    id: 'pushup-standard',
    name: 'Flexão de Braço',
    description: 'Exercício clássico para fortalecimento do peitoral, tríceps e ombros.',
    position: 'front',
    muscleGroup: 'chest',
    muscleDetail: 'Peitoral médio',
    tips: [
      'Mantenha o corpo reto como uma prancha',
      'Cotovelos a 45° do corpo',
      'Desça até o peito quase tocar o chão'
    ],
    commonMistakes: [
      'Quadril muito alto ou muito baixo',
      'Cotovelos muito abertos',
      'Não completar a amplitude do movimento'
    ],
    gifUrl: 'https://api.exercisedb.io/image/vfR8vL-K9sA-pq',
    caloriesPerMinute: 8,
    difficulty: 'beginner'
  },
  {
    id: 'incline-pushup',
    name: 'Flexão Inclinada',
    description: 'Variação mais fácil da flexão, ideal para iniciantes. Mãos apoiadas em superfície elevada.',
    position: 'standing',
    muscleGroup: 'chest',
    muscleDetail: 'Peitoral inferior',
    tips: [
      'Use uma cadeira, banco ou parede',
      'Mantenha o core ativado',
      'Movimento controlado'
    ],
    commonMistakes: [
      'Perder a postura do core',
      'Movimentos muito rápidos',
      'Apoio instável'
    ],
    gifUrl: 'https://api.exercisedb.io/image/2TFsXv6Vg1FGLm',
    caloriesPerMinute: 6,
    difficulty: 'beginner'
  },
  {
    id: 'diamond-pushup',
    name: 'Flexão Diamante',
    description: 'Flexão com mãos próximas formando um diamante, foco no tríceps e peitoral interno.',
    position: 'front',
    muscleGroup: 'chest',
    muscleDetail: 'Peitoral interno',
    tips: [
      'Forme um losango com os dedões e indicadores',
      'Mantenha os cotovelos próximos ao corpo',
      'Core sempre ativado'
    ],
    commonMistakes: [
      'Mãos muito afastadas',
      'Cotovelos abrindo para fora',
      'Amplitude incompleta'
    ],
    gifUrl: 'https://api.exercisedb.io/image/PHwKXrxaJL0jCE',
    caloriesPerMinute: 10,
    difficulty: 'intermediate'
  },
  {
    id: 'decline-pushup',
    name: 'Flexão Declinada',
    description: 'Pés elevados em superfície, maior ênfase no peitoral superior.',
    position: 'front',
    muscleGroup: 'chest',
    muscleDetail: 'Peitoral superior',
    tips: [
      'Pés em uma cadeira ou banco',
      'Mantenha o corpo reto',
      'Desça controladamente'
    ],
    commonMistakes: [
      'Quadril muito alto',
      'Olhar para os pés ao invés do chão',
      'Superfície instável para os pés'
    ],
    gifUrl: 'https://api.exercisedb.io/image/8RZlJu3LkKL0Cq',
    caloriesPerMinute: 11,
    difficulty: 'advanced'
  },

  // ABS EXERCISES
  {
    id: 'crunch',
    name: 'Abdominal Crunch',
    description: 'Exercício básico para abdômen superior.',
    position: 'back',
    muscleGroup: 'abs',
    muscleDetail: 'Abdômen superior',
    tips: [
      'Mãos atrás da cabeça ou no peito',
      'Suba usando os abdominais, não o pescoço',
      'Expire ao subir'
    ],
    commonMistakes: [
      'Puxar o pescoço com as mãos',
      'Subir demais tirando a lombar do chão',
      'Prender a respiração'
    ],
    gifUrl: 'https://api.exercisedb.io/image/Q4XzPfKQVjvPxq',
    caloriesPerMinute: 5,
    difficulty: 'beginner'
  },
  {
    id: 'leg-raises',
    name: 'Elevação de Pernas',
    description: 'Exercício focado no abdômen inferior.',
    position: 'back',
    muscleGroup: 'abs',
    muscleDetail: 'Abdômen inferior',
    tips: [
      'Mantenha as costas no chão',
      'Pernas estendidas ou levemente flexionadas',
      'Desça lentamente'
    ],
    commonMistakes: [
      'Arquear a lombar',
      'Usar impulso para subir',
      'Descer as pernas muito rápido'
    ],
    gifUrl: 'https://api.exercisedb.io/image/CbpMJAuyjX3jzK',
    caloriesPerMinute: 6,
    difficulty: 'beginner'
  },
  {
    id: 'russian-twist',
    name: 'Twist Russo',
    description: 'Exercício rotacional para oblíquos.',
    position: 'back',
    muscleGroup: 'abs',
    muscleDetail: 'Oblíquos',
    tips: [
      'Mantenha o peito aberto',
      'Gire o tronco, não apenas os braços',
      'Pés podem ficar no chão ou suspensos'
    ],
    commonMistakes: [
      'Girar apenas os braços',
      'Perder a postura do tronco',
      'Movimentos muito rápidos'
    ],
    gifUrl: 'https://api.exercisedb.io/image/WLq2VPvrAqEjsq',
    caloriesPerMinute: 7,
    difficulty: 'intermediate'
  },
  {
    id: 'plank',
    name: 'Prancha',
    description: 'Exercício isométrico para core completo.',
    position: 'front',
    muscleGroup: 'abs',
    muscleDetail: 'Core',
    tips: [
      'Corpo em linha reta da cabeça aos calcanhares',
      'Contraia glúteos e abdômen',
      'Respire normalmente'
    ],
    commonMistakes: [
      'Quadril muito alto ou baixo',
      'Prender a respiração',
      'Pescoço desalinhado'
    ],
    gifUrl: 'https://api.exercisedb.io/image/Q2ENWQV8jJhJxq',
    caloriesPerMinute: 4,
    difficulty: 'beginner'
  },
  {
    id: 'mountain-climber',
    name: 'Escalador',
    description: 'Exercício dinâmico para core e cardio.',
    position: 'front',
    muscleGroup: 'abs',
    muscleDetail: 'Core e cardio',
    tips: [
      'Posição de flexão',
      'Alterne os joelhos em direção ao peito',
      'Mantenha o quadril estável'
    ],
    commonMistakes: [
      'Quadril subindo muito',
      'Perder o ritmo',
      'Não trazer o joelho suficientemente perto'
    ],
    gifUrl: 'https://api.exercisedb.io/image/0GHUJTvE3FEjxq',
    caloriesPerMinute: 12,
    difficulty: 'intermediate'
  },

  // HIP EXERCISES
  {
    id: 'glute-bridge',
    name: 'Ponte de Glúteos',
    description: 'Exercício para fortalecimento de glúteos.',
    position: 'back',
    muscleGroup: 'hips',
    muscleDetail: 'Glúteos',
    tips: [
      'Pés apoiados no chão, joelhos dobrados',
      'Eleve o quadril contraindo os glúteos',
      'Mantenha por 1-2 segundos no topo'
    ],
    commonMistakes: [
      'Hiperextender a lombar',
      'Não contrair os glúteos no topo',
      'Pés muito longe ou perto do quadril'
    ],
    gifUrl: 'https://api.exercisedb.io/image/0QAc3l3J1KrJxq',
    caloriesPerMinute: 5,
    difficulty: 'beginner'
  },
  {
    id: 'squat',
    name: 'Agachamento',
    description: 'Exercício fundamental para pernas e glúteos.',
    position: 'standing',
    muscleGroup: 'hips',
    muscleDetail: 'Glúteos e quadríceps',
    tips: [
      'Pés na largura dos ombros',
      'Joelhos alinhados com os dedos dos pés',
      'Desça como se fosse sentar'
    ],
    commonMistakes: [
      'Joelhos passando muito à frente',
      'Calcanhares saindo do chão',
      'Lombar arredondando'
    ],
    gifUrl: 'https://api.exercisedb.io/image/OKdRqv3J1KrJxq',
    caloriesPerMinute: 8,
    difficulty: 'beginner'
  },
  {
    id: 'side-lying-hip-abduction',
    name: 'Abdução de Quadril Deitado',
    description: 'Exercício para abdutores do quadril.',
    position: 'back',
    muscleGroup: 'hips',
    muscleDetail: 'Abdutores',
    tips: [
      'Deite de lado com as pernas estendidas',
      'Eleve a perna de cima mantendo reta',
      'Movimento controlado'
    ],
    commonMistakes: [
      'Girar o quadril para trás',
      'Movimento muito rápido',
      'Flexionar o joelho'
    ],
    gifUrl: 'https://api.exercisedb.io/image/K8RlJu3LkKL0Cq',
    caloriesPerMinute: 4,
    difficulty: 'beginner'
  },
  {
    id: 'fire-hydrant',
    name: 'Cachorro Fazendo Xixi',
    description: 'Exercício de abdução para glúteo médio.',
    position: 'front',
    muscleGroup: 'hips',
    muscleDetail: 'Glúteo médio',
    tips: [
      'Posição de quatro apoios',
      'Eleve a perna lateralmente mantendo joelho dobrado',
      'Mantenha o core estável'
    ],
    commonMistakes: [
      'Girar o tronco junto com a perna',
      'Perder a estabilidade do core',
      'Amplitude excessiva'
    ],
    gifUrl: 'https://api.exercisedb.io/image/L9SlKu4MlLM1Dr',
    caloriesPerMinute: 5,
    difficulty: 'beginner'
  },
  {
    id: 'lunges',
    name: 'Avanço',
    description: 'Exercício unilateral para pernas e glúteos.',
    position: 'standing',
    muscleGroup: 'hips',
    muscleDetail: 'Glúteos e quadríceps',
    tips: [
      'Dê um passo à frente',
      'Ambos os joelhos a 90°',
      'Tronco ereto'
    ],
    commonMistakes: [
      'Joelho da frente passando do pé',
      'Perder o equilíbrio',
      'Tronco inclinando para frente'
    ],
    gifUrl: 'https://api.exercisedb.io/image/M0TmLv5NmMN2Es',
    caloriesPerMinute: 9,
    difficulty: 'intermediate'
  },
  {
    id: 'donkey-kicks',
    name: 'Coice de Burro',
    description: 'Exercício focado nos glúteos.',
    position: 'front',
    muscleGroup: 'hips',
    muscleDetail: 'Glúteos',
    tips: [
      'Posição de quatro apoios',
      'Eleve uma perna para trás e para cima',
      'Mantenha o joelho dobrado a 90°'
    ],
    commonMistakes: [
      'Arquear a lombar',
      'Perder a estabilidade do core',
      'Não contrair o glúteo'
    ],
    gifUrl: 'https://api.exercisedb.io/image/N1UnMw6OnNO3Ft',
    caloriesPerMinute: 6,
    difficulty: 'beginner'
  },
];

// Pre-built circuits
export const circuits: Circuit[] = [
  // BEGINNER CIRCUITS
  {
    id: 'beginner-full-body-m',
    name: 'Corpo Todo Iniciante',
    level: 'beginner',
    sex: 'male',
    exercises: [
      { exerciseId: 'incline-pushup', duration: 30 },
      { exerciseId: 'squat', duration: 30 },
      { exerciseId: 'crunch', duration: 30 },
      { exerciseId: 'glute-bridge', duration: 30 },
      { exerciseId: 'plank', duration: 20 },
    ],
    totalDuration: 15,
    restBetweenExercises: 20,
    restBetweenSets: 60,
    sets: 2,
  },
  {
    id: 'beginner-full-body-f',
    name: 'Corpo Todo Iniciante',
    level: 'beginner',
    sex: 'female',
    exercises: [
      { exerciseId: 'incline-pushup', duration: 25 },
      { exerciseId: 'squat', duration: 30 },
      { exerciseId: 'leg-raises', duration: 25 },
      { exerciseId: 'glute-bridge', duration: 35 },
      { exerciseId: 'fire-hydrant', duration: 30 },
    ],
    totalDuration: 15,
    restBetweenExercises: 20,
    restBetweenSets: 60,
    sets: 2,
  },

  // INTERMEDIATE CIRCUITS
  {
    id: 'intermediate-full-body-m',
    name: 'Corpo Todo Intermediário',
    level: 'intermediate',
    sex: 'male',
    exercises: [
      { exerciseId: 'pushup-standard', duration: 40 },
      { exerciseId: 'squat', duration: 45 },
      { exerciseId: 'mountain-climber', duration: 30 },
      { exerciseId: 'russian-twist', duration: 35 },
      { exerciseId: 'lunges', duration: 40 },
      { exerciseId: 'plank', duration: 40 },
    ],
    totalDuration: 25,
    restBetweenExercises: 15,
    restBetweenSets: 45,
    sets: 3,
  },
  {
    id: 'intermediate-full-body-f',
    name: 'Corpo Todo Intermediário',
    level: 'intermediate',
    sex: 'female',
    exercises: [
      { exerciseId: 'pushup-standard', duration: 30 },
      { exerciseId: 'squat', duration: 45 },
      { exerciseId: 'mountain-climber', duration: 30 },
      { exerciseId: 'russian-twist', duration: 35 },
      { exerciseId: 'donkey-kicks', duration: 35 },
      { exerciseId: 'plank', duration: 35 },
    ],
    totalDuration: 25,
    restBetweenExercises: 15,
    restBetweenSets: 45,
    sets: 3,
  },

  // ADVANCED CIRCUITS
  {
    id: 'advanced-full-body-m',
    name: 'Corpo Todo Avançado',
    level: 'advanced',
    sex: 'male',
    exercises: [
      { exerciseId: 'decline-pushup', duration: 45 },
      { exerciseId: 'diamond-pushup', duration: 35 },
      { exerciseId: 'squat', duration: 50 },
      { exerciseId: 'mountain-climber', duration: 45 },
      { exerciseId: 'lunges', duration: 50 },
      { exerciseId: 'russian-twist', duration: 40 },
      { exerciseId: 'leg-raises', duration: 40 },
      { exerciseId: 'plank', duration: 60 },
    ],
    totalDuration: 35,
    restBetweenExercises: 10,
    restBetweenSets: 30,
    sets: 4,
  },
  {
    id: 'advanced-full-body-f',
    name: 'Corpo Todo Avançado',
    level: 'advanced',
    sex: 'female',
    exercises: [
      { exerciseId: 'decline-pushup', duration: 35 },
      { exerciseId: 'diamond-pushup', duration: 30 },
      { exerciseId: 'squat', duration: 50 },
      { exerciseId: 'mountain-climber', duration: 40 },
      { exerciseId: 'lunges', duration: 45 },
      { exerciseId: 'donkey-kicks', duration: 40 },
      { exerciseId: 'russian-twist', duration: 40 },
      { exerciseId: 'plank', duration: 50 },
    ],
    totalDuration: 35,
    restBetweenExercises: 10,
    restBetweenSets: 30,
    sets: 4,
  },
];

export const getExerciseById = (id: string): Exercise | undefined => {
  return exercises.find(e => e.id === id);
};

export const getCircuitsByLevel = (level: 'beginner' | 'intermediate' | 'advanced', sex: 'male' | 'female'): Circuit[] => {
  return circuits.filter(c => c.level === level && (c.sex === sex || c.sex === 'both'));
};

export const calculateCircuitCalories = (circuit: Circuit): number => {
  let totalCalories = 0;
  
  circuit.exercises.forEach(ce => {
    const exercise = getExerciseById(ce.exerciseId);
    if (exercise) {
      const minutes = ce.duration / 60;
      totalCalories += exercise.caloriesPerMinute * minutes;
    }
  });
  
  return Math.round(totalCalories * circuit.sets);
};

export const getPositionLabel = (position: Exercise['position']): string => {
  const labels = {
    standing: 'Em Pé',
    front: 'Decúbito Ventral',
    back: 'Decúbito Dorsal',
  };
  return labels[position];
};

export const getMuscleGroupLabel = (muscleGroup: Exercise['muscleGroup']): string => {
  const labels = {
    chest: 'Peitoral',
    abs: 'Abdômen',
    hips: 'Quadris',
  };
  return labels[muscleGroup];
};