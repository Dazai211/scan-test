import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface ScannerProps {
  onScanComplete: (result: any) => void;
}

export const Scanner = ({ onScanComplete }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    await analyzeImage(file);
  };

  const analyzeImage = async (file: File) => {
    setIsScanning(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('analyze-fruit', {
          body: { image: base64Image }
        });

        if (error) throw error;
        
        onScanComplete(data);
        
        toast({
          title: 'Analysis complete!',
          description: 'Your fruit has been analyzed successfully',
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: 'Failed to analyze the fruit. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-glow">
      <div className="flex flex-col items-center gap-6">
        {preview ? (
          <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            {isScanning && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 text-white">
                  <Loader2 className="w-12 h-12 animate-spin" />
                  <p className="text-lg font-medium">Analyzing fruit...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full max-w-md aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center border-2 border-dashed border-primary/30">
            <div className="text-center p-8">
              <Camera className="w-20 h-20 mx-auto mb-4 text-primary/40" />
              <p className="text-lg text-muted-foreground">No image selected</p>
              <p className="text-sm text-muted-foreground mt-2">Upload a fruit image to begin analysis</p>
            </div>
          </div>
        )}

        <div className="flex gap-4 w-full max-w-md">
          <Button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isScanning}
            className="flex-1 h-14 text-lg font-semibold bg-gradient-fresh hover:opacity-90 transition-opacity shadow-lg"
          >
            <Camera className="w-5 h-5 mr-2" />
            Take Photo
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            variant="secondary"
            className="flex-1 h-14 text-lg font-semibold"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload
          </Button>
          
          {preview && !isScanning && (
            <Button
              onClick={() => {
                setPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                if (cameraInputRef.current) cameraInputRef.current.value = '';
              }}
              variant="outline"
              className="h-14 px-6 border-2 border-primary hover:bg-primary/5"
            >
              Clear
            </Button>
          )}
        </div>

        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          className="hidden"
        />
      </div>
    </Card>
  );
};
