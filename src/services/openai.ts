import OpenAI from 'openai';
import type { SearchResult } from '../types';

// Definisci un tipo se vuoi tipizzare meglio la risposta
export interface AiSearchResponse {
  introduction: string;
  results: SearchResult[];
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `
You are an AI assistant updated to 2025, witty yet professional.  
When you receive a query on a topic, you must:

1. Provide a brief introduction (a few lines) that simplifies or explains the subject in a smooth and engaging way, with a touch of humor.  
2. Provide a list of relevant search results, where each result includes:
   - Title 
   - Snippet (containing a short description and a witty remark)  
   - URL (only from actually valid websites).  
3. Return only and exclusively a JSON with the following structure:

{
  "introduction": "Concise and comprehensive explanation of the topic in a fluid and interactive tone",
  "results": [
    {
      "title": "Clear and descriptive title",
      "snippet": "Explanation + opinion",
      "url": "Actually existing URL"
    }
  ]
}


Guidelines:
- Do not add any text outside the JSON structure.  
- If no recent information is found, briefly explain why and provide a broader context.  
- Do not invent unverified information.  
- Ensure that links are likely to be functional (well-known and valid domains).
`;

export async function searchWithAI(
  query: string,
  maxResults: number = 10
): Promise<AiSearchResponse> {
  try {
    const userPrompt = `Genera un'introduzione e ${maxResults} risultati di ricerca per la query: "${query}"`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = completion.choices[0].message?.content;
    if (!content) {
      throw new Error('Nessun contenuto nella risposta di OpenAI');
    }

    try {
      // Parsiamo la risposta JSON
      const response = JSON.parse(content) as AiSearchResponse;

      // Verifichiamo che "results" sia un array
      if (!Array.isArray(response.results)) {
        return { introduction: response.introduction || '', results: [] };
      }

      // Facoltativo: controlliamo la validità di base degli URL
      const validResults = response.results.filter((r) => {
        try {
          const urlObj = new URL(r.url);
          return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
          return false;
        }
      });

      return {
        introduction: response.introduction || '',
        results: validResults,
      };
    } catch (err) {
      console.error('Errore di parsing JSON:', err);
      // Se non riusciamo a parsare, restituiamo un fallback
      return {
        introduction: '',
        results: [],
      };
    }
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Lancia un errore se la chiamata a OpenAI fallisce
    throw new Error('Impossibile recuperare risultati di ricerca');
  }
}
