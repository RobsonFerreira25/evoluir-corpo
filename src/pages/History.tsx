import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  Zap, 
  Calendar,
  TrendingUp,
  Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { LevelBadge } from '@/components/ui/level-badge';

interface WorkoutSession {
  id: string;
  workout_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_seconds: number;
  calories_burned: number;
  completed_at: string;
}

const History = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });
      
      if (!error && data) {
        setSessions(data as WorkoutSession[]);
      }
      setLoading(false);
    };
    
    fetchSessions();
  }, [user]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalStats = {
    workouts: sessions.length,
    totalTime: sessions.reduce((acc, s) => acc + s.duration_seconds, 0),
    totalCalories: sessions.reduce((acc, s) => acc + s.calories_burned, 0),
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
            <div className="w-10 h-10 rounded-xl gradient-success flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Histórico</h1>
              <p className="text-xs text-muted-foreground">Sua evolução</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="text-center">
            <CardContent className="p-4">
              <Dumbbell className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{totalStats.workouts}</p>
              <p className="text-xs text-muted-foreground">Treinos</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{Math.floor(totalStats.totalTime / 60)}</p>
              <p className="text-xs text-muted-foreground">Minutos</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{Math.round(totalStats.totalCalories)}</p>
              <p className="text-xs text-muted-foreground">Calorias</p>
            </CardContent>
          </Card>
        </div>

        {/* Session List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Treinos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <>
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum treino realizado ainda</p>
                <Button asChild className="mt-4 gradient-primary">
                  <Link to="/workouts">Começar primeiro treino</Link>
                </Button>
              </div>
            ) : (
              sessions.map(session => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      session.level === 'beginner' ? 'gradient-success' :
                      session.level === 'intermediate' ? 'bg-warning' :
                      'gradient-advanced'
                    }`}>
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{session.workout_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(session.completed_at), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {formatDuration(session.duration_seconds)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-primary" />
                        {session.calories_burned} kcal
                      </span>
                    </div>
                    <LevelBadge level={session.level} size="sm" className="mt-1" />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default History;