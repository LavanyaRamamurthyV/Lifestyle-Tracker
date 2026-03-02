const API = '/api';
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const r = await fetch(`${API}${endpoint}`, { ...options, headers: { 'Content-Type': 'application/json', ...options.headers }});
  if (!r.ok) throw new Error((await r.json()).error || 'Failed');
  return r.json();
}
export const today = () => new Date().toISOString().split('T')[0];
export const formatDate = (d: Date) => d.toISOString().split('T')[0];
export const getDaysInMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = [];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};
export const getWeekDates = () => {
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
};
export const calcStreak = (completions: string[]) => {
  if (!completions.length) return 0;
  const sorted = [...completions].sort().reverse();
  let streak = 0, curr = new Date();
  for (const c of sorted) {
    const diff = Math.floor((curr.getTime() - new Date(c).getTime()) / 86400000);
    if (diff === streak) { streak++; curr = new Date(c); } else break;
  }
  return streak;
};