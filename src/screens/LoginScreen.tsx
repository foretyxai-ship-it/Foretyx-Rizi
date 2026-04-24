// @refresh reset
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const e = error as any;
    if (e.msg) return e.msg;
    if (e.message) return e.message;
    if (e.detail) return typeof e.detail === 'string' ? e.detail : JSON.stringify(e.detail);
  }
  return 'Login failed. Please try again.';
}

export default function LoginScreen() {
  console.log("LoginScreen rendering...");
  const { login, isLoading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<'employee' | 'admin'>('employee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = await login(email, password, mode);
    if (!result.success) {
      setError(extractErrorMessage(result.error));
    }
    if (result.must_change_password) {
      setMustChangePassword(true);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: 'Password Mismatch', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    toast({ title: 'Password Updated', description: 'You can now sign in with your new password.' });
    setMustChangePassword(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(244_80%_61%/0.08),_transparent_60%)]" />

      <div className="relative z-20 flex flex-col items-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">Foretyx</span>
        </div>
        <p className="text-muted-foreground text-sm">Your AI. Your Data. Your Control.</p>
      </div>

      <div className={`login-container transition-all duration-700 ${mode === 'admin' ? 'active' : ''}`} id="container">

        {/* Employee Login Form */}
        <div className="form-container employee-signin">
          <form onSubmit={handleLogin}>
            <h1 className="text-2xl font-bold mb-4">Employee Sign In</h1>
            <p className="text-muted-foreground text-center mb-6">Sign in to your employee workspace</p>
            <input
              type="email"
              placeholder="Work Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border border-border"
              required
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border border-border"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && mode === 'employee' && (
              <p className="text-destructive text-xs mt-2 w-full text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}
            <a href="#" className="text-xs hover:underline decoration-primary">Forgot Your Password?</a>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Sign In
            </button>
          </form>
        </div>

        {/* Admin Login Form */}
        <div className="form-container admin-signin">
          <form onSubmit={handleLogin}>
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-muted-foreground text-center mb-6">Access the administrative control plane</p>
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-muted border border-border"
              required
            />
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-muted border border-border"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && mode === 'admin' && (
              <p className="text-destructive text-xs mt-2 w-full text-center font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                {error}
              </p>
            )}
            <a href="#" className="text-xs hover:underline decoration-primary">Forgot Administrator Password?</a>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Admin Login
            </button>
          </form>
        </div>

        {/* Sliding Overlay */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-2xl font-bold text-white mb-4">Switch to Employee</h1>
              <p className="text-white/80 mb-8">Access your personalized AI workspace and tools.</p>
              <button
                className="h-11 px-10 border-2 border-white rounded-xl font-bold text-sm hover:bg-white/10 transition"
                onClick={() => setMode('employee')}
              >
                Employee Portal
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-2xl font-bold text-white mb-4">Are you an Admin?</h1>
              <p className="text-white/80 mb-8">Login to manage policies, users, and gateway security settings.</p>
              <button
                className="h-11 px-10 border-2 border-white rounded-xl font-bold text-sm hover:bg-white/10 transition"
                onClick={() => setMode('admin')}
              >
                Admin Control
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-xs text-muted-foreground relative z-20" />

      {mustChangePassword && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-background/80 backdrop-blur-md">
          <div className="w-full max-w-md p-8 glass-card rounded-3xl shadow-2xl border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-4">Set your password</h2>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
              <p className="text-sm text-primary font-medium">Your admin has set a temporary password. Please create a new one to continue.</p>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Current Password</label>
                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">New Password</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full h-11 px-4 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" required />
              </div>
              <button type="submit" className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/20">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}