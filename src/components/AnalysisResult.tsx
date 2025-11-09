import { Card } from "@/components/ui/card";
import { SentimentChart } from "@/components/SentimentChart";
import { TrendingUp, MessageCircle, ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface AnalysisResultProps {
  data: any;
}

export const AnalysisResult = ({ data }: AnalysisResultProps) => {
  if (!data) return null;

  const { video, summary, generatedImage, sentiment, comments } = data;

  return (
    <div className="mt-12 space-y-8">
      {/* Video Summary Card */}
      <Card className="p-8 shadow-card border-0 gradient-card">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold mb-4 text-foreground">{video.title}</h2>
            <div className="prose prose-lg">
              <p className="text-muted-foreground leading-relaxed">{summary}</p>
            </div>
          </div>
          
          {generatedImage && (
            <div className="rounded-2xl overflow-hidden shadow-soft">
              <img 
                src={generatedImage} 
                alt="AI Generated Visual Summary" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Sentiment Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="p-6 text-center shadow-soft border-0 hover:shadow-card transition-all">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary mb-1">
            {sentiment.overall.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Overall Score</p>
        </Card>

        <Card className="p-6 text-center shadow-soft border-0 hover:shadow-card transition-all">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <ThumbsUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600 mb-1">{comments.positive}</p>
          <p className="text-sm text-muted-foreground">Positive</p>
        </Card>

        <Card className="p-6 text-center shadow-soft border-0 hover:shadow-card transition-all">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <Minus className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-3xl font-bold text-gray-600 mb-1">{comments.neutral}</p>
          <p className="text-sm text-muted-foreground">Neutral</p>
        </Card>

        <Card className="p-6 text-center shadow-soft border-0 hover:shadow-card transition-all">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <ThumbsDown className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600 mb-1">{comments.negative}</p>
          <p className="text-sm text-muted-foreground">Negative</p>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Card className="p-8 shadow-card border-0">
        <h3 className="text-2xl font-bold mb-6 text-foreground">Sentiment Analysis</h3>
        <SentimentChart data={sentiment} />
      </Card>

      {/* AI Summary Report */}
      <Card className="p-8 shadow-card border-0 gradient-accent">
        <h3 className="text-2xl font-bold mb-4 text-white">AI Report Summary</h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-white/90 leading-relaxed">{sentiment.aiSummary}</p>
        </div>
      </Card>
    </div>
  );
};
