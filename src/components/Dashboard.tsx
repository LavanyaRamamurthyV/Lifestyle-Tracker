import { useState, useEffect } from 'react';
import { apiCall, today } from '../utils';
import type { Habit, Event, Chore, Todo } from '../types';

export default function Dashboard({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const [h, e, c, t] = await Promise.all([
        apiCall(`/habits?userId=${userId}`),
        apiCall(`/events?userId=${userId}`),
        apiCall(`/chores?userId=${userId}`),
        apiCall(`/todos?userId=${userId}`),
      ]);
      setHabits(h);
      setEvents(e);
      setChores(c);
      setTodos(t);
    } finally {
      setLoading(false);
    }
  };

  const todayStr = today();
  
  // Today's items
  const todaysHabits = habits.filter(h => !h.completions.includes(todayStr));
  const todaysEvents = events.filter(e => e.date === todayStr && !e.completed);
  const todaysTodos = todos.filter(t => !t.completed && (!t.dueDate || t.dueDate === todayStr));
  const todaysChores = chores.filter(c => !c.lastCompleted || c.lastCompleted !== todayStr);

  const allTodayItems = [
    ...todaysHabits.map(h => ({ ...h, type: 'habit', priority: h.priority || 'medium' })),
    ...todaysEvents.map(e => ({ ...e, type: 'event', priority: e.priority || 'high' })),
    ...todaysTodos.map(t => ({ ...t, type: 'todo', priority: t.priority || 'medium' })),
    ...todaysChores.map(c => ({ ...c, type: 'chore', priority: c.priority || 'low' })),
  ].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
  });

  const toggleComplete = async (item: any, type: string) => {
    if (type === 'habit') {
      const updated = { ...item, completions: [...item.completions, todayStr] };
      await apiCall(`/habits?userId=${userId}`, { method: 'PUT', body: JSON.stringify(updated) });
    } else if (type === 'event') {
      await apiCall(`/events?userId=${userId}`, { method: 'PUT', body: JSON.stringify({ ...item, completed: true }) });
    } else if (type === 'todo') {
      await apiCall(`/todos?userId=${userId}`, { method: 'PUT', body: JSON.stringify({ ...item, completed: true }) });
    } else if (type === 'chore') {
      await apiCall(`/chores?userId=${userId}`, { method: 'PUT', body: JSON.stringify({ ...item, lastCompleted: todayStr }) });
    }
    loadData();
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h2 className="page-title">📊 Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{habits.length}</div>
            <div className="stat-label">Active Habits</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">Upcoming Events</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🧹</div>
          <div className="stat-content">
            <div className="stat-value">{chores.length}</div>
            <div className="stat-label">Chores</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{todos.filter(t => !t.completed).length}</div>
            <div className="stat-label">Pending Todos</div>
          </div>
        </div>
      </div>

      {/* Today's Checklist */}
      <div className="todays-checklist">
        <h3>📝 Today's Checklist ({allTodayItems.length} items)</h3>
        {allTodayItems.length === 0 ? (
          <div className="empty-state">
            <p>🎉 All done for today! Great job!</p>
          </div>
        ) : (
          <div className="checklist">
            {allTodayItems.map((item, idx) => (
              <div key={idx} className="checklist-item">
                <button
                  className="checkbox"
                  onClick={() => toggleComplete(item, item.type)}
                >
                  ☐
                </button>
                <div className="item-content">
                  <span className="item-title">{item.title || item.name}</span>
                  <span className={`item-badge badge-${item.type}`}>{item.type}</span>
                  <span className={`priority-badge priority-${item.priority}`}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Summary */}
      <div className="weekly-summary">
        <h3>📈 This Week</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span>Habits Completed:</span>
            <strong>{habits.reduce((sum, h) => sum + h.completions.length, 0)}</strong>
          </div>
          <div className="summary-item">
            <span>Events Done:</span>
            <strong>{events.filter(e => e.completed).length}</strong>
          </div>
          <div className="summary-item">
            <span>Todos Done:</span>
            <strong>{todos.filter(t => t.completed).length}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
