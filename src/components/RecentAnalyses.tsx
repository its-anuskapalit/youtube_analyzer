import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Clock, TrendingUp } from "lucide-react";

export const RecentAnalyses = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("video_analyses")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error("Error fetching analyses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Recent Analyses</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (analyses.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-foreground">Recent Analyses</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {analyses.map((analysis) => (
          <Card
            key={analysis.id}
            className="p-6 shadow-soft border-0 hover:shadow-card transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-foreground line-clamp-2 flex-1">
                {analysis.title || "Untitled Video"}
              </h4>
              <div className="ml-2 px-2 py-1 rounded-full bg-primary/10 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {analysis.sentiment_score?.toFixed(0)}%
                </span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {analysis.summary}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(analysis.created_at).toLocaleDateString()}
              </div>
              <div>
                {analysis.total_comments} comments
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
