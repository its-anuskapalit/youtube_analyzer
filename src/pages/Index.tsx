import { useState } from "react";
import { Hero } from "@/components/Hero";
import { AnalysisResult } from "@/components/AnalysisResult";
import { RecentAnalyses } from "@/components/RecentAnalyses";

const Index = () => {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (data: any) => {
    setAnalysisData(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Hero 
          onAnalysisStart={() => setIsAnalyzing(true)}
          onAnalysisComplete={handleAnalysisComplete}
        />
        
        {isAnalyzing && (
          <div className="mt-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Analyzing video with AI...</p>
          </div>
        )}
        
        {analysisData && !isAnalyzing && (
          <AnalysisResult data={analysisData} />
        )}
        
        <RecentAnalyses />
      </div>
    </div>
  );
};

export default Index;
