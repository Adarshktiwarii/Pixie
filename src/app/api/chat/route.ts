// @ts-nocheck
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const mockResponse = "I'm currently running in **demo mode** because an OpenAI API key is not configured. I can't generate dynamic answers right now, but you can explore my UI or manage Pixie's records using the Dashboard and Vault!";
          
          // Stream the response in chunks
          const words = mockResponse.split(" ");
          for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            controller.enqueue(encoder.encode(words[i] + " "));
          }
          controller.close();
        }
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    // Call the language model
    const result = streamText({
      model: openai('gpt-4o'),
      system: `You are Pixie AI, a friendly, professional, and knowledgeable AI companion for Pixie, an English Golden Retriever born April 10, 2026. 
You act as a digital health passport assistant. You help the owner understand Pixie's health records, growth, timeline, and reminders.
Always be encouraging, precise, and clear. Format your answers using markdown when appropriate.`,
      messages,
    });

    // Respond with the stream
    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred during the chat request." }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
