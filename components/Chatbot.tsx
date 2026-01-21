import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Olá! Sou a IA da AutoForce. Como posso ajudar a otimizar sua performance hoje?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    // Add current message to history for the API call
    history.push({ role: 'user', parts: [{ text: userMsg.text }] });

    try {
      const responseText = await sendMessageToGemini(userMsg.text, history, useThinking);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        isThinking: useThinking
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`pointer-events-auto w-[380px] sm:w-[450px] bg-autoforce-darkest border border-autoforce-blue shadow-2xl rounded-lg overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 mb-4' : 'scale-0 opacity-0 h-0 mb-0'}`}
      >
        {/* Header */}
        <div className="bg-autoforce-blue p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-full">
               <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-tight">AutoForce AI</h3>
              <p className="text-xs text-blue-200">Gemini 3 Pro Preview</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded transition">
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-autoforce-black/90 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-lg p-3 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-autoforce-blue text-white rounded-br-none' 
                    : 'bg-autoforce-grey/30 border border-autoforce-grey/50 text-gray-100 rounded-bl-none'
                }`}
              >
                {msg.isThinking && (
                    <div className="flex items-center gap-1 text-xs text-autoforce-accent mb-1 font-bold uppercase tracking-wider">
                        <BrainCircuit size={12} />
                        Análise Profunda
                    </div>
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-autoforce-grey/30 border border-autoforce-grey/50 p-3 rounded-lg rounded-bl-none flex items-center gap-2">
                {useThinking ? (
                    <>
                         <BrainCircuit className="animate-pulse text-autoforce-accent" size={16} />
                         <span className="text-autoforce-accent text-xs font-semibold">Pensando...</span>
                    </>
                ) : (
                    <>
                        <Loader2 className="animate-spin text-autoforce-lightGrey" size={16} />
                        <span className="text-autoforce-lightGrey text-xs">Digitando...</span>
                    </>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-autoforce-darkest border-t border-autoforce-grey/30">
          
          {/* Thinking Toggle */}
          <div className="flex items-center justify-between mb-2 px-1">
             <button 
                onClick={() => setUseThinking(!useThinking)}
                className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-all ${useThinking ? 'bg-autoforce-accent text-black font-bold' : 'text-autoforce-lightGrey hover:text-white'}`}
                title="Ativar modo de pensamento profundo para análises complexas"
             >
                <Cpu size={14} />
                {useThinking ? 'Modo Análise: ATIVADO' : 'Modo Análise'}
             </button>
             <span className="text-[10px] text-autoforce-grey uppercase tracking-widest">Powered by Google Gemini</span>
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pergunte sobre as métricas..."
              className="flex-1 bg-autoforce-black border border-autoforce-grey text-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-autoforce-blue focus:ring-1 focus:ring-autoforce-blue"
            />
            <button 
              type="submit" 
              disabled={!inputValue.trim() || isLoading}
              className="bg-autoforce-blue hover:bg-autoforce-secondary disabled:bg-autoforce-grey text-white p-2 rounded-md transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
            isOpen ? 'bg-autoforce-grey text-white rotate-90' : 'bg-gradient-to-r from-autoforce-blue to-autoforce-secondary text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};

export default Chatbot;
