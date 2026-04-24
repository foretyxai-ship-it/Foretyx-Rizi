import React, { useState } from 'react';
import { Search, Globe, Lock, ExternalLink, ShieldCheck, Star, ShieldAlert } from 'lucide-react';
import { APPLICATIONS } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export default function EmployeeApplications() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['app-001', 'app-004']);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filtered = APPLICATIONS.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) || 
    app.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-foreground">Secure Application Portal</h1>
          <p className="text-muted-foreground">All your workplace applications, protected by Foretyx Guard.</p>
        </div>

        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search for an application..." 
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted/50 border border-border/50 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
          />
        </div>

        {favorites.length > 0 && !search && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Favorite Applications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {APPLICATIONS.filter(a => favorites.includes(a.id)).map(app => (
                <AppCard key={app.id} app={app} isFavorite={true} onFavorite={toggleFavorite} />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">
            {search ? `Search Results (${filtered.length})` : 'All Applications'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                isFavorite={favorites.includes(app.id)} 
                onFavorite={toggleFavorite} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppCard({ app, isFavorite, onFavorite }: { app: any, isFavorite: boolean, onFavorite: (id: string, e: React.MouseEvent) => void }) {
  return (
    <div className="glass-card-hover group rounded-2xl p-5 border border-border/50 bg-card/40 flex flex-col gap-4 cursor-pointer relative overflow-hidden">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition-colors">
          <Globe className="w-6 h-6 text-primary" />
        </div>
        <button 
          onClick={(e) => onFavorite(app.id, e)}
          className={`p-2 rounded-full hover:bg-muted/80 transition-colors ${isFavorite ? 'text-warning' : 'text-muted-foreground'}`}
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-warning' : ''}`} />
        </button>
      </div>

      <div className="space-y-1 relative z-10">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
          {app.name}
          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
        <p className="text-xs text-muted-foreground font-mono">{app.url.replace('https://', '')}</p>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-auto relative z-10">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{app.category}</span>
        {app.status === 'protected' ? (
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 gap-1 h-6 px-2 text-[10px]">
            <ShieldCheck className="w-3 h-3" /> Secure Access
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-destructive/5 text-destructive border-destructive/20 gap-1 h-6 px-2 text-[10px]">
            <ShieldAlert className="w-3 h-3" /> Bypassed
          </Badge>
        )}
      </div>
    </div>
  );
}
