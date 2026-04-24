import React from 'react';
import { X, Shield, LogOut, Monitor } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ALLOWED_MODELS } from '@/data/mockData';
import { ChevronDown, Check } from 'lucide-react';
import { useClickOutside } from '@/hooks/use-click-outside';
import chatgptIcon from '@/components/ui/chatgpt_PNG14.webp';
import geminiIcon from '@/components/ui/gemini-color.webp';
import claudeIcon from '@/components/ui/claude-color.webp';

interface Props {
  onClose: () => void;
  selectedModel: typeof ALLOWED_MODELS[0];
  onModelChange: (m: typeof ALLOWED_MODELS[0]) => void;
}

export default function EmployeeSettings({ onClose, selectedModel, onModelChange }: Props) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showModelPicker, setShowModelPicker] = React.useState(false);
  const modelPickerRef = useClickOutside(() => setShowModelPicker(false));

  const securityItems = [
    { label: 'PII Protection', badge: 'Active', desc: 'All prompts are scanned for personal data before sending' },
    { label: 'Injection Guard', badge: 'Active', desc: 'ML model detects prompt injection attacks locally' },
    { label: 'Local Processing', badge: 'On-Device', desc: 'All security checks run on your machine' },
    { label: 'Fail-Closed Mode', badge: 'Enabled', desc: 'If guard is offline, all requests are blocked' },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[380px] bg-card border-l border-border z-50 overflow-y-auto animate-slide-in-right">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Settings</h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
          </div>

          {/* Account */}
          <section className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Account</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                {user?.display_name?.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{user?.display_name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground capitalize">{user?.role}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Organization</span><span className="text-foreground">{user?.org_name}</span></div>
            </div>
            <button onClick={logout} className="mt-4 flex items-center gap-2 text-sm text-destructive hover:text-destructive/80 border border-destructive/30 rounded-md px-3 py-2 transition">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </section>

          {/* Appearance */}
          <section className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Appearance</h3>
            <div className="flex bg-muted rounded-lg p-1">
              <button onClick={() => setTheme('light')} className={`flex-1 text-sm py-1.5 rounded-md transition ${theme === 'light' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>Light</button>
              <button onClick={() => setTheme('dark')} className={`flex-1 text-sm py-1.5 rounded-md transition ${theme === 'dark' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>Dark</button>
            </div>
          </section>

          {/* AI Model */}
          <section className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Active Model</h3>
            <div className="relative" ref={modelPickerRef}>
              <button 
                onClick={() => setShowModelPicker(!showModelPicker)} 
                className={`w-full flex items-center gap-2.5 h-9 px-3 rounded-lg border transition-all duration-300 ${
                  showModelPicker 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-muted/50 border-border/50 hover:border-primary/40'
                } text-xs text-foreground group`}
              >
                <div className="p-1 rounded-md bg-background/50 border border-border/30 shrink-0">
                  {selectedModel.provider === 'Anthropic' ? (
                    <img src={claudeIcon} alt="Claude" className="w-3.5 h-3.5 rounded-sm object-contain" />
                  ) : selectedModel.provider === 'OpenAI' ? (
                    <img src={chatgptIcon} alt="ChatGPT" className="w-3.5 h-3.5 rounded-sm object-contain" />
                  ) : selectedModel.provider === 'Google' ? (
                    <img src={geminiIcon} alt="Gemini" className="w-3.5 h-3.5 rounded-sm object-contain" />
                  ) : (
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedModel.color }} />
                  )}
                </div>
                <span className="font-bold tracking-tight truncate">{selectedModel.name}</span>
                <ChevronDown className={`ml-auto w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${showModelPicker ? 'rotate-180' : ''}`} />
              </button>
              
              {showModelPicker && (
                <div className="absolute top-full mt-1.5 left-0 w-full glass-card rounded-xl border border-border p-1 z-50 animate-dropdown-reveal origin-top shadow-xl">
                  {ALLOWED_MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { onModelChange(m); setShowModelPicker(false); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-all duration-200 group/item ${
                        selectedModel.id === m.id 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-foreground/80 hover:bg-white/5 hover:text-foreground'
                      }`}
                    >
                      <div className={`p-1 rounded-md bg-background/50 border transition-colors ${selectedModel.id === m.id ? 'border-primary/50' : 'border-border/30 group-hover/item:border-primary/30'}`}>
                        {m.provider === 'Anthropic' ? (
                          <img src={claudeIcon} alt="Claude" className="w-3 h-3 rounded-sm object-contain" />
                        ) : m.provider === 'OpenAI' ? (
                          <img src={chatgptIcon} alt="ChatGPT" className="w-3 h-3 rounded-sm object-contain" />
                        ) : m.provider === 'Google' ? (
                          <img src={geminiIcon} alt="Gemini" className="w-3 h-3 rounded-sm object-contain" />
                        ) : (
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        )}
                      </div>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="font-bold tracking-tight truncate">{m.name}</span>
                        <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wider">{m.provider}</span>
                      </div>
                      {selectedModel.id === m.id && (
                        <div className="ml-auto flex items-center justify-center w-4 h-4 rounded-full bg-primary/20 text-primary">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-[10px] font-medium text-muted-foreground mt-2.5 uppercase tracking-wider">Managed by organization policy</p>
          </section>

          {/* Privacy & Security */}
          <section className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Privacy & Security</h3>
            <div className="space-y-3">
              {securityItems.map(item => (
                <div key={item.label} className="glass-card rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                    <span className="px-2 py-0.5 bg-success/20 text-success text-[11px] font-medium rounded">{item.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">Security settings are managed by your administrator</p>
          </section>

          {/* Sidecar Status */}
          <section className="mb-8">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Sidecar Status</h3>
            <div className="glass-card rounded-lg p-3 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="flex items-center gap-1.5 text-foreground"><span className="status-dot status-online" /> Online</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="text-foreground font-mono">v0.1.0</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Guard Model</span><span className="text-foreground">ML_GUARD Loaded</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Uptime</span><span className="text-foreground font-mono">4h 23m</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">P95 Latency</span><span className="text-foreground font-mono">142ms</span></div>
            </div>
          </section>

          {/* About */}
          <section>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">About</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Foretyx</span><span className="text-foreground font-mono">v1.1.0</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Data Plane</span><span className="text-foreground font-mono">v0.1.0</span></div>
            </div>
            <div className="mt-3 space-y-1">
              <button className="text-xs text-primary hover:underline block">View Privacy Policy</button>
              <button className="text-xs text-primary hover:underline block">Report an Issue</button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
