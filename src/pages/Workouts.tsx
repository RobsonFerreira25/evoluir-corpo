import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LevelBadge } from '@/components/ui/level-badge';
import { 
  circuits, 
  getCircuitsByLevel, 
  calculateCircuitCalories,
  Circuit 
} from '@/lib/exercises';
import { 
  Flame, 
  ArrowLeft, 
  Clock, 
  Zap, 
  Lock,
  ChevronRight,
  Dumbbell
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Workouts = () => {
  const { profile } = useProfile();
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>(
    profile?.current_level || 'beginner'
  );

  const isLevelLocked = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!profile) return true;
    const levels = ['beginner', 'intermediate', 'advanced'];
    return levels.indexOf(level) > levels.indexOf(profile.current_level);
  };

  const getCircuitsForLevel = (level: 'beginner' | 'intermediate' | 'advanced') => {
    if (!profile) return [];
    return getCircuitsByLevel(level, profile.sex as 'male' | 'female');
  };

  const CircuitCard = ({ circuit, locked }: { circuit: Circuit; locked: boolean }) => {
    const calories = calculateCircuitCalories(circuit);
    
    return (
      <Card className={`relative overflow-hidden transition-all ${
        locked ? 'opacity-60' : 'hover:shadow-lg cursor-pointer'
      }`}>
        {locked && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="text-center p-4">
              <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Complete o nível anterior</p>
            </div>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{circuit.name}</h3>
              <LevelBadge level={circuit.level} size="sm" className="mt-1" />
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              circuit.level === 'beginner' ? 'gradient-success' :
              circuit.level === 'intermediate' ? 'bg-warning' :
              'gradient-advanced'
            }`}>
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>~{circuit.totalDuration} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>{calories} kcal</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{circuit.sets} séries</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {circuit.exercises.slice(0, 4).map((ce, idx) => (
              <span key={idx} className="text-xs bg-muted px-2 py-1 rounded-full">
                {circuit.exercises.length > 4 && idx === 3 
                  ? `+${circuit.exercises.length - 3} mais`
                  : ce.exerciseId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                }
              </span>
            ))}
          </div>
          
          {!locked && (
            <Button 
              asChild 
              className="w-full mt-4 gradient-primary hover:opacity-90"
            >
              <Link to={`/workout/${circuit.id}`}>
                Iniciar Treino
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Treinos</h1>
              <p className="text-xs text-muted-foreground">Escolha seu circuito</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Current Level */}
        <Card className="gradient-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Seu nível atual</p>
                <h2 className="text-2xl font-bold mt-1">
                  {profile?.current_level === 'beginner' && 'Iniciante 🌱'}
                  {profile?.current_level === 'intermediate' && 'Intermediário 💪'}
                  {profile?.current_level === 'advanced' && 'Avançado 🔥'}
                </h2>
              </div>
              <Flame className="w-16 h-16 text-white/30" />
            </div>
          </CardContent>
        </Card>

        {/* Level Tabs */}
        <Tabs value={selectedLevel} onValueChange={(v) => setSelectedLevel(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="beginner" className="flex items-center gap-1">
              🟢 Iniciante
            </TabsTrigger>
            <TabsTrigger value="intermediate" className="flex items-center gap-1">
              🟡 Intermediário
              {isLevelLocked('intermediate') && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              🔴 Avançado
              {isLevelLocked('advanced') && <Lock className="w-3 h-3 ml-1" />}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beginner" className="mt-6 space-y-4">
            {getCircuitsForLevel('beginner').map(circuit => (
              <CircuitCard 
                key={circuit.id} 
                circuit={circuit} 
                locked={false}
              />
            ))}
          </TabsContent>

          <TabsContent value="intermediate" className="mt-6 space-y-4">
            {getCircuitsForLevel('intermediate').map(circuit => (
              <CircuitCard 
                key={circuit.id} 
                circuit={circuit} 
                locked={isLevelLocked('intermediate')}
              />
            ))}
          </TabsContent>

          <TabsContent value="advanced" className="mt-6 space-y-4">
            {getCircuitsForLevel('advanced').map(circuit => (
              <CircuitCard 
                key={circuit.id} 
                circuit={circuit} 
                locked={isLevelLocked('advanced')}
              />
            ))}
          </TabsContent>
        </Tabs>

        {/* Level Info */}
        <Card>
          <CardHeader>
            <CardTitle>🎯 Sistema de Progressão</CardTitle>
            <CardDescription>
              Complete treinos para evoluir de nível
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-level-beginner flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold">Iniciante</h4>
                <p className="text-sm text-muted-foreground">
                  Exercícios básicos, curta duração. Foco em aprender a técnica correta.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-level-intermediate flex items-center justify-center text-foreground text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold">Intermediário</h4>
                <p className="text-sm text-muted-foreground">
                  Maior tempo sob tensão, menos descanso. Desbloqueado após 2 semanas no iniciante.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 rounded-full bg-level-advanced flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold">Avançado</h4>
                <p className="text-sm text-muted-foreground">
                  Circuitos longos, alta intensidade. Desbloqueado após 4 semanas no intermediário.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Workouts;