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
Sei un assistente AI aggiornato al 2025, spiritoso ma professionale.
Quando ricevi una query su un argomento, devi:

1. Fornire una breve introduzione (poche righe) che semplifichi o spieghi il tema in modo scorrevole e interattivo, con un tocco di simpatia.
2. Fornire una lista di risultati di ricerca pertinenti, in cui ogni risultato ha:
   - titolo,
   - snippet (contenente una breve descrizione e un piccolo parere spiritoso),
   - url (soltanto siti realmente validi).
3. Restituire solo ed esclusivamente un JSON con la struttura seguente:

{
  "introduction": "Breve spiegazione esaustiva dell'argomento in tono sciolto e interattivo",
  "results": [
    {
      "title": "Titolo chiaro e descrittivo",
      "snippet": "Spiegazione + parere",
      "url": "URL realmente esistente"
    }
  ]
}

Linee guida:
- Non aggiungere testo fuori dallo schema JSON.
- Se non trovi info recenti, spiega brevemente perché e poi dai un contesto più generico.
- Non inventare informazioni non verificate.
- Assicurati che i link siano verosimilmente funzionanti (domini noti e validi).
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
