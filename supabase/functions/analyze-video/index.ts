import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();
    console.log("Analyzing video:", videoUrl);

    // Extract video ID from URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error("Invalid YouTube URL");
    }

    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    // Fetch video details
    const videoResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const videoData = await videoResponse.json();
    
    if (!videoData.items || videoData.items.length === 0) {
      throw new Error("Video not found");
    }

    const video = videoData.items[0];
    const title = video.snippet.title;
    const description = video.snippet.description;

    // Fetch comments
    const commentsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=100&key=${YOUTUBE_API_KEY}`
    );
    const commentsData = await commentsResponse.json();
    const comments = commentsData.items?.map((item: any) => 
      item.snippet.topLevelComment.snippet.textDisplay
    ) || [];

    // Generate summary with AI
    const summaryResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a video content analyzer. Create concise, engaging summaries.",
          },
          {
            role: "user",
            content: `Summarize this YouTube video in 2-3 sentences:\nTitle: ${title}\nDescription: ${description}`,
          },
        ],
      }),
    });
    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    // Generate image with AI
    const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: `Create a beautiful, modern social media post image related to: ${title}. Style: minimalist, professional, eye-catching`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });
    const imageData = await imageResponse.json();
    const generatedImage = imageData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    // Analyze sentiment with AI
    const sentimentResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a sentiment analysis expert. Analyze comments and provide detailed insights.",
          },
          {
            role: "user",
            content: `Analyze the sentiment of these comments and provide: 
1. Count of positive, neutral, negative comments
2. Overall sentiment percentage (0-100)
3. A brief summary of audience reaction

Comments: ${comments.slice(0, 50).join(" | ")}

Respond in JSON format: {"positive": number, "neutral": number, "negative": number, "overall": number, "summary": "text"}`,
          },
        ],
      }),
    });
    const sentimentData = await sentimentResponse.json();
    const sentimentText = sentimentData.choices[0].message.content;
    const sentiment = JSON.parse(sentimentText.match(/\{[\s\S]*\}/)?.[0] || "{}");

    // Store in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { error: dbError } = await supabase.from("video_analyses").insert({
      video_id: videoId,
      video_url: videoUrl,
      title,
      summary,
      generated_image_url: generatedImage,
      sentiment_score: sentiment.overall,
      total_comments: comments.length,
      positive_count: sentiment.positive,
      neutral_count: sentiment.neutral,
      negative_count: sentiment.negative,
      sentiment_details: sentiment,
    });

    if (dbError) console.error("DB Error:", dbError);

    return new Response(
      JSON.stringify({
        video: { title, description },
        summary,
        generatedImage,
        sentiment: {
          overall: sentiment.overall || 0,
          breakdown: {
            positive: sentiment.positive || 0,
            neutral: sentiment.neutral || 0,
            negative: sentiment.negative || 0,
          },
          aiSummary: sentiment.summary || "Analysis complete",
        },
        comments: {
          total: comments.length,
          positive: sentiment.positive || 0,
          neutral: sentiment.neutral || 0,
          negative: sentiment.negative || 0,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}
