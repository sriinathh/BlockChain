import React, { useState, useRef, useEffect } from 'react';
import { FiCpu, FiSend } from 'react-icons/fi';

const suggestions = [
  "How can I stake MBT tokens?",
  "What are the interest rates for loans?",
  "How does AI detect fraudulent transactions?",
  "What benefits do premium NFT cards offer?"
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your MetaBank AI Assistant. I can analyze your portfolio growth, guide you through staking/loans, or answer any security concerns. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, I encountered an error communicating with the agent.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection timed out. Please verify server is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bank-card p-6 border-slate-800 bg-slate-900/40 relative flex items-center justify-between">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
        <div className="flex items-center gap-3">
          <FiCpu className="text-3xl text-cyan-400 animate-pulse" />
          <div>
            <h2 className="text-xl font-bold text-white">AI Assistant Chat</h2>
            <p className="text-xs text-slate-500">Ask questions about loan eligibility, staking yields, or transaction safety.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Quick actions panel */}
        <aside className="lg:col-span-1 bank-card p-5 border-slate-800 bg-slate-900/30 h-fit space-y-3">
          <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Suggested Inquiries</h4>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(sug)}
              className="w-full p-2.5 rounded-lg border border-slate-800 hover:border-cyan-500/30 bg-slate-950/40 hover:bg-cyan-500/5 text-left text-slate-400 hover:text-white transition-all text-xs leading-snug"
              disabled={loading}
            >
              {sug}
            </button>
          ))}
        </aside>

        {/* Chat Thread */}
        <div className="lg:col-span-3 bank-card border-slate-800 bg-slate-900/30 flex flex-col h-[500px]">
          
          {/* Thread body */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                  msg.role === 'user' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25' : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}>
                  {msg.role === 'user' ? 'U' : 'AI'}
                </div>
                <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/20 rounded-tr-none' 
                    : 'bg-slate-950/60 text-slate-300 border border-slate-900 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-slate-500 border border-slate-800 animate-pulse">
                  AI
                </div>
                <div className="p-3 rounded-2xl bg-slate-950/60 text-slate-500 border border-slate-900 rounded-tl-none text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input */}
          <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-800 bg-slate-950/60 flex gap-2">
            <input 
              type="text" 
              placeholder="Ask AI anything..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="glass-input text-xs" 
              required 
              disabled={loading}
            />
            <button 
              type="submit" 
              className="btn-primary p-3 rounded-lg flex items-center justify-center text-base"
              disabled={loading}
            >
              <FiSend />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
