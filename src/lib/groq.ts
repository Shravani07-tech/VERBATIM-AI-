import Groq from 'groq-sdk';

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

let groqClient: Groq | null = null;

if (GROQ_API_KEY) {
  try {
    groqClient = new Groq({ apiKey: GROQ_API_KEY });
  } catch (error) {
    console.error('Failed to initialize Groq client:', error);
  }
}

export function isGroqConfigured(): boolean {
  return Boolean(groqClient && GROQ_API_KEY && GROQ_API_KEY.trim() !== '');
}

export async function callGroqLLM(
  prompt: string,
  systemPrompt: string = 'You are an expert AI fact checker. Respond strictly in valid JSON.',
  temperature: number = 0.1
): Promise<string | null> {
  if (!groqClient) {
    return null;
  }

  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: GROQ_MODEL,
      response_format: { type: 'json_object' },
      temperature,
    });

    return completion.choices[0]?.message?.content || null;
  } catch (error) {
    console.error(`Groq API call error using model ${GROQ_MODEL}:`, error);
    
    // Fallback to llama-3.1-8b-instant if model error occurs
    if (GROQ_MODEL !== 'llama-3.1-8b-instant') {
      try {
        const fallbackCompletion = await groqClient.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt },
          ],
          model: 'llama-3.1-8b-instant',
          response_format: { type: 'json_object' },
          temperature,
        });
        return fallbackCompletion.choices[0]?.message?.content || null;
      } catch (fallbackErr) {
        console.error('Groq fallback model error:', fallbackErr);
      }
    }
    return null;
  }
}
