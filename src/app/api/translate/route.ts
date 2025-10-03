import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { json, text, texts, targetLanguage, apiKey, strategy = 'single' } = await request.json();

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    if (!targetLanguage) {
      return NextResponse.json({ error: 'Target language is required' }, { status: 400 });
    }

    // Mock mode for testing - works for all strategies
    if (apiKey === 'dummy') {
      // Minimal API delay for mock mode
      await new Promise(resolve => setTimeout(resolve, 20));

      if (strategy === 'batch') {
        if (!texts || !Array.isArray(texts)) {
          return NextResponse.json({ error: 'Texts array is required for batch strategy' }, { status: 400 });
        }

        // Return the same texts (mock translation)
        return NextResponse.json({ translatedTexts: texts });
      } else if (strategy === 'text-only') {
        if (!text) {
          return NextResponse.json({ error: 'Text is required for text-only strategy' }, { status: 400 });
        }

        // Return the same text (mock translation)
        return NextResponse.json({ translatedText: text });
      } else {
        if (!json) {
          return NextResponse.json({ error: 'JSON data is required' }, { status: 400 });
        }

        // Return the same JSON (mock translation)
        return NextResponse.json({ translatedJson: json });
      }
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    if (strategy === 'batch') {
      // Handle batch text translation
      if (!texts || !Array.isArray(texts)) {
        return NextResponse.json({ error: 'Texts array is required for batch strategy' }, { status: 400 });
      }

      const prompt = `Translate the following texts to ${targetLanguage}.

IMPORTANT RULES:
1. Only translate the text content
2. Do NOT translate any text that looks like placeholders (e.g., [country_code], [something_underscored], etc.)
3. Do NOT translate any text that starts with __PLACEHOLDER_ and ends with __
4. Return the translated texts in the same order as input
5. Return only the translated texts, one per line, no additional formatting

Texts to translate:
${texts.map((t, i) => `${i + 1}. ${t}`).join('\n')}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional text translator. You translate text content while protecting placeholders. You always return only the translated texts, one per line.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      });

      const translatedContent = completion.choices[0]?.message?.content;

      if (!translatedContent) {
        throw new Error('No translation received from OpenAI');
      }

      // Split the response into individual translations
      const translatedTexts = translatedContent.trim().split('\n').map(line => line.replace(/^\d+\.\s*/, '').trim());

      return NextResponse.json({ translatedTexts });
    } else if (strategy === 'text-only') {
      // Handle individual text translation
      if (!text) {
        return NextResponse.json({ error: 'Text is required for text-only strategy' }, { status: 400 });
      }

      const prompt = `Translate the following text to ${targetLanguage}.

IMPORTANT RULES:
1. Only translate the text content
2. Do NOT translate any text that looks like placeholders (e.g., [country_code], [something_underscored], etc.)
3. Do NOT translate any text that starts with __PLACEHOLDER_ and ends with __
4. Return only the translated text, no additional formatting

Text to translate:
${text}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional text translator. You translate text content while protecting placeholders. You always return only the translated text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const translatedText = completion.choices[0]?.message?.content;

      if (!translatedText) {
        throw new Error('No translation received from OpenAI');
      }

      return NextResponse.json({ translatedText: translatedText.trim() });
    } else {
      // Handle full JSON translation
      if (!json) {
        return NextResponse.json({ error: 'JSON data is required' }, { status: 400 });
      }

      // Convert JSON to a format suitable for translation
      const jsonString = JSON.stringify(json, null, 2);

      const prompt = `Translate the following JSON content to ${targetLanguage}.

IMPORTANT RULES:
1. Preserve the EXACT JSON structure and formatting - arrays must stay arrays, objects must stay objects
2. Only translate string values, not keys
3. Do NOT translate any text that looks like placeholders (e.g., [country_code], [something_underscored], etc.)
4. Do NOT translate any text that starts with __PLACEHOLDER_ and ends with __
5. Keep all JSON syntax intact (quotes, brackets, commas, etc.)
6. Return only the translated JSON, no additional text
7. NEVER convert arrays to objects or change data types

JSON to translate:
${jsonString}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional JSON translator. You translate JSON content while preserving EXACT structure and protecting placeholders. You always return valid JSON with the same structure as input.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
      });

      const translatedContent = completion.choices[0]?.message?.content;

      if (!translatedContent) {
        throw new Error('No translation received from OpenAI');
      }

      // Parse the translated JSON to ensure it's valid
      let translatedJson;
      try {
        translatedJson = JSON.parse(translatedContent);
      } catch (parseError) {
        // If parsing fails, try to extract JSON from the response
        const jsonMatch = translatedContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          translatedJson = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Invalid JSON received from translation service');
        }
      }

      return NextResponse.json({ translatedJson });
    }

  } catch (error) {
    console.error('Translation error:', error);

    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ error: 'Invalid OpenAI API key' }, { status: 401 });
      }
      if (error.message.includes('quota')) {
        return NextResponse.json({ error: 'OpenAI API quota exceeded' }, { status: 429 });
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json({ error: 'Rate limit exceeded. Please try again later.' }, { status: 429 });
      }
    }

    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Translation failed'
    }, { status: 500 });
  }
}
