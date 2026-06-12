// @ts-nocheck
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Send, User, Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PixieAI() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Pixie AI. I have access to all of Pixie's medical records, timelines, and documents. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || response.statusText);
      }

      // Create a new assistant message
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(msgs => [...msgs, { id: assistantMessageId, role: 'assistant', content: '' }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      
      while (reader && !done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          // In the newest AI SDK, the text stream might be plain text or "0:text\n" protocol.
          // We will extract just the text if it uses the protocol, or just append the raw chunk.
          // Usually toTextStreamResponse() streams raw text or data chunks.
          // We'll append the raw chunk, but filter out `0:` protocol if it exists
          let textChunk = chunk;
          if (chunk.startsWith('0:')) {
            textChunk = chunk.split('\n').map(line => line.startsWith('0:') ? line.substring(3, line.length - 1).replace(/\\\\n/g, '\\n') : '').join('');
          }

          setMessages(msgs => msgs.map(m => m.id === assistantMessageId ? { ...m, content: m.content + textChunk } : m));
        }
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "An unexpected error occurred.";
      setMessages(msgs => [...msgs, { id: Date.now().toString(), role: 'assistant', content: `⚠️ **Error:** ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = [
    "When is Pixie's next vaccine?",
    "What medications has she taken?",
    "When did her eye swelling happen?",
    "Who is her vet?"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 rounded-xl text-white shadow-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pixie AI</h1>
            <p className="text-slate-500 mt-1">Ask anything about Pixie&apos;s health and history.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6 pb-20">
            {messages.map(m => (
              <div key={m.id} className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  {m.role === 'user' ? (
                    <>
                      <AvatarFallback className="bg-slate-100 text-slate-600"><User className="h-4 w-4" /></AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarFallback className="bg-amber-100 text-amber-600"><Bot className="h-4 w-4" /></AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-amber-600 text-white rounded-tr-sm' 
                    : 'bg-slate-50 text-slate-800 rounded-tl-sm border border-slate-100'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 max-w-[85%]">
                <Avatar className="h-8 w-8 shrink-0 mt-1">
                  <AvatarFallback className="bg-amber-100 text-amber-600"><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 rounded-tl-sm flex items-center gap-1">
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="absolute bottom-24 left-0 right-0 px-6 hidden md:block">
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>)}
                  className="bg-white border border-slate-200 text-slate-600 text-sm px-4 py-2 rounded-full hover:bg-slate-50 hover:border-amber-200 hover:text-amber-600 transition-colors shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-white border-t border-slate-100 shrink-0">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about Pixie's records..."
              className="flex-1 rounded-xl h-12 bg-slate-50 border-transparent focus-visible:bg-white focus-visible:ring-amber-500/20 focus-visible:border-amber-500"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !input.trim()} 
              className="h-12 w-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shrink-0 p-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
