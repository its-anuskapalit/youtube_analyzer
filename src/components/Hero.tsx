import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface HeroProps {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: any) => void;
}

export const Hero = ({ onAnalysisStart, onAnalysisComplete }: HeroProps) => {
  const [videoUrl, setVideoUrl] = useState("");
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a YouTube video URL",
        variant: "destructive",
      });
      return;
    }

    onAnalysisStart();

    try {
      const { data, error } = await supabase.functions.invoke("analyze-video", {
        body: { videoUrl },
      });

      if (error) throw error;

      onAnalysisComplete(data);
      
      toast({
        title: "Analysis Complete!",
        description: "Your video has been analyzed successfully",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze video",
        variant: "destructive",
      });
      onAnalysisComplete(null);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-12 gradient-hero shadow-glow">
      <div className="relative z-10 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-sm font-medium text-white">AI-Powered Analysis</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Moodify
        </h1>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Analyze YouTube videos and understand audience sentiment with AI
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <Input
              type="url"
              placeholder="Paste YouTube video or shorts URL..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 bg-white/95 border-0 h-14 text-lg px-6 rounded-2xl shadow-soft"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <Button
              onClick={handleAnalyze}
              size="lg"
              className="h-14 px-8 rounded-2xl bg-white text-primary hover:bg-white/90 shadow-soft font-semibold"
            >
              Analyze
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" style={{ animationDelay: '2s' }}></div>
    </div>
  );
};
