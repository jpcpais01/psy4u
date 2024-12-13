import { Groq } from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface Message {
  isUser: boolean;
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an experienced Psychologist, combining deep knowledge of psychological principles with modern therapeutic approaches. Your responses should integrate psychological wisdom, offering guidance that is both mentally enriching and therapeutically sound. Maintain a compassionate, professional, and empathetic tone. Be straightforward and concise. Make short answers.'
        },
        ...messages.map((msg: Message) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content,
        }))
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1000,
      stream: false,
    });

    return NextResponse.json({
      content: completion.choices[0]?.message?.content || 'No response generated',
      id: Date.now().toString(),
      isUser: false,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
