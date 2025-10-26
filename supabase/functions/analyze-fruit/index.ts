const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error('No image provided');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Analyzing fruit image with AI...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert fruit analyzer. Analyze fruit images and provide detailed, consistent information about:
1. Identify the specific fruit type/name
2. Freshness status - must be EXACTLY one of: "Ripe", "Unripe", or "Overripe"
3. Visual freshness indicators (be specific and consistent for each fruit type)
4. Nutrients (vitamins, minerals, health benefits - based on the specific fruit)
5. Shelf life estimation in days with storage tips

IMPORTANT: Be consistent in your analysis. For the same fruit in similar condition, provide similar assessments.

Respond ONLY with valid JSON in this exact format:
{
  "fruitName": "Apple",
  "freshness": {
    "status": "Ripe",
    "indicators": ["Vibrant red color", "Firm texture", "No blemishes", "Smooth skin"]
  },
  "nutrients": {
    "vitamins": ["Vitamin C", "Vitamin A", "Vitamin K"],
    "minerals": ["Potassium", "Fiber", "Calcium"],
    "benefits": ["Boosts immunity", "Supports digestion", "Heart health"]
  },
  "shelfLife": {
    "days": 7,
    "tips": ["Store in refrigerator", "Keep away from ethylene-producing fruits", "Wash before eating"]
  }
}

Remember: status must be "Ripe", "Unripe", or "Overripe" ONLY.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Identify this fruit and analyze its freshness status (Ripe/Unripe/Overripe), nutrients, and shelf life estimation. Be consistent in your analysis.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log('AI Response received:', aiResponse);

    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No content in AI response');
    }

    // Parse the JSON response from AI (strip markdown code blocks if present)
    let jsonContent = content.trim();
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    }
    const result = JSON.parse(jsonContent);

    console.log('Analysis complete:', result);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-fruit function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
