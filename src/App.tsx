import { useState, useEffect } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';
import Calendar from './components/Calendar';
import Progress from './components/Progress';
import type { User, Tab, Theme } from './types';
import './styles/App.css';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [theme, setTheme] = useState<Theme>('lavender');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setActiveTab('dashboard');
  };

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    localStorage.setItem('theme', t);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className={`app theme-${theme}`}>
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        userName={user.name}
        onLogout={handleLogout}
        theme={theme}
        onThemeChange={handleThemeChange}
      />
      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard userId={user.id} />}
        {activeTab === 'tracker' && <Tracker userId={user.id} />}
        {activeTab === 'calendar' && <Calendar userId={user.id} />}
        {activeTab === 'progress' && <Progress userId={user.id} />}
      </main>
    </div>
  );
}
