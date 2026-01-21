import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full gradient-primary opacity-20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full gradient-energy opacity-20 blur-3xl animate-pulse" />
      </div>

      <div className="text-center space-y-8 relative animate-scale-in max-w-lg w-full">
        <div className="mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-xl shadow-primary/20 animate-float">
          <Flame className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-6xl">
            Fit<span className="text-primary">Home</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Sua jornada fitness começa aqui. Treinos personalizados no conforto da sua casa.
          </p>
        </div>

        <div className="pt-4">
          <Button
            size="lg"
            className="h-14 px-10 text-lg font-semibold gradient-primary hover:opacity-90 transition-all hover:scale-105 rounded-full shadow-lg shadow-primary/25 group"
            onClick={() => navigate('/auth')}
          >
            Começar Treino
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="flex justify-center gap-8 pt-8 opacity-60">
          <div className="text-center">
            <p className="text-2xl font-bold">100+</p>
            <p className="text-sm">Exercícios</p>
          </div>
          <div className="text-center border-x px-8 border-border">
            <p className="text-2xl font-bold">Gratuito</p>
            <p className="text-sm">Sempre</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">4.9/5</p>
            <p className="text-sm">Avaliação</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

