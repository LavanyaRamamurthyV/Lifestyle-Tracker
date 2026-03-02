export interface User { id: string; email: string; name: string; }
export interface Habit { id: string; userId: string; name: string; title: string; icon?: string; frequency: string; dailyTarget: number; daysOfWeek?: string[]; completions: string[]; priority?: string; difficulty?: string; tags?: string[]; notes?: string; }
export interface Event { id: string; userId: string; title: string; date: string; time?: string; description?: string; completed: boolean; priority?: string; tags?: string[]; notes?: string; }
export interface Chore { id: string; userId: string; title: string; frequency: string; lastCompleted?: string; priority?: string; difficulty?: number; tags?: string[]; notes?: string; }
export interface Todo { id: string; userId: string; title: string; completed: boolean; dueDate?: string; priority?: string; difficulty?: number; tags?: string[]; notes?: string; }
export type Theme = 'lavender' | 'blue' | 'green' | 'orange' | 'pink';
export type Tab = 'dashboard' | 'tracker' | 'calendar' | 'progress';
export type TrackerView = 'kanban' | 'tabular';