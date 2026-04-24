export const ORG = {
  id: 'org-meridian',
  name: 'Meridian Research Labs',
  plan: 'Growth' as const,
  seats: { used: 8, total: 10 },
  policyVersion: 'v1.4',
  apiBaseUrl: 'http://localhost:8000',
};

export const ALLOWED_MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', color: '#10A37F' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', color: '#10A37F' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI', color: '#10A37F' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', color: '#D4A574' },
  { id: 'claude-haiku', name: 'Claude Haiku', provider: 'Anthropic', color: '#D4A574' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', color: '#4285F4' },
];

export const ALL_MODELS = [
  ...ALLOWED_MODELS,
  { id: 'claude-opus', name: 'Claude Opus', provider: 'Anthropic', color: '#D4A574', blocked: true },
];

export const BLOCKED_KEYWORDS = [
  'salary', 'acquisition', 'merger', 'confidential deal',
  'layoff', 'stock options', 'termination', 'due diligence',
  'equity split', 'valuation', 'IPO timeline', 'revenue target',
  'headcount reduction',
];

export const USERS = [
  { id: 'u-001', email: 'priya@meridian.com', name: 'Priya Sharma', role: 'owner' as const, joined: '2024-01-15', lastSeen: '2 min ago', status: 'online' },
  { id: 'u-002', email: 'arjun@meridian.com', name: 'Arjun Mehta', role: 'admin' as const, joined: '2024-02-01', lastSeen: '5 min ago', status: 'online' },
  { id: 'u-003', email: 'sneha@meridian.com', name: 'Sneha Iyer', role: 'employee' as const, joined: '2024-03-10', lastSeen: '1 hour ago', status: 'online' },
  { id: 'u-004', email: 'rahul@meridian.com', name: 'Rahul Das', role: 'employee' as const, joined: '2024-04-05', lastSeen: '3 hours ago', status: 'online' },
];

export const STATS = {
  blocksToday: 12,
  piiEventsToday: 5,
  injectionAttemptsToday: 2,
  avgGuardLatency: 143,
  activeUsers30d: 7,
  activePolicies: 3,
  connectedDesktops: 3,
};

export const generateTimelineData = () => {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalPrompts: Math.floor(30 + Math.random() * 50),
      blocked: Math.floor(1 + Math.random() * 6),
      piiEvents: Math.floor(Math.random() * 4),
      injectionAttempts: Math.floor(Math.random() * 2),
    });
  }
  return data;
};

export const MOCK_TIMELINE = generateTimelineData();

export const RECENT_BLOCKS = [
  { id: 'b-001', timestamp: '2 min ago', userId: 'u-***03', reason: 'PII_DETECTED', detail: 'Credit card number detected' },
  { id: 'b-002', timestamp: '18 min ago', userId: 'u-***04', reason: 'KEYWORD_BLOCKED', detail: 'Blocked keyword: "acquisition"' },
  { id: 'b-003', timestamp: '1 hour ago', userId: 'u-***03', reason: 'INJECTION_DETECTED', detail: 'Prompt injection pattern detected' },
];

export const BLOCK_REASONS_DISTRIBUTION = [
  { name: 'PII_DETECTED', value: 34, color: '#eab308' },
  { name: 'INJECTION_DETECTED', value: 12, color: '#ef4444' },
  { name: 'KEYWORD_BLOCKED', value: 22, color: '#3b82f6' },
];

export const PII_TYPES_DATA = [
  { type: 'Email', count: 34, color: '#c9a84c' },
  { type: 'Phone', count: 22, color: '#e05555' },
  { type: 'SSN', count: 8, color: '#4caf78' },
  { type: 'Credit Card', count: 15, color: '#d4813a' },
  { type: 'Name', count: 21, color: '#a89f8c' },
];

export const MODEL_USAGE = [
  { model: 'GPT-4o', requests: 1250, blocked: 45, passRate: '96.4%', avgLatency: '345ms' },
  { model: 'Claude Sonnet', requests: 840, blocked: 12, passRate: '98.5%', avgLatency: '210ms' },
  { model: 'Gemini 1.5 Pro', requests: 520, blocked: 8, passRate: '98.5%', avgLatency: '180ms' }
];

export const APPLICATIONS = [
  { id: 'app-1', name: 'Internal Wiki', url: 'https://wiki.meridian.com', category: 'Engineering', status: 'protected', usersCount: 142, riskLevel: 'low', lastSync: '2 mins ago' },
  { id: 'app-2', name: 'Finance Hub', url: 'https://finance.meridian.com', category: 'Finance', status: 'protected', usersCount: 15, riskLevel: 'high', lastSync: '1 min ago' },
  { id: 'app-3', name: 'HR Portal', url: 'https://hr.meridian.com', category: 'HR', status: 'protected', usersCount: 89, riskLevel: 'medium', lastSync: '5 mins ago' }
];

export const CHAT_HISTORY = [
  { id: 'msg-1', role: 'user', content: 'What is the current status of the gateway?' },
  { id: 'msg-2', role: 'assistant', content: 'All systems are fully operational with no anomalies detected.', model: 'GPT-4o' }
];

export const POLICY_AUDIT_TRAIL = [
  { id: 'aud-1', changedBy: 'Arjun Mehta', category: 'keywords', summary: 'Added "acquisition" to blocked keywords', changedAt: '2 hours ago', versionBefore: 'v1.3', versionAfter: 'v1.4' },
  { id: 'aud-2', changedBy: 'System', category: 'models', summary: 'Disabled Claude Opus due to policy violation', changedAt: '1 day ago', versionBefore: 'v1.2', versionAfter: 'v1.3' }
];