# 🎯 Lifestyle Tracker - Complete Application

A comprehensive lifestyle management application with habits, events, chores, todos tracking. Features include Dashboard with today's checklist, Tracker with Kanban & Tabular views, Calendar, and Progress analysis.

## ✨ Features

### 🔐 Authentication
- User registration and login
- Secure password hashing
- Persistent sessions

### 📊 Dashboard
- **Today's Checklist** - All items due today, sorted by priority
- **Stats Cards** - Quick overview of habits, events, chores, todos
- **Weekly Summary** - Completion metrics for the week
- Priority-based sorting (High → Medium → Low)

### 📋 Tracker
- **4 Item Types**: Habits, Events, Chores, Todos
- **Kanban View**: 4-column board for visual organization
- **Tabular View**: Excel-style month view with days as columns
- **Quick Add**: Dropdown to add any item type instantly
- Toggle between views with one click

### 📅 Calendar
- Day / Week / Month views
- Visual event display
- Month navigation
- Event indicators

### 📈 Progress & Analysis
- Daily progress line chart (last 7 days)
- Habit performance breakdown
- Streak tracking for each habit
- Weekly completion rates
- Todo completion percentage
- Total activity metrics

### 🎨 Themes
- **Lavender** (Default) - Soft purple tones
- **Blue** - Professional blue
- **Green** - Fresh green
- **Orange** - Vibrant orange
- **Pink** - Warm pink

Theme persists across sessions

## 🚀 Quick Deploy

### Prerequisites
1. Supabase account (free)
2. Vercel account (free)
3. GitHub account

### Step 1: Setup Supabase

1. Go to https://supabase.com and create account
2. Create new project
3. Open SQL Editor and run this script:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE habits (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  frequency TEXT NOT NULL,
  days_of_week TEXT[],
  daily_target INTEGER DEFAULT 1,
  completions JSONB DEFAULT '[]'::jsonb,
  icon TEXT,
  priority TEXT,
  difficulty TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  description TEXT,
  completed BOOLEAN DEFAULT false,
  priority TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chores (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  frequency TEXT NOT NULL,
  last_completed TEXT,
  priority TEXT,
  difficulty INTEGER,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE todos (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  due_date TEXT,
  priority TEXT,
  difficulty INTEGER,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE chores ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all" ON users FOR ALL USING (true);
CREATE POLICY "Enable all" ON habits FOR ALL USING (true);
CREATE POLICY "Enable all" ON events FOR ALL USING (true);
CREATE POLICY "Enable all" ON chores FOR ALL USING (true);
CREATE POLICY "Enable all" ON todos FOR ALL USING (true);
```

4. Go to Settings → API and copy:
   - **Project URL**
   - **anon public key**

### Step 2: Deploy to Vercel

1. Push this code to your GitHub repository
2. Go to https://vercel.com
3. Click "New Project"
4. Import your repository
5. Add Environment Variables:
   - `SUPABASE_URL` = Your project URL
   - `SUPABASE_KEY` = Your anon public key
6. Click "Deploy"

### Step 3: Use the App!

Your app will be live at: `https://your-project.vercel.app`

1. Register a new account
2. Start adding habits, events, chores, and todos
3. Check Dashboard for today's checklist
4. Use Tracker for different views
5. Monitor Progress for analytics

## 📁 Project Structure

```
lifestyle-tracker/
├── api/                    # Vercel serverless functions
│   ├── auth.ts            # Authentication
│   ├── habits.ts          # Habits CRUD with UUID fix
│   ├── events.ts          # Events CRUD
│   ├── chores.ts          # Chores CRUD
│   └── todos.ts           # Todos CRUD
├── src/
│   ├── components/        # React components
│   │   ├── Login.tsx      # Login with visible buttons
│   │   ├── Navigation.tsx # Top nav with theme selector
│   │   ├── Dashboard.tsx  # Today's checklist + stats
│   │   ├── Tracker.tsx    # Kanban + Tabular views
│   │   ├── Calendar.tsx   # Month calendar view
│   │   └── Progress.tsx   # Charts + habit analysis
│   ├── styles/            # CSS
│   │   ├── index.css
│   │   └── App.css        # All styles with 5 themes
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   ├── types.ts           # TypeScript definitions
│   └── utils.ts           # Helper functions
├── package.json
├── vercel.json
├── vite.config.ts
├── tsconfig.json
└── index.html
```

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage Guide

### Dashboard
- View all items due today
- Items sorted by priority (High → Medium → Low)
- Click checkbox to complete items
- See weekly completion summary

### Tracker
- **Kanban View**: Visual board with 4 columns (Habits, Events, Chores, Todos)
- **Tabular View**: Month grid showing all days
  - Rows: Your items
  - Columns: Days of the month
  - ✓ = Completed
  - 📅 = Event scheduled
  - ⚠️ = Todo due
- Use "Add..." dropdown to create new items

### Calendar
- Switch between Day/Week/Month views
- Navigate months with arrows
- Click dates to see events
- Today highlighted

### Progress
- View daily completion chart
- See habit streaks
- Monitor weekly goals
- Track completion rates

## 🔧 Troubleshooting

### Login button not visible
- The new version has large, clearly visible buttons
- "Sign In" and "Create Account" buttons are always visible
- If not visible, check browser console for CSS errors

### Data not saving
- Verify Supabase environment variables are set in Vercel
- Check Supabase database tables exist
- Look at Vercel function logs for errors

### Build fails
- Ensure all dependencies installed: `npm install`
- Check Node version is 18 or higher
- Verify tsconfig files exist

## 📊 Data Model

All tables use UUID primary keys and include `user_id` for multi-user support.

**Habits**: Track recurring activities with daily targets and completion history

**Events**: One-time calendar events with dates, times, and completion status

**Chores**: Recurring tasks with last completion tracking

**Todos**: Task list items with optional due dates

## 🎨 Customization

Change theme from Navigation bar (top right dropdown)

Themes persist in localStorage

## 📄 License

MIT License - Free to use and modify

## 🙏 Support

For issues:
1. Check browser console
2. Verify Supabase connection
3. Check Vercel deployment logs
4. Review this README

---

**Built with:** React, TypeScript, Vite, Vercel, Supabase

**Status:** Production Ready ✅

**Features:** Login, Dashboard, Tracker (Kanban+Tabular), Calendar, Progress+Analysis, 5 Themes
