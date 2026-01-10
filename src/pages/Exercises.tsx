import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  exercises, 
  Exercise,
  getPositionLabel,
  getMuscleGroupLabel
} from '@/lib/exercises';
import { 
  ArrowLeft, 
  Search,
  Filter,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Exercises = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMuscle = muscleFilter === 'all' || exercise.muscleGroup === muscleFilter;
    const matchesPosition = positionFilter === 'all' || exercise.position === positionFilter;
    
    return matchesSearch && matchesMuscle && matchesPosition;
  });

  const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
    const isExpanded = expandedExercise === exercise.id;
    
    return (
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <Collapsible open={isExpanded} onOpenChange={() => setExpandedExercise(isExpanded ? null : exercise.id)}>
          <CollapsibleTrigger asChild>
            <CardContent className="p-4 cursor-pointer">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                  <img 
                    src={`https://via.placeholder.com/80x80/f97316/ffffff?text=${encodeURIComponent(exercise.name.charAt(0))}`}
                    alt={exercise.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{exercise.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {exercise.description}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {getMuscleGroupLabel(exercise.muscleGroup)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getPositionLabel(exercise.position)}
                    </Badge>
                    <Badge 
                      className={`text-xs ${
                        exercise.difficulty === 'beginner' ? 'bg-level-beginner' :
                        exercise.difficulty === 'intermediate' ? 'bg-level-intermediate text-foreground' :
                        'bg-level-advanced'
                      }`}
                    >
                      {exercise.difficulty === 'beginner' ? 'Iniciante' :
                       exercise.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="px-4 pb-4 border-t pt-4 space-y-4 animate-fade-in">
              {/* Exercise GIF */}
              <div className="aspect-video rounded-lg bg-muted overflow-hidden">
                <img 
                  src={`https://via.placeholder.com/400x225/f97316/ffffff?text=${encodeURIComponent(exercise.name)}`}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Details */}
              <div className="grid gap-4">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <span className="text-success">✓</span> Dicas de Execução
                  </h4>
                  <ul className="space-y-1">
                    {exercise.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2">
                    <span className="text-destructive">✗</span> Erros Comuns
                  </h4>
                  <ul className="space-y-1">
                    {exercise.commonMistakes.map((mistake, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
                  <Info className="w-5 h-5 text-primary" />
                  <div className="text-sm">
                    <span className="font-medium">{exercise.muscleDetail}</span>
                    <span className="text-muted-foreground"> • ~{exercise.caloriesPerMinute} kcal/min</span>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
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
            <div className="w-10 h-10 rounded-xl gradient-energy flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Biblioteca de Exercícios</h1>
              <p className="text-xs text-muted-foreground">{exercises.length} exercícios disponíveis</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar exercícios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Select value={muscleFilter} onValueChange={setMuscleFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Músculo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os músculos</SelectItem>
                <SelectItem value="chest">Peitoral</SelectItem>
                <SelectItem value="abs">Abdômen</SelectItem>
                <SelectItem value="hips">Quadris</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={positionFilter} onValueChange={setPositionFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas posições</SelectItem>
                <SelectItem value="standing">Em pé</SelectItem>
                <SelectItem value="front">Decúbito ventral</SelectItem>
                <SelectItem value="back">Decúbito dorsal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-4">
          {filteredExercises.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Dumbbell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum exercício encontrado</p>
              </CardContent>
            </Card>
          ) : (
            filteredExercises.map(exercise => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Exercises;