import { useState, useEffect } from 'react';
import { apiCall } from '../utils';
import type { Event } from '../types';

export default function Calendar({ userId }: { userId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadEvents();
  }, [userId]);

  const loadEvents = async () => {
    const data = await apiCall(`/events?userId=${userId}`);
    setEvents(data);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(e => e.date === dateStr);
  };

  const days = getDaysInMonth();

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h2 className="page-title">📅 Calendar</h2>
        <div className="calendar-controls">
          <button onClick={() => setView('day')} className={view === 'day' ? 'active' : ''}>
            Day
          </button>
          <button onClick={() => setView('week')} className={view === 'week' ? 'active' : ''}>
            Week
          </button>
          <button onClick={() => setView('month')} className={view === 'month' ? 'active' : ''}>
            Month
          </button>
        </div>
      </div>

      <div className="calendar-nav">
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
          ← Prev
        </button>
        <h3>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
          Next →
        </button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        <div className="calendar-days">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`calendar-day ${!day ? 'empty' : ''} ${day && day.toDateString() === new Date().toDateString() ? 'today' : ''}`}
            >
              {day && (
                <>
                  <div className="day-number">{day.getDate()}</div>
                  <div className="day-events">
                    {getEventsForDate(day).map(event => (
                      <div key={event.id} className="event-dot" title={event.title}>
                        {event.title.substring(0, 10)}...
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
