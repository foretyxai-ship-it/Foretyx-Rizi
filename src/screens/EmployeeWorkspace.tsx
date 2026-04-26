import React, { useState, useRef, useEffect } from 'react';
import { Shield, Plus, Trash2, Settings, Send, ChevronDown, Check, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ALLOWED_MODELS, CHAT_HISTORY, ORG, APPLICATIONS } from '@/data/mockData';
import { useClickOutside } from '@/hooks/use-click-outside';
import chatgptIcon from '@/components/ui/chatgpt_PNG14.webp';
import geminiIcon from '@/components/ui/gemini-color.webp';
import claudeIcon from '@/components/ui/claude-color.webp';
import EmployeeSettings from './EmployeeSettings';
import EmployeeApplications from './EmployeeApplications';
import { LayoutGrid, MessageSquare } from 'lucide-react';

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

export default function EmployeeWorkspace() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState(ALLOWED_MODELS[0]);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'apps'>('chat');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState(CHAT_HISTORY);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidecarOnline, setSidecarOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelPickerRef = useClickOutside(() => setShowModelPicker(false));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    const userMsg: Message = { id: `m-${Date.now()}`, role: 'user', content: inputValue };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');

    // Check for blocked content
    const lowerInput = inputValue.toLowerCase();
    if (lowerInput.includes('credit card') || lowerInput.includes('ssn')) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: `m-${Date.now()}`,
          role: 'system',
          content: '',
          blocked: true,
          blockReason: 'PII_DETECTED',
          blockDetail: 'Credit card number or SSN pattern detected and blocked'
        }]);
      }, 800);
      return;
    }

    if (!activeChatId) {
      const newId = `c-${Date.now()}`;
      setActiveChatId(newId);
      setChatHistory(prev => [{ id: newId, title: inputValue.slice(0, 40), timestamp: 'Just now', group: 'Today' }, ...prev]);
    }

    setIsTyping(true);
    const responses = [
      "I'd be happy to help you with that. Based on the data available, here's what I found:\n\nThe analysis shows consistent trends across the last quarter with notable improvements in key metrics. Let me break this down further for you.",
      "Here's a draft based on your request:\n\nSubject: Follow-up on Q3 Strategy\n\nHi team,\n\nI wanted to share some key insights from our recent analysis. The data suggests we should focus on optimizing our current workflows before scaling further.",
      "Let me analyze that for you. The key findings are:\n\n1. Customer retention improved by 12% quarter-over-quarter\n2. Response times decreased by an average of 23ms\n3. The main driver appears to be the recent process changes\n\nWould you like me to dig deeper into any of these areas?"
    ];

    setTimeout(() => {
      const piiScrubbed = lowerInput.includes('email') || lowerInput.includes('name');
      setMessages(prev => [...prev, {
        id: `m-${Date.now()}`,
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        model: selectedModel.name,
        piiScrubbed
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const grouped = chatHistory.reduce<Record<string, typeof CHAT_HISTORY>>((acc, c) => {
    (acc[c.group] = acc[c.group] || []).push(c);
    return acc;
  }, {});

  return (
    <div className="h-screen w-full flex bg-background overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[260px] flex flex-col border-r border-border bg-card shrink-0">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-sm font-semibold text-foreground">Foretyx</span>
          </div>
          <button onClick={handleNewChat} className="w-full h-9 bg-primary text-primary-foreground rounded-md text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition shadow-sm">
            <Plus className="w-4 h-4" /> New Chat
          </button>

          <div className="mt-4 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
            >
              <MessageSquare className="w-4 h-4" /> Secure Chat
            </button>
            <button
              onClick={() => setActiveTab('apps')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition-all ${activeTab === 'apps' ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" /> App Portal
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {activeTab === 'chat' ? (
            Object.entries(grouped).map(([group, chats]) => (
              <div key={group} className="mb-3">
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-2 mb-1">{group}</p>
                {chats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => { setActiveChatId(chat.id); setMessages([]); }}
                    className={`w-full text-left px-2 py-3 rounded-2xl text-sm flex items-center justify-between group hover:bg-muted/60 transition ${activeChatId === chat.id ? 'bg-muted border border-border/50' : ''}`}
                  >
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-[13px] font-medium">{chat.title}</p>
                      <p className="text-[11px] text-muted-foreground">{chat.timestamp}</p>
                    </div>
                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            ))
          ) : (
            <div className="p-2 space-y-4">
              <div className="p-3 bg-muted/40 rounded-xl border border-border/50">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  You have access to <strong>{APPLICATIONS.length} apps</strong>. All traffic is automatically protected by Foretyx.
                </p>
              </div>
              {APPLICATIONS.slice(0, 3).map(app => (
                <div key={app.id} className="p-2 px-3 flex items-center gap-2 text-sm text-foreground hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group">
                  <Globe className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
                  <span className="truncate">{app.name}</span>
                </div>
              ))}
              <button onClick={() => setActiveTab('apps')} className="w-full text-[10px] uppercase font-bold text-primary tracking-widest hover:underline pt-2">View Full Portal</button>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
              {user?.display_name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{user?.display_name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={() => setShowSettings(true)} className="text-muted-foreground hover:text-foreground transition">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Chat Panel */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <div className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="relative" ref={modelPickerRef}>
              <button onClick={() => setShowModelPicker(!showModelPicker)} className="flex items-center gap-2 h-8 px-3 rounded-full bg-muted text-sm text-foreground hover:bg-muted/80 transition">
                {selectedModel.provider === 'Anthropic' ? (
                  <img src={claudeIcon} alt="Claude" className="w-4 h-4 rounded-sm object-contain" />
                ) : selectedModel.provider === 'OpenAI' ? (
                  <img src={chatgptIcon} alt="ChatGPT" className="w-4 h-4 rounded-sm object-contain" />
                ) : selectedModel.provider === 'Google' ? (
                  <img src={geminiIcon} alt="Gemini" className="w-4 h-4 rounded-sm object-contain" />
                ) : (
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedModel.color }} />
                )}
                {selectedModel.name}
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              {showModelPicker && (
                <div className="absolute top-full mt-1 left-0 w-56 glass-card rounded-lg border border-border py-1 z-50 animate-dropdown-reveal origin-top-left shadow-xl">
                  {ALLOWED_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { setSelectedModel(m); setShowModelPicker(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition"
                    >
                      {m.provider === 'Anthropic' ? (
                      <img src={claudeIcon} alt="Claude" className="w-4 h-4 rounded-sm object-contain" />
                    ) : m.provider === 'OpenAI' ? (
                      <img src={chatgptIcon} alt="ChatGPT" className="w-4 h-4 rounded-sm object-contain" />
                    ) : m.provider === 'Google' ? (
                      <img src={geminiIcon} alt="Gemini" className="w-4 h-4 rounded-sm object-contain" />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                    )}
                      {m.name}
                      <span className="text-[11px] text-muted-foreground ml-auto">{m.provider}</span>
                      {selectedModel.id === m.id && <Check className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`status-dot ${sidecarOnline ? 'status-online animate-pulse-dot' : 'status-warning'}`} />
              <span className="text-xs text-muted-foreground">
                {sidecarOnline ? 'Guard Active' : 'Guard Offline — Requests Blocked'}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                <h2 className="text-2xl font-semibold text-foreground mb-2">What can I help you with today?</h2>
                <p className="text-sm text-muted-foreground mb-8 max-w-md text-center">Your prompts are protected. PII is anonymized before reaching any AI model.</p>
                <div className="grid grid-cols-3 gap-3 max-w-lg">
                  {['Summarize a document', 'Draft an email', 'Analyze this data'].map(s => (
                    <button
                      key={s}
                      onClick={() => { setInputValue(s); textareaRef.current?.focus(); }}
                      className="glass-card rounded-lg p-4 text-sm text-foreground hover:border-primary/50 transition text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`animate-fade-in ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                    {msg.blocked ? (
                      <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-3 flex items-start gap-2">
                        <Shield className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-destructive">Request blocked — {msg.blockReason}</p>
                          <p className="text-xs text-muted-foreground mt-1">{msg.blockDetail}</p>
                        </div>
                      </div>
                    ) : msg.role === 'user' ? (
                      <div className="bg-primary text-primary-foreground rounded-2xl px-4 py-3 max-w-[70%]">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      <div className="glass-card rounded-2xl px-4 py-3 max-w-[80%]">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{msg.content}</p>
                        {msg.model && <p className="text-[11px] text-muted-foreground mt-2 font-mono">{msg.model}</p>}
                        {msg.piiScrubbed && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-secondary">
                            <Shield className="w-3 h-3" />
                            PII was anonymized before sending. Response rehydrated locally.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="glass-card rounded-lg px-4 py-3 max-w-[80%] animate-fade-in">
                    <div className="flex gap-1.5">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-typing" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 pb-4">
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-2xl p-2 flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Send a message... (PII will be protected automatically)"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-2 px-2 max-h-32"
                  style={{ minHeight: '36px' }}
                />
                <button onClick={handleSend} disabled={!inputValue.trim() || isTyping} className="w-9 h-9 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-30 shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmployeeApplications />
      )}

      {/* Settings Panel */}
      {showSettings && <EmployeeSettings onClose={() => setShowSettings(false)} selectedModel={selectedModel} onModelChange={setSelectedModel} />}
    </div>
  );
}
