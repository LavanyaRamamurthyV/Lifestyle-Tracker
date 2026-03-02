import type { Tab, Theme } from '../types';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  userName: string;
  onLogout: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function Navigation({ activeTab, onTabChange, userName, onLogout, theme, onThemeChange }: Props) {
  const tabs: Tab[] = ['dashboard', 'tracker', 'calendar', 'progress'];
  const themes: Theme[] = ['lavender', 'blue', 'green', 'orange', 'pink'];

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h1 className="app-title">🎯 Lifestyle Tracker</h1>
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="nav-right">
        <select
          className="theme-select"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value as Theme)}
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <span className="user-name">Hi, {userName}</span>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
