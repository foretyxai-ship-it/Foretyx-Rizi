import React, { useState } from 'react';
import { Copy, AlertTriangle } from 'lucide-react';
import { ORG } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showRotateConfirm, setShowRotateConfirm] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied', description: 'Copied to clipboard' });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-semibold text-foreground">Organization Settings</h1>

      {/* Org Info */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Organization Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Org Name</span><span className="text-foreground">{ORG.name}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Org ID</span>
            <span className="flex items-center gap-2 text-foreground font-mono text-xs">
              {ORG.id}
              <button onClick={() => copyToClipboard(ORG.id)} className="text-muted-foreground hover:text-foreground"><Copy className="w-3.5 h-3.5" /></button>
            </span>
          </div>
          <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded">{ORG.plan}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Seats</span><span className="text-foreground">{ORG.seats.used} / {ORG.seats.total}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Policy Version</span><span className="text-foreground font-mono">{ORG.policyVersion}</span></div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="glass-card rounded-lg p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Security Settings</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">API Base URL</span><span className="text-foreground font-mono text-xs">{ORG.apiBaseUrl}</span></div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">WebSocket</span>
            <span className="flex items-center gap-1.5 text-foreground text-xs"><span className="status-dot status-online" /> Connected</span>
          </div>
        </div>
        <button onClick={() => setShowRotateConfirm(true)} className="mt-4 h-9 px-4 border border-warning/50 text-warning rounded-md text-sm hover:bg-warning/10 transition">Rotate API Token</button>
      </div>

      {/* Danger Zone */}
      <div className="glass-card rounded-lg p-6 border-destructive/30">
        <h3 className="text-sm font-semibold text-destructive mb-4 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Danger Zone</h3>
        <div className="space-y-3">
          <button className="h-9 px-4 border border-destructive/30 text-destructive rounded-md text-sm hover:bg-destructive/10 transition">Transfer Ownership</button>
          <button disabled className="h-9 px-4 border border-border text-muted-foreground rounded-md text-sm opacity-50 cursor-not-allowed ml-3" title="Contact support to delete organization">Delete Organization</button>
        </div>
      </div>

      {/* Rotate Confirm */}
      {showRotateConfirm && (
        <>
          <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setShowRotateConfirm(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="glass-card rounded-lg p-6 max-w-md w-full border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">Rotate API Token?</h3>
              <p className="text-sm text-muted-foreground mb-6">This will invalidate the current token. All connected clients will need to re-authenticate.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowRotateConfirm(false)} className="flex-1 h-10 border border-border rounded-md text-sm text-foreground hover:bg-muted transition">Cancel</button>
                <button onClick={() => { setShowRotateConfirm(false); toast({ title: 'Token Rotated', description: 'New API token generated.' }); }} className="flex-1 h-10 bg-destructive text-destructive-foreground rounded-md text-sm font-semibold hover:bg-destructive/90 transition">Rotate Token</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
