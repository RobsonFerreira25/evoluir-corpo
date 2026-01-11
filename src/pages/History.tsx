import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  Zap, 
  Calendar,
  TrendingUp,
  Dumbbell,
  Scale,
  LineChart
} from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { LevelBadge } from '@/components/ui/level-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';

interface WorkoutSession {
  id: string;
  workout_name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_seconds: number;
  calories_burned: number;
  completed_at: string;
}

interface WeightRecord {
  id: string;
  weight: number;
  recorded_at: string;
}

const History = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [weightHistory, setWeightHistory] = useState<WeightRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      const [sessionsRes, weightRes] = await Promise.all([
        supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false }),
        supabase
          .from('weight_history')
          .select('*')
          .eq('user_id', user.id)
          .order('recorded_at', { ascending: true })
      ]);
      
      if (!sessionsRes.error && sessionsRes.data) {
        setSessions(sessionsRes.data as WorkoutSession[]);
      }
      if (!weightRes.error && weightRes.data) {
        setWeightHistory(weightRes.data as WeightRecord[]);
      }
      setLoading(false);
    };
    
    fetchData();
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

  // Prepare weight chart data
  const weightChartData = weightHistory.length > 0 
    ? weightHistory.map(w => ({
        date: format(new Date(w.recorded_at), 'dd/MM'),
        weight: w.weight,
        fullDate: format(new Date(w.recorded_at), "d 'de' MMMM", { locale: ptBR })
      }))
    : profile 
      ? [{ date: 'Hoje', weight: profile.weight, fullDate: 'Peso atual' }]
      : [];

  // Prepare weekly calories chart data
  const getWeeklyCaloriesData = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    
    return days.map(day => {
      const dayCalories = sessions
        .filter(s => isSameDay(new Date(s.completed_at), day))
        .reduce((acc, s) => acc + s.calories_burned, 0);
      
      return {
        day: format(day, 'EEE', { locale: ptBR }),
        calories: Math.round(dayCalories),
        fullDate: format(day, "d 'de' MMMM", { locale: ptBR })
      };
    });
  };

  const weeklyCaloriesData = getWeeklyCaloriesData();

  // Prepare workout frequency data (last 30 days)
  const getWorkoutFrequencyData = () => {
    const data = [];
    for (let i = 29; i >= 0; i--) {
      const day = subDays(new Date(), i);
      const count = sessions.filter(s => isSameDay(new Date(s.completed_at), day)).length;
      data.push({
        date: format(day, 'dd'),
        treinos: count,
        fullDate: format(day, "d 'de' MMMM", { locale: ptBR })
      });
    }
    return data;
  };

  const workoutFrequencyData = getWorkoutFrequencyData();

  const chartConfig = {
    weight: { label: "Peso", color: "hsl(var(--primary))" },
    calories: { label: "Calorias", color: "hsl(var(--chart-2))" },
    treinos: { label: "Treinos", color: "hsl(var(--chart-3))" },
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

        {/* Charts Section */}
        <Tabs defaultValue="calories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calories" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Calorias</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-1">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Peso</span>
            </TabsTrigger>
            <TabsTrigger value="frequency" className="flex items-center gap-1">
              <LineChart className="w-4 h-4" />
              <span className="hidden sm:inline">Frequência</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calories">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Calorias Queimadas (Semana)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <BarChart data={weeklyCaloriesData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                    />
                    <Bar 
                      dataKey="calories" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weight">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Scale className="w-4 h-4 text-primary" />
                  Evolução do Peso
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weightChartData.length > 1 ? (
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <AreaChart data={weightChartData}>
                      <defs>
                        <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        domain={['dataMin - 2', 'dataMax + 2']}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                      />
                      <Area 
                        type="monotone"
                        dataKey="weight" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#weightGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground">
                    <Scale className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-sm">Registre seu peso regularmente</p>
                    <p className="text-xs">para ver sua evolução aqui</p>
                    {profile && (
                      <p className="text-lg font-semibold mt-2 text-foreground">
                        Peso atual: {profile.weight} kg
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="frequency">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <LineChart className="w-4 h-4 text-primary" />
                  Frequência de Treinos (30 dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[200px] w-full">
                  <RechartsLineChart data={workoutFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                    />
                    <Line 
                      type="monotone"
                      dataKey="treinos" 
                      stroke="hsl(var(--chart-3))" 
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-3))", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </RechartsLineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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