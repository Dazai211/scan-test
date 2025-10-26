import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Leaf, Apple, Calendar, Sparkles } from 'lucide-react';

interface ResultsDisplayProps {
  result: {
    fruitName: string;
    freshness: {
      status: 'Ripe' | 'Unripe' | 'Overripe';
      indicators: string[];
    };
    nutrients: {
      vitamins: string[];
      minerals: string[];
      benefits: string[];
    };
    shelfLife: {
      days: number;
      tips: string[];
    };
  };
}

export const ResultsDisplay = ({ result }: ResultsDisplayProps) => {
  const getFreshnessColor = (status: string) => {
    if (status === 'Ripe') return 'bg-primary text-primary-foreground';
    if (status === 'Unripe') return 'bg-accent text-accent-foreground';
    return 'bg-destructive text-destructive-foreground';
  };

  const getFreshnessIcon = (status: string) => {
    if (status === 'Ripe') return '✓';
    if (status === 'Unripe') return '○';
    return '!';
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Fruit Name Header */}
      <Card className="p-6 text-center bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30">
        <h2 className="text-3xl font-bold text-primary">{result.fruitName}</h2>
      </Card>

      {/* Freshness Status */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-glow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-primary to-green-400">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">Freshness Status</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className={`px-6 py-3 rounded-full text-2xl font-bold ${getFreshnessColor(result.freshness.status)}`}>
              {getFreshnessIcon(result.freshness.status)} {result.freshness.status}
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-semibold text-muted-foreground">Key Indicators:</p>
            <ul className="space-y-2">
              {result.freshness.indicators.map((indicator, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Nutrient Information */}
      <Card className="p-6 bg-gradient-to-br from-accent/5 to-orange-50 border-2 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-warm">
            <Apple className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">Nutrient Profile</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Vitamins</p>
            <div className="flex flex-wrap gap-2">
              {result.nutrients.vitamins.map((vitamin, i) => (
                <Badge key={i} variant="secondary" className="bg-accent/10 text-accent-foreground">
                  {vitamin}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Minerals</p>
            <div className="flex flex-wrap gap-2">
              {result.nutrients.minerals.map((mineral, i) => (
                <Badge key={i} variant="secondary" className="bg-accent/10 text-accent-foreground">
                  {mineral}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Health Benefits</p>
            <ul className="space-y-2">
              {result.nutrients.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Shelf Life */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold">Shelf Life Estimate</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-4xl font-bold text-purple-600">{result.shelfLife.days} days</p>
            <p className="text-sm text-muted-foreground mt-1">Estimated remaining freshness</p>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-2">Storage Tips</p>
            <ul className="space-y-2">
              {result.shelfLife.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
