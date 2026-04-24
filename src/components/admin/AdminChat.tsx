import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Check, Shield, Search, Plus, Trash2 } from 'lucide-react';
import { ALLOWED_MODELS, CHAT_HISTORY } from '@/data/mockData';
import { useClickOutside } from '@/hooks/use-click-outside';
import chatgptIcon from '@/components/ui/chatgpt_PNG14.webp';
import geminiIcon from '@/components/ui/gemini-color.webp';
import claudeIcon from '@/components/ui/claude-color.webp';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: string;
  blocked?: boolean;
  blockReason?: string;
  blockDetail?: string;
  piiScrubbed?: boolean;
}

export default function AdminChat() {
  const [selectedModel, setSelectedModel] = useState(ALLOWED_MODELS[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const sidecarOnline = true;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const modelPickerRef = useClickOutside(() => setShowModelPicker(false));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg: Message = { id: `m-${Date.now()}`, role: 'user', content: inputValue };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');

    setIsTyping(true);
    const responses = [
      "As an administrator, you have full visibility into model performance and policy enforcement. Based on your current request, I have analyzed the relevant security parameters.",
      "The Foretyx gateway is currently optimized for your organization's compliance requirements. Your prompt has been processed through the secure inspection layer.",
      "I have analyzed the gateway audit logs for the past 24 hours. There are no critical anomalies detected, and all traffic is flowing through the sidecar successfully."
    ];

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        model: selectedModel.name
      }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col min-w-0 bg-background/50 rounded-2xl border border-border/50 overflow-hidden shadow-sm">
      {/* Top bar */}
      <div className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground leading-none">Admin Chat</h3>
            </div>
          </div>
          
          <div className="h-4 w-[1px] bg-border mx-2" />
          
          <div className="relative" ref={modelPickerRef}>
            <button onClick={() => setShowModelPicker(!showModelPicker)} className="flex items-center gap-2 h-8 px-3 rounded-full bg-muted text-xs text-foreground hover:bg-muted/80 transition">
              {selectedModel.provider === 'Anthropic' ? (
                <img src={claudeIcon} alt="Claude" className="w-3.5 h-3.5 rounded-sm object-contain" />
              ) : selectedModel.provider === 'OpenAI' ? (
                <img src={chatgptIcon} alt="ChatGPT" className="w-3.5 h-3.5 rounded-sm object-contain" />
              ) : selectedModel.provider === 'Google' ? (
                <img src={geminiIcon} alt="Gemini" className="w-3.5 h-3.5 rounded-sm object-contain" />
              ) : (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedModel.color }} />
              )}
              <span className="font-semibold tracking-tight">{selectedModel.name}</span>
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </button>
            {showModelPicker && (
              <div className="absolute top-full mt-1 left-0 w-56 glass-card rounded-lg border border-border py-1 z-[100] animate-dropdown-reveal origin-top-left shadow-xl">
                {ALLOWED_MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition"
                  >
                    {m.provider === 'Anthropic' ? (
                      <img src={claudeIcon} alt="Claude" className="w-3.5 h-3.5 rounded-sm object-contain" />
                    ) : m.provider === 'OpenAI' ? (
                      <img src={chatgptIcon} alt="ChatGPT" className="w-3.5 h-3.5 rounded-sm object-contain" />
                    ) : m.provider === 'Google' ? (
                      <img src={geminiIcon} alt="Gemini" className="w-3.5 h-3.5 rounded-sm object-contain" />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    )}
                    <span className="font-semibold tracking-tight">{m.name}</span>
                    <span className="text-[11px] text-muted-foreground ml-auto">{m.provider}</span>
                    {selectedModel.id === m.id && <Check className="w-3.5 h-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[radial-gradient(ellipse_at_bottom_right,_hsl(244_80%_61%/0.03),_transparent_40%)]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center space-y-4">
            <h2 className="text-xl font-bold text-foreground">Secure Administrator Shell</h2>
            <p className="text-sm text-muted-foreground px-6 leading-relaxed">
              This is a private AI interaction channel for gateway administrators. All prompts are logged for audit purposes but remain protected within the Foretyx mesh.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full mt-4">
              {[
                'Audit recent API errors', 
                'Analyze gateway traffic', 
                'Check policy effectiveness',
                'Status of LLM providers'
              ].map(s => (
                <button
                  key={s}
                  onClick={() => { setInputValue(s); textareaRef.current?.focus(); }}
                  className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/50 text-xs font-medium text-foreground transition text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[80%] rounded-3xl px-5 py-3.5 shadow-sm border ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-card text-foreground border-border/50'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.model && (
                    <div className="mt-3 pt-3 border-t border-border/20 flex items-center justify-between">
                      <span className="text-[10px] font-semibold opacity-90 uppercase tracking-tight text-foreground/80">{msg.model}</span>
                      <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold">ML GUARD SCORE: 98%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fade-in px-4">
                <div className="bg-muted rounded-full px-4 py-2 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-foreground/20 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-6 bg-card border-t border-border mt-auto">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSend(); 
                } 
              }}
              placeholder="Query the administrative AI gateway..."
              rows={1}
              className="w-full bg-muted/30 border border-border rounded-2xl py-4 pl-5 pr-24 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-border transition-none resize-none max-h-48 overflow-y-auto focus-visible:ring-0 shadow-none"
              style={{ minHeight: '56px' }}
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                onClick={handleSend} 
                disabled={!inputValue.trim() || isTyping} 
                className="h-10 px-4 bg-primary text-primary-foreground rounded-xl flex items-center justify-center gap-2 font-semibold text-xs hover:bg-primary/90 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Query
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between px-2">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 uppercase font-bold tracking-widest">
              Multi-Model Orchestration Active
            </p>
            <div className="flex gap-4">
              <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition uppercase tracking-widest">History</button>
              <button className="text-[10px] font-bold text-muted-foreground hover:text-foreground transition uppercase tracking-widest">Save Session</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
