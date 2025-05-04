export interface ErrorItem {
  // Original format
  "خطأ"?: string;
  // Alternative format
  "الكلمة_الخاطئة"?: string;
  "الكلمة الخاطئة"?: string;
  // Common fields that can use either space or underscore
  "نوع الخطأ"?: string;
  "نوع_الخطأ"?: string;
  "تصحيح الكلمة"?: string;
  "تصحيح_الكلمة"?: string;
}

export type WatsonResponse = ErrorItem[];

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class TextAnalysisAPI {
  async generateText(prompt: string): Promise<WatsonResponse> {
    const response = await fetch('/api/watson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate text');
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    
    try {
      // First try to parse as is - it might already be valid JSON
      return JSON.parse(text);
    } catch {
      // If not valid JSON, try to format it
      try {
        // Convert the text to proper JSON array format
        const formattedText = `[${text.replace(/}\s*,\s*{/g, '}, {').replace(/}(\s*){/g, '}, {')}]`;
        return JSON.parse(formattedText);
      } catch {
        // If still not valid, try to extract JSON objects
        const jsonObjects = [];
        const regex = /{[^{}]*}/g;
        let match;
        
        while ((match = regex.exec(text)) !== null) {
          try {
            const jsonObj = JSON.parse(match[0]);
            jsonObjects.push(jsonObj);
          } catch {
            console.error('Failed to parse JSON object:', match[0]);
          }
        }
        
        if (jsonObjects.length > 0) {
          return jsonObjects;
        }
        
        throw new Error('Failed to parse response as JSON');
      }
    }
  }

  async generateSynonyms(text: string): Promise<OpenAIResponse> {
    const response = await fetch('/api/watson/synonyms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: process.env.NEXT_PUBLIC_PARA_PROMPT + text 
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate synonyms');
    }

    return response.json();
  }
}

export const watsonApi = new TextAnalysisAPI();

// Export environment variables
export const PARA_PROMPT = process.env.NEXT_PUBLIC_PARA_PROMPT || 'أعد صياغة الجملة التالية بخمس طرق غير متشابهة واجعل كل جملة في سطر جديد :';
