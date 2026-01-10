import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BMIGauge } from '@/components/ui/bmi-gauge';
import { LevelBadge } from '@/components/ui/level-badge';
import { StatCard } from '@/components/ui/stat-card';
import { 
  Flame, 
  Scale, 
  Activity, 
  Zap, 
  Dumbbell, 
  LogOut, 
  ChevronRight,
  User,
  TrendingUp,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, healthMetrics, loading } = useProfile();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-12 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">FitHome</h1>
              <p className="text-xs text-muted-foreground">Olá, {profile?.name}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {profile && <LevelBadge level={profile.current_level} size="sm" />}
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Welcome Banner */}
        <Card className="gradient-primary text-white overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Bom dia, {profile?.name?.split(' ')[0]}! 🔥</h2>
                <p className="text-white/80">
                  Pronto para mais um treino? Seu corpo agradece!
                </p>
                <Button 
                  asChild
                  variant="secondary" 
                  className="mt-4 bg-white text-primary hover:bg-white/90"
                >
                  <Link to="/workouts">
                    Começar Treino
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <Dumbbell className="w-24 h-24 text-white/20" />
            </div>
          </CardContent>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            title="Peso Atual"
            value={`${profile?.weight} kg`}
            icon={Scale}
            variant="default"
          />
          <StatCard
            title="TMB"
            value={`${healthMetrics?.bmr}`}
            subtitle="kcal/dia"
            icon={Zap}
            variant="primary"
          />
          <StatCard
            title="Gasto Diário"
            value={`${healthMetrics?.dailyCalories}`}
            subtitle="kcal estimadas"
            icon={Activity}
            variant="success"
          />
          <StatCard
            title="Altura"
            value={`${profile?.height} cm`}
            icon={User}
            variant="default"
          />
        </div>

        {/* BMI Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Índice de Massa Corporal (IMC)
            </CardTitle>
            <CardDescription>
              O IMC é uma medida de gordura corporal baseada em peso e altura
            </CardDescription>
          </CardHeader>
          <CardContent>
            {healthMetrics && (
              <BMIGauge 
                bmi={healthMetrics.bmi} 
                category={healthMetrics.bmiCategory} 
              />
            )}
            
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">💡 Entenda seu IMC</h4>
              <p className="text-sm text-muted-foreground">
                {healthMetrics?.bmi && healthMetrics.bmi < 18.5 && 
                  "Você está abaixo do peso ideal. Considere aumentar a ingestão calórica com alimentos nutritivos e exercícios de força."
                }
                {healthMetrics?.bmi && healthMetrics.bmi >= 18.5 && healthMetrics.bmi < 25 && 
                  "Parabéns! Você está no peso ideal. Continue com hábitos saudáveis para manter esse equilíbrio."
                }
                {healthMetrics?.bmi && healthMetrics.bmi >= 25 && healthMetrics.bmi < 30 && 
                  "Você está um pouco acima do peso. Exercícios regulares e alimentação equilibrada ajudarão a melhorar."
                }
                {healthMetrics?.bmi && healthMetrics.bmi >= 30 && 
                  "Seu IMC indica obesidade. Procure orientação profissional e comece com exercícios leves, aumentando gradualmente."
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4">
          <Link to="/workouts">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Treinos</h3>
                    <p className="text-sm text-muted-foreground">Circuitos por nível</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/exercises">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-energy flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Biblioteca de Exercícios</h3>
                    <p className="text-sm text-muted-foreground">Aprenda a técnica correta</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>

          <Link to="/history">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Histórico</h3>
                    <p className="text-sm text-muted-foreground">Acompanhe sua evolução</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;