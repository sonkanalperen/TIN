import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Bot } from 'lucide-react';
import { useDeepAI } from './DeepAIProvider';
import { askThinkingTIN, generateDeepGreeting } from '../services/geminiService';

interface ChatMessage {
  role: 'user' | 'model' | 'system';
  text: string;
}

const Chat: React.FC = () => {
  const { userStats } = useDeepAI();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial greeting
    const greeting = generateDeepGreeting(userStats);
    setMessages([{ role: 'model', text: greeting }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      // "Gizemli Rehber" persona adaptation in the service call or post-processing could be done here.
      // Assuming askThinkingTIN handles the API call.
      const response = await askThinkingTIN(userText, userStats.archetype || 'Seeker');
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'system', text: "Bağlantı koptu. Sinyal zayıf." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 no-scrollbar">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`
              max-w-[85%] md:max-w-[70%] p-4 rounded-2xl backdrop-blur-sm border
              ${msg.role === 'user' 
                ? 'bg-[var(--primary)]/10 border-[var(--primary)]/20 text-[var(--text)] rounded-tr-none' 
                : 'bg-[var(--accent)]/50 border-[var(--text)]/10 text-[var(--text)] rounded-tl-none'}
            `}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-2 text-[var(--primary)] text-xs uppercase tracking-widest font-bold opacity-70">
                  <Bot size={14} />
                  <span>Kahin</span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed font-serif-display text-lg">
                {msg.text}
              </p>
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-[var(--accent)]/30 p-4 rounded-2xl rounded-tl-none flex gap-2 items-center">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce delay-100" />
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce delay-200" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative mt-auto">
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] to-transparent -top-20 pointer-events-none" />
        <div className="relative bg-[var(--accent)]/20 border border-[var(--primary)]/30 rounded-3xl p-2 flex items-center shadow-[0_0_30px_rgba(0,255,65,0.05)] transition-all focus-within:shadow-[0_0_50px_rgba(0,255,65,0.15)] focus-within:border-[var(--primary)]/60">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Hakikati sor..."
            className="flex-1 bg-transparent border-none outline-none text-[var(--text)] placeholder-[var(--text)]/30 px-6 py-4 text-xl font-medium"
            autoFocus
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-4 bg-[var(--primary)] text-[var(--bg)] rounded-2xl hover:bg-[var(--primary)]/90 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTyping ? <Sparkles size={24} className="animate-spin" /> : <Send size={24} />}
          </button>
        </div>
        <p className="text-center text-[var(--text)]/20 text-xs mt-4 font-mono uppercase tracking-[0.2em]">
          TIN v21.0 // Neural Interface Active
        </p>
      </div>
    </div>
  );
};

export default Chat;
