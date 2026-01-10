import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { User, Ruler, Scale, Calendar, Loader2, ArrowRight, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createProfile } = useProfile();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (step === 1 && (!name || !age)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e idade.",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && (!weight || !height)) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha peso e altura.",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createProfile({
        name,
        age: parseInt(age),
        sex,
        weight: parseFloat(weight),
        height: parseFloat(height),
      });
      toast({
        title: "Perfil criado! 💪",
        description: "Vamos ver suas métricas de saúde.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao criar perfil",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full gradient-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full gradient-success opacity-20 blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Vamos começar!</CardTitle>
            <CardDescription className="text-base">
              {step === 1 && "Primeiro, nos conte um pouco sobre você"}
              {step === 2 && "Agora, suas medidas corporais"}
              {step === 3 && "Por último, escolha seu sexo biológico"}
            </CardDescription>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? 'gradient-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="name">Seu nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Como você quer ser chamado?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="age"
                    type="number"
                    placeholder="Quantos anos você tem?"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="pl-10"
                    min={10}
                    max={100}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 70.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="pl-10"
                    min={30}
                    max={300}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="height"
                    type="number"
                    placeholder="Ex: 175"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="pl-10"
                    min={100}
                    max={250}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <Label>Sexo biológico</Label>
              <p className="text-sm text-muted-foreground">
                Isso nos ajuda a calcular métricas precisas e personalizar seu treino.
              </p>
              
              <RadioGroup
                value={sex}
                onValueChange={(v) => setSex(v as 'male' | 'female')}
                className="grid grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="male"
                  className={`flex flex-col items-center gap-3 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    sex === 'male'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="male" id="male" className="sr-only" />
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    sex === 'male' ? 'gradient-primary text-white' : 'bg-muted'
                  }`}>
                    <span className="text-2xl">👨</span>
                  </div>
                  <span className="font-medium">Masculino</span>
                </Label>

                <Label
                  htmlFor="female"
                  className={`flex flex-col items-center gap-3 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                    sex === 'female'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <RadioGroupItem value="female" id="female" className="sr-only" />
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    sex === 'female' ? 'gradient-primary text-white' : 'bg-muted'
                  }`}>
                    <span className="text-2xl">👩</span>
                  </div>
                  <span className="font-medium">Feminino</span>
                </Label>
              </RadioGroup>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Voltar
              </Button>
            )}
            
            {step < 3 ? (
              <Button
                onClick={handleNext}
                className="flex-1 gradient-primary hover:opacity-90"
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1 gradient-primary hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Começar treino!
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;