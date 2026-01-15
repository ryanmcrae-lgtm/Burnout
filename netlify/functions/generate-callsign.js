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
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: `Generate ONE SINGLE WORD military call sign from this story. ONE WORD ONLY - no spaces, no hyphens, no multiple words.

Examples of correct format: EMBER, RUST, GHOST, WRENCH, STATIC, GRIND, PLANE, FLIGHT, BIRD

The word must relate to something in the story.

Story: ${story}

Output format: ONE_WORD_ONLY`
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
