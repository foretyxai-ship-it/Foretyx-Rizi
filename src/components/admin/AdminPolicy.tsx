import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Copy, Shield, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ALL_MODELS, POLICY_AUDIT_TRAIL } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios';

export default function AdminPolicy() {
  const { toast } = useToast();
  const [allowedModels, setAllowedModels] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [maxTokens, setMaxTokens] = useState(4000);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [policyVersion, setPolicyVersion] = useState('v1.0');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [connectedDesktops, setConnectedDesktops] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchPolicy = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    const org_id = localStorage.getItem('org_id');
    try {
      const res = await api.get(`/policy/sync/${org_id}`);
      setAllowedModels(res.data.allowed_models || []);
      setKeywords(res.data.blocked_keywords || []);
      setMaxTokens(res.data.max_prompt_tokens || 4000);
      setSessionTimeout(res.data.session_timeout_minutes || 60);
      setPolicyVersion(res.data.policy_version || 'v1.0');
    } catch (error) {
      console.error('Policy fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
    const org_id = localStorage.getItem('org_id');
    const token = localStorage.getItem('foretyx_token');
    
    const ws = new WebSocket(`ws://localhost:8000/ws/policy/${org_id}?token=${token}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message_type === 'policy_update') {
        fetchPolicy(true);
        toast({ title: 'Policy updated remotely', description: 'Remote changes synchronized.' });
      }
    };

    return () => ws.close();
  }, [fetchPolicy, toast]);

  const toggleModel = (id: string) => {
    setAllowedModels(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords(prev => [...prev, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    setErrorMessage(null);
    const org_id = localStorage.getItem('org_id');

    try {
      const res = await api.post(`/policies/update?org_id=${org_id}`, {
        allowed_models: allowedModels,
        blocked_keywords: keywords,
        max_prompt_tokens: maxTokens,
        session_timeout_minutes: sessionTimeout
      });
      
      setConnectedDesktops(res.data.connected_desktops || 0);
      setSaveStatus('success');
      setPolicyVersion(res.data.new_version || policyVersion);
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error: any) {
      setSaveStatus('error');
      setErrorMessage(error.response?.data?.detail || error.message || 'Failed to update policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-semibold text-foreground">Policy Manager</h1>

      {/* Current policy */}
      <div className="glass-card rounded-lg p-6 border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Policy Version</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-foreground font-mono font-bold bg-primary/10 px-2 py-0.5 rounded text-sm border border-primary/20">{policyVersion}</span>
                <button className="text-muted-foreground hover:text-foreground transition-colors"><Copy className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Fail Behavior</span>
              <p className="mt-1 flex items-center gap-1.5 font-bold text-success text-xs">
                <Shield className="w-3.5 h-3.5" />
                <span>🔒 CLOSED</span>
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Global Status</span>
              <p className="text-sm font-medium text-foreground mt-1 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                Active Service
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Edit form */}
        <div className="glass-card rounded-lg p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Allowed AI Models</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => toggleModel(m.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition border ${
                    allowedModels.includes(m.id)
                      ? 'bg-primary/20 border-primary/30 text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {m.name}
                  {allowedModels.includes(m.id) && <X className="w-3 h-3" onClick={(e) => { e.stopPropagation(); toggleModel(m.id); }} />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Blocked Keywords <span className="text-muted-foreground font-normal">({keywords.length} keywords)</span></h3>
            <div className="flex gap-2 mb-2">
              <input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                placeholder="Type keyword and press Enter"
                className="flex-1 h-9 px-3 rounded-md bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {keywords.map(k => (
                <span key={k} className="px-2 py-1 bg-muted rounded text-xs text-foreground flex items-center gap-1">
                  {k}
                  <X className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setKeywords(prev => prev.filter(x => x !== k))} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center justify-between">
              Fail Behavior
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">LOCKED</span>
            </h3>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50 border-dashed">
              <p className="text-xs text-muted-foreground leading-relaxed">
                In the event of a gateway failure, this environment is set to <span className="text-success font-bold">CLOSED</span>. No AI traffic will be permitted until the secure channel is re-established.
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Limits</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Max Prompt Tokens</label>
                <input type="number" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))} min={100} max={128000} className="w-full h-9 px-3 mt-1 rounded-md bg-muted border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Session Timeout</label>
                <input type="range" value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))} min={5} max={1440} className="w-full mt-1" />
                <p className="text-xs text-muted-foreground mt-1">{sessionTimeout} minutes ({(sessionTimeout / 60).toFixed(1)} hours)</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className={`w-full h-11 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                saveStatus === 'success' ? 'bg-success text-white shadow-success/20' :
                saveStatus === 'error' ? 'bg-destructive text-white shadow-destructive/20' :
                'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20'
              }`}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 
               saveStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : null}
              {saveStatus === 'success' ? `Saved · Broadcasted to ${connectedDesktops} desktops` : 
               saveStatus === 'error' ? 'Failed to Update' : 'Push New Policy'}
            </button>
            {errorMessage && (
              <p className="text-[11px] text-destructive font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" />
                {errorMessage}
              </p>
            )}
          </div>
        </div>

        {/* Audit trail */}
        <div className="glass-card rounded-lg p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Audit Trail</h3>
          <div className="space-y-3">
            {POLICY_AUDIT_TRAIL.map((entry, i) => (
              <div key={entry.id} className={`p-3 rounded-lg ${i % 2 === 0 ? 'bg-muted/50' : ''}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{entry.changedBy}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    entry.category === 'models' ? 'bg-primary/20 text-primary' :
                    entry.category === 'keywords' ? 'bg-warning/20 text-warning' :
                    entry.category === 'PII rules' ? 'bg-secondary/20 text-secondary' :
                    'bg-muted text-muted-foreground'
                  }`}>{entry.category}</span>
                </div>
                <p className="text-sm text-foreground">{entry.summary}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{entry.changedAt}</span>
                  <span>&bull;</span>
                  <span className="font-mono">{entry.versionBefore} → {entry.versionAfter}</span>
                </div>
              </div>
            ))}
          </div>
          <button className="text-xs text-primary hover:underline mt-4 block">View full audit log</button>
        </div>
      </div>

    </div>
  );
}
