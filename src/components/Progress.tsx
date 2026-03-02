import { useState, useEffect } from 'react';
import { apiCall, calcStreak, getWeekDates } from '../utils';
import type { Habit, Event, Todo } from '../types';

export default function Progress({ userId }: { userId: string }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    const [h, e, t] = await Promise.all([
      apiCall(`/habits?userId=${userId}`),
      apiCall(`/events?userId=${userId}`),
      apiCall(`/todos?userId=${userId}`),
    ]);
    setHabits(h);
    setEvents(e);
    setTodos(t);
  };

  const weekDates = getWeekDates();
  const dailyCompletions = weekDates.map(date => {
    const count = habits.reduce((sum, h) => {
      return sum + (h.completions.filter(c => c === date).length > 0 ? 1 : 0);
    }, 0);
    return { date, count };
  });

  const totalCompletions = habits.reduce((sum, h) => sum + h.completions.length, 0);
  const todoCompRate = todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0;

  return (
    <div className="progress-page">
      <h2 className="page-title">📈 Progress & Analysis</h2>

      {/* Overall Stats */}
      <div className="progress-stats">
        <div className="stat-card">
          <h4>Total Completions</h4>
          <div className="stat-big">{totalCompletions}</div>
        </div>
        <div className="stat-card">
          <h4>Todo Completion Rate</h4>
          <div className="stat-big">{todoCompRate}%</div>
        </div>
        <div className="stat-card">
          <h4>Active Habits</h4>
          <div className="stat-big">{habits.length}</div>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div className="progress-chart">
        <h3>📊 Daily Progress (Last 7 Days)</h3>
        <div className="line-chart">
          {dailyCompletions.map((day, idx) => (
            <div key={idx} className="chart-bar">
              <div className="bar" style={{ height: `${Math.min(day.count * 30, 100)}%` }}>
                <span className="bar-value">{day.count}</span>
              </div>
              <div className="bar-label">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habit Analysis */}
      <div className="habit-analysis">
        <h3>🎯 Habit Performance</h3>
        {habits.map(habit => {
          const streak = calcStreak(habit.completions);
          const weeklyGoal = habit.dailyTarget * 7;
          const weeklyDone = habit.completions.filter(c => {
            const date = new Date(c);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date >= weekAgo;
          }).length;
          const completion = Math.round((weeklyDone / weeklyGoal) * 100);

          return (
            <div key={habit.id} className="habit-item">
              <div className="habit-info">
                <span className="habit-name">{habit.name}</span>
                <span className="habit-streak">🔥 {streak} day streak</span>
              </div>
              <div className="habit-progress">
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(completion, 100)}%` }}
                  />
                </div>
                <span className="progress-text">
                  {weeklyDone} / {weeklyGoal} this week ({completion}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
