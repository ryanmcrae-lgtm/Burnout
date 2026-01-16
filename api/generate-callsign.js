const Anthropic = require('@anthropic-ai/sdk');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { story } = JSON.parse(event.body);

        if (!story || story.trim().length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Story is required' })
            };
        }

        // Initialize Anthropic client with API key from environment variable
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });

        // Generate call sign using Claude
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: `You are a military call sign generator for Planet Korob, a gritty sci-fi military outpost. Based on the following story, generate a unique call sign that is:
- 1-3 words maximum
- Mix of military, personality traits, and sci-fi themes
- Gritty and fitting for a post-apocalyptic wasteland setting
- Similar to Fallout/military aviation call signs
- Do NOT use quotation marks
- CRITICAL: Do NOT use any exact words from the story. Instead, use synonyms, related concepts, or thematically associated words. For example, if the story mentions "winter", use words like "frost", "blizzard", "arctic", or "flake" - never "winter" itself.

Story: ${story}

Respond with ONLY the call sign, nothing else. Make it memorable and badass. Remember: no words directly from the story - only synonyms or associated terms.`
            }]
        });

        const callsign = message.content[0].text.trim().toUpperCase();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ callsign })
        };

    } catch (error) {
        console.error('Error generating call sign:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to generate call sign',
                details: error.message
            })
        };
    }
};
