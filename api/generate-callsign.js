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
                content: `Based on this story, generate a single-word military call sign that relates to the content or themes in the story.

CRITICAL RULES:
- Output ONLY ONE WORD
- Must be either a VERB or a NOUN
- Must relate to something in the story (theme, action, object, emotion, situation)
- No explanations, no preambles, no additional text
- Examples: EMBER, RUST, GHOST, WRENCH, STATIC, GRIND

Story: ${story}`
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
