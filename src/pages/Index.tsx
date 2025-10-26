import { useState } from 'react';
import { Scanner } from '@/components/Scanner';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Leaf } from 'lucide-react';

const Index = () => {
  const [scanResult, setScanResult] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-green-400 shadow-glow">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              ScanFresh
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-Time Fruit Freshness & Nutrient Estimation Scanner
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Powered by AI • Instant Analysis • Smart Storage Tips
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-8">
          <Scanner onScanComplete={setScanResult} />
          
          {scanResult && <ResultsDisplay result={scanResult} />}

          {!scanResult && (
            <div className="text-center py-12 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="p-6 rounded-2xl bg-white/50 backdrop-blur border border-primary/10">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Leaf className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Freshness Check</h3>
                  <p className="text-sm text-muted-foreground">
                    AI analyzes color, texture, and appearance to determine freshness
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/50 backdrop-blur border border-accent/10">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                    <Leaf className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Nutrient Info</h3>
                  <p className="text-sm text-muted-foreground">
                    Get detailed vitamin, mineral, and health benefit information
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/50 backdrop-blur border border-purple-200">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <Leaf className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Shelf Life</h3>
                  <p className="text-sm text-muted-foreground">
                    Estimates remaining days with smart storage recommendations
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
