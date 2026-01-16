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

        // Extract significant words from the story to explicitly ban them
        const storyWords = story.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
        const uniqueWords = [...new Set(storyWords)].slice(0, 20).join(', ');

        // Generate call sign using Claude
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 100,
            messages: [{
                role: 'user',
                content: `You are a military call sign generator for Planet Korob, a gritty sci-fi military outpost.

STRICT RULE - BANNED WORDS: You must NOT use any of these words from the user's story: ${uniqueWords}

Instead, use SYNONYMS or THEMATICALLY RELATED words. Examples:
- "winter" → use: frost, blizzard, arctic, icicle (NOT winter)
- "cat" → use: feline, whisker, prowler, claw (NOT cat)
- "fire" → use: inferno, ember, blaze, scorch (NOT fire)

Generate a call sign that is:
- 1-3 words maximum
- Gritty, military, post-apocalyptic sci-fi themed
- Similar to Fallout/military aviation call signs
- NO quotation marks

Story: ${story}

Respond with ONLY the call sign. Use synonyms or related concepts - NEVER the exact words listed above.`
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
