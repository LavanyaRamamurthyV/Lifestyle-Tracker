import { useState, useEffect } from 'react';
import { apiCall, getDaysInMonth } from '../utils';
import type { Habit, Event, Chore, Todo, TrackerView } from '../types';

export default function Tracker({ userId }: { userId: string }) {
  const [view, setView] = useState<TrackerView>('kanban');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState<'habit' | 'event' | 'chore' | 'todo'>('habit');

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
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
  };

  return (
    <div className="tracker">
      <div className="tracker-header">
        <h2 className="page-title">📋 Tracker</h2>
        <div className="tracker-actions">
          <select
            className="add-dropdown"
            value={addType}
            onChange={(e) => {
              setAddType(e.target.value as any);
              setShowAddModal(true);
            }}
          >
            <option value="">+ Add...</option>
            <option value="habit">Habit</option>
            <option value="event">Event</option>
            <option value="chore">Chore</option>
            <option value="todo">Todo</option>
          </select>
          <button
            className={`view-toggle ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => setView('kanban')}
          >
            📌 Kanban
          </button>
          <button
            className={`view-toggle ${view === 'tabular' ? 'active' : ''}`}
            onClick={() => setView('tabular')}
          >
            📊 Tabular
          </button>
        </div>
      </div>

      {view === 'kanban' ? (
        <KanbanView
          habits={habits}
          events={events}
          chores={chores}
          todos={todos}
          onUpdate={loadData}
          userId={userId}
        />
      ) : (
        <TabularView
          habits={habits}
          events={events}
          chores={chores}
          todos={todos}
          onUpdate={loadData}
          userId={userId}
        />
      )}

      {showAddModal && (
        <AddItemModal
          type={addType}
          userId={userId}
          onClose={() => setShowAddModal(false)}
          onAdd={loadData}
        />
      )}
    </div>
  );
}

// Kanban View Component
function KanbanView({ habits, events, chores, todos, onUpdate, userId }: any) {
  return (
    <div className="kanban-view">
      <div className="kanban-column">
        <h3>🎯 Habits ({habits.length})</h3>
        <div className="kanban-cards">
          {habits.map((h: Habit) => (
            <div key={h.id} className="kanban-card">
              <div className="card-title">{h.name}</div>
              <div className="card-meta">
                {h.frequency} • {h.completions.length}/{h.dailyTarget} today
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kanban-column">
        <h3>📅 Events ({events.length})</h3>
        <div className="kanban-cards">
          {events.map((e: Event) => (
            <div key={e.id} className="kanban-card">
              <div className="card-title">{e.title}</div>
              <div className="card-meta">
                {e.date} {e.time && `at ${e.time}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="kanban-column">
        <h3>🧹 Chores ({chores.length})</h3>
        <div className="kanban-cards">
          {chores.map((c: Chore) => (
            <div key={c.id} className="kanban-card">
              <div className="card-title">{c.title}</div>
              <div className="card-meta">{c.frequency}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="kanban-column">
        <h3>✅ Todos ({todos.length})</h3>
        <div className="kanban-cards">
          {todos.map((t: Todo) => (
            <div key={t.id} className="kanban-card">
              <div className="card-title">{t.title}</div>
              <div className="card-meta">
                {t.dueDate || 'No due date'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Tabular View Component (Excel-style)
function TabularView({ habits, events, chores, todos, userId }: any) {
  const days = getDaysInMonth();

  return (
    <div className="tabular-view">
      <div className="table-container">
        <table className="tracker-table">
          <thead>
            <tr>
              <th className="sticky-col">Type</th>
              <th className="sticky-col">Item</th>
              {days.map((d, idx) => (
                <th key={idx} className="day-col">
                  {d.getDate()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map((h: Habit) => (
              <tr key={h.id}>
                <td className="sticky-col type-badge">Habit</td>
                <td className="sticky-col item-name">{h.name}</td>
                {days.map((d, idx) => {
                  const dateStr = d.toISOString().split('T')[0];
                  const completed = h.completions.includes(dateStr);
                  return (
                    <td key={idx} className={`day-cell ${completed ? 'completed' : ''}`}>
                      {completed ? '✓' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
            {events.map((e: Event) => (
              <tr key={e.id}>
                <td className="sticky-col type-badge">Event</td>
                <td className="sticky-col item-name">{e.title}</td>
                {days.map((d, idx) => {
                  const dateStr = d.toISOString().split('T')[0];
                  const isEventDay = e.date === dateStr;
                  return (
                    <td key={idx} className={`day-cell ${isEventDay ? 'event-day' : ''}`}>
                      {isEventDay ? '📅' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
            {chores.map((c: Chore) => (
              <tr key={c.id}>
                <td className="sticky-col type-badge">Chore</td>
                <td className="sticky-col item-name">{c.title}</td>
                {days.map((d, idx) => {
                  const dateStr = d.toISOString().split('T')[0];
                  const isDone = c.lastCompleted === dateStr;
                  return (
                    <td key={idx} className={`day-cell ${isDone ? 'completed' : ''}`}>
                      {isDone ? '✓' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
            {todos.map((t: Todo) => (
              <tr key={t.id}>
                <td className="sticky-col type-badge">Todo</td>
                <td className="sticky-col item-name">{t.title}</td>
                {days.map((d, idx) => {
                  const dateStr = d.toISOString().split('T')[0];
                  const isDue = t.dueDate === dateStr;
                  return (
                    <td key={idx} className={`day-cell ${isDue ? 'due-day' : ''}`}>
                      {isDue && !t.completed ? '⚠️' : t.completed && isDue ? '✓' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add Item Modal
function AddItemModal({ type, userId, onClose, onAdd }: any) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title.trim()) return;
    setLoading(true);
    try {
      const baseItem = { userId, title };
      if (type === 'habit') {
        await apiCall(`/habits?userId=${userId}`, {
          method: 'POST',
          body: JSON.stringify({ ...baseItem, name: title, frequency: 'daily', dailyTarget: 1, completions: [] })
        });
      } else if (type === 'event') {
        await apiCall(`/events?userId=${userId}`, {
          method: 'POST',
          body: JSON.stringify({ ...baseItem, date: new Date().toISOString().split('T')[0], completed: false })
        });
      } else if (type === 'chore') {
        await apiCall(`/chores?userId=${userId}`, {
          method: 'POST',
          body: JSON.stringify({ ...baseItem, frequency: 'weekly' })
        });
      } else if (type === 'todo') {
        await apiCall(`/todos?userId=${userId}`, {
          method: 'POST',
          body: JSON.stringify({ ...baseItem, completed: false })
        });
      }
      onAdd();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Add {type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
          autoFocus
        />
        <div className="modal-actions">
          <button onClick={handleAdd} disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
