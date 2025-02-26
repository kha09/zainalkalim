import { NextResponse } from 'next/server';

async function generateSynonyms(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  const url = "https://api.openai.com/v1/chat/completions";

  console.log('Sending prompt to OpenAI:', prompt);

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`
  };

  const body = {
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "أنت خبير في اللغة العربية. مهمتك هي إعادة صياغة النص المقدم بطرق مختلفة مع الحفاظ على المعنى الأصلي."
      },
      {
        "role": "user",
        "content": prompt
      }
    ],
    "temperature": 0.7
  };

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    console.error('OpenAI API error:', await response.text());
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const result = await response.json();
  console.log('OpenAI API response:', result);
  return result;
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const result = await generateSynonyms(prompt);

    console.log('Sending response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
