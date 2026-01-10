import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  circuits, 
  getExerciseById, 
  calculateCircuitCalories,
  Exercise,
  Circuit
} from '@/lib/exercises';
import { 
  Play, 
  Pause, 
  SkipForward, 
  ArrowLeft,
  Clock,
  Zap,
  CheckCircle2,
  Flame,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type WorkoutPhase = 'ready' | 'exercise' | 'rest' | 'setRest' | 'completed';

const WorkoutExecution = () => {
  const { circuitId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const circuit = circuits.find(c => c.id === circuitId);
  
  const [phase, setPhase] = useState<WorkoutPhase>('ready');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const currentCircuitExercise = circuit?.exercises[currentExerciseIndex];
  const currentExercise = currentCircuitExercise 
    ? getExerciseById(currentCircuitExercise.exerciseId) 
    : null;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
        setTotalElapsedTime(prev => prev + 1);
        
        // Calculate calories
        if (phase === 'exercise' && currentExercise) {
          setCaloriesBurned(prev => prev + (currentExercise.caloriesPerMinute / 60));
        }
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      handlePhaseComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeRemaining]);

  const handlePhaseComplete = useCallback(() => {
    if (!circuit) return;
    
    if (phase === 'exercise') {
      // Mark exercise as completed
      if (currentExercise) {
        setCompletedExercises(prev => [...prev, currentExercise.id]);
      }
      
      // Check if there are more exercises in the set
      if (currentExerciseIndex < circuit.exercises.length - 1) {
        setPhase('rest');
        setTimeRemaining(circuit.restBetweenExercises);
      } else {
        // End of set
        if (currentSet < circuit.sets) {
          setPhase('setRest');
          setTimeRemaining(circuit.restBetweenSets);
        } else {
          // Workout completed!
          setPhase('completed');
          setIsRunning(false);
          saveWorkoutSession();
        }
      }
    } else if (phase === 'rest') {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
      setPhase('exercise');
      const nextExercise = circuit.exercises[currentExerciseIndex + 1];
      setTimeRemaining(nextExercise.duration);
    } else if (phase === 'setRest') {
      // Start new set
      setCurrentSet(prev => prev + 1);
      setCurrentExerciseIndex(0);
      setPhase('exercise');
      setTimeRemaining(circuit.exercises[0].duration);
    }
  }, [circuit, phase, currentExerciseIndex, currentSet, currentExercise]);

  const startWorkout = () => {
    if (!circuit) return;
    setPhase('exercise');
    setTimeRemaining(circuit.exercises[0].duration);
    setIsRunning(true);
  };

  const togglePause = () => {
    setIsRunning(prev => !prev);
  };

  const skipPhase = () => {
    setTimeRemaining(0);
  };

  const saveWorkoutSession = async () => {
    if (!user || !circuit) return;
    
    try {
      await supabase.from('workout_sessions').insert({
        user_id: user.id,
        workout_name: circuit.name,
        level: circuit.level,
        duration_seconds: totalElapsedTime,
        calories_burned: Math.round(caloriesBurned),
        exercises_completed: completedExercises,
      });
      
      toast({
        title: "Treino salvo! 🎉",
        description: `Você queimou ${Math.round(caloriesBurned)} calorias!`,
      });
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!circuit) return 0;
    const totalExercises = circuit.exercises.length * circuit.sets;
    const completedCount = (currentSet - 1) * circuit.exercises.length + currentExerciseIndex;
    return (completedCount / totalExercises) * 100;
  };

  if (!circuit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Treino não encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => phase !== 'completed' ? setShowExitDialog(true) : navigate('/workouts')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center">
            <h1 className="font-bold">{circuit.name}</h1>
            <p className="text-xs text-muted-foreground">
              Série {currentSet}/{circuit.sets}
            </p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowExitDialog(true)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Progress bar */}
        <Progress value={getProgressPercentage()} className="h-1 rounded-none" />
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Ready Phase */}
        {phase === 'ready' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center">
              <Flame className="w-16 h-16 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">Pronto para começar?</h2>
              <p className="text-muted-foreground">
                {circuit.exercises.length} exercícios • {circuit.sets} séries
              </p>
            </div>
            
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <Clock className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">~{circuit.totalDuration} min</p>
              </div>
              <div className="text-center">
                <Zap className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-sm text-muted-foreground">{calculateCircuitCalories(circuit)} kcal</p>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="gradient-primary hover:opacity-90 px-12 py-6 text-lg"
              onClick={startWorkout}
            >
              <Play className="w-6 h-6 mr-2" />
              Iniciar Treino
            </Button>
          </div>
        )}

        {/* Exercise Phase */}
        {(phase === 'exercise' || phase === 'rest' || phase === 'setRest') && currentExercise && (
          <div className="space-y-6 animate-fade-in">
            {/* Timer */}
            <Card className={`text-center py-8 ${
              phase === 'exercise' ? 'gradient-primary text-white' : 'bg-muted'
            }`}>
              <CardContent className="space-y-4">
                <p className="text-lg opacity-80">
                  {phase === 'exercise' && currentExercise.name}
                  {phase === 'rest' && '⏸️ Descanso'}
                  {phase === 'setRest' && '🔄 Descanso entre séries'}
                </p>
                
                <div className="text-7xl font-bold font-mono">
                  {formatTime(timeRemaining)}
                </div>
                
                {phase === 'exercise' && (
                  <p className="text-sm opacity-80">
                    Exercício {currentExerciseIndex + 1}/{circuit.exercises.length}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Exercise GIF/Demo */}
            {phase === 'exercise' && (
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img 
                      src={`https://via.placeholder.com/400x225/f97316/ffffff?text=${encodeURIComponent(currentExercise.name)}`}
                      alt={currentExercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{currentExercise.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentExercise.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentExercise.tips.slice(0, 2).map((tip, i) => (
                        <span key={i} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          💡 {tip}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next exercise preview */}
            {phase === 'rest' && currentExerciseIndex + 1 < circuit.exercises.length && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-2">Próximo exercício:</p>
                  <h3 className="font-semibold">
                    {getExerciseById(circuit.exercises[currentExerciseIndex + 1].exerciseId)?.name}
                  </h3>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={skipPhase}
                className="w-16 h-16 rounded-full"
              >
                <SkipForward className="w-6 h-6" />
              </Button>
              
              <Button
                size="lg"
                onClick={togglePause}
                className="w-20 h-20 rounded-full gradient-primary hover:opacity-90"
              >
                {isRunning ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8 text-center">
              <div>
                <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Tempo</p>
                <p className="font-bold">{formatTime(totalElapsedTime)}</p>
              </div>
              <div>
                <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-sm text-muted-foreground">Calorias</p>
                <p className="font-bold">{Math.round(caloriesBurned)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Completed Phase */}
        {phase === 'completed' && (
          <div className="text-center space-y-8 animate-fade-in">
            <div className="w-32 h-32 mx-auto rounded-full gradient-success flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-white" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-2">Treino Concluído! 🎉</h2>
              <p className="text-muted-foreground">
                Excelente trabalho! Continue assim!
              </p>
            </div>
            
            <Card>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{formatTime(totalElapsedTime)}</p>
                  <p className="text-sm text-muted-foreground">Tempo total</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{Math.round(caloriesBurned)}</p>
                  <p className="text-sm text-muted-foreground">Calorias queimadas</p>
                </div>
              </CardContent>
            </Card>
            
            <Button 
              size="lg" 
              className="gradient-primary hover:opacity-90"
              onClick={() => navigate('/dashboard')}
            >
              Voltar ao Dashboard
            </Button>
          </div>
        )}
      </main>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair do treino?</AlertDialogTitle>
            <AlertDialogDescription>
              Seu progresso não será salvo se você sair agora.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuar treino</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/workouts')}>
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WorkoutExecution;