# Taskio — Task Management System

A full-stack Task Management System built as part of the 6-Day Build Challenge (23/05/2026 – 28/05/2026) by Tanjer Info Systems Pvt Ltd.

---

## Project Overview :-

Taskio is a web application that allows users to register, log in, and manage their personal tasks. 

It features real-time UI updates, task filtering/sorting, a notification system, and a CSV export all wrapped in a clean, modern dashboard interface.

---

## Tech Stack :-

Frontend :- React.js (Vite), Tailwind CSS
Backend :- Django, Django REST Framework
Database :- PostgreSQL
Authentication :- JWT (JSON Web Tokens)
HTTP Client :- Axios
Notifications :- react-hot-toast

---

## Features Implemented :-

### Authentication
- User Registration with validation (password match, terms agreement)
- User Login with JWT token storage
- Protected routes :- dashboard accessible only when logged in
- Auto logout (clear token from localStorage)

### Task Management (CRUD)
- Create tasks with title, description, priority (High/Medium/Low), and due date
- Read tasks dashboard view + full task directory
- Update tasks with inline edit form
- Delete tasks with a toast-based confirmation dialog
- Mark Complete / Undo toggle task completion status

### Dashboard
- 4 Stats Cards :- Total, Completed, Running, High Priority
- Overall Progress Bar (percentage completion)
- Recent Tasks list (latest 5 tasks)
- Personalized welcome greeting with today's date

### Filtering & Sorting (Tasks Tab)
- Search tasks by title or description
- Filter by Status (All / Pending / Completed)
- Filter by Priority (All / High / Medium / Low)
- Sort by: Newest, Oldest, Due Date, Priority

### Notifications
- Bell icon in the header with red dot indicator
- Dropdown showing high-priority task count and pending task count

### Calendar View
- Timeline view of all tasks sorted by due date

### Help & FAQ
- Answers to 5 common questions about using the app

### Additional Features
- Export to CSV :- download all tasks as a spreadsheet
- Overdue Task Badge :- orange "⚠ Overdue" label on past-due tasks
- Optimistic UI Updates :- task state updates instantly without waiting for API (no page refresh needed)
- Toast messages for every action (create, update, delete, complete, errors)

---

## Project Structure

```
Task-Management/
├── backend/                  # Django REST API
│   ├── config/               # Django settings & URL config
│   ├── tasks/                # Task model, views, serializers, URLs
│   ├── users/                # User registration, login, profile
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/                 # React + Vite app
    └── src/
        ├── components/
        │   ├── Sidebar.jsx       # Navigation sidebar
        │   ├── Topbar.jsx        # Header, search, filters, profile
        │   ├── StatsCards.jsx    # Dashboard stat cards
        │   ├── TaskCard.jsx      # Reusable task card component
        │   └── AddTaskModal.jsx  # Create task modal
        ├── pages/
        │   ├── Dashboard.jsx     # Main dashboard (state & logic)
        │   ├── Login.jsx         # Login page
        │   ├── Register.jsx      # Registration page
        │   └── Terms.jsx         # Terms & Conditions page
        ├── routes/
        │   └── ProtectedRoute.jsx
        └── services/
            └── api.js            # Axios instance with auth headers
```

---

## Steps to Run the Project

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/sinan-prvt/task-management-system.git
cd task-management-system
```

---

### 2. Backend Setup (Django)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the development server
python manage.py runserver
```

Backend will run at: `http://127.0.0.1:8000`

---

### 3. Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

## 🧩 Challenges Faced

1. JWT Authentication Flow — Integrating JWT tokens with React required careful handling of token storage in `localStorage` and attaching the `Authorization` header to every Axios request automatically using an interceptor.

2. Optimistic UI Updates — Instead of refetching all tasks from the server after every action (which caused a visible delay), I implemented optimistic updates — the UI updates instantly and reverts if the API call fails.

3. Component Structure — The Dashboard started as a single file with 900+ lines. Refactoring it into clean, separate components (`Sidebar`, `Topbar`, `TaskCard`, etc.) improved readability and maintainability significantly.

4. Conditional Rendering Logic — Managing which UI elements appear on which tab (e.g., search bar only on Tasks, Add Task button only on Dashboard and Tasks) required careful state-driven conditional rendering.

5. Toast-Based Delete Confirmation — Replacing `window.confirm()` with a custom inline confirmation inside a toast notification was a UX challenge that required understanding how `react-hot-toast` handles custom JSX content.

---

## What I Learned

- How to build a REST API with Django REST Framework including token-based authentication
- How JWT works — issuing tokens on login, storing them client-side, and using them to protect API routes
- How Axios interceptors work to automatically inject auth headers on every request
- The concept of optimistic UI updates and how they improve perceived performance
- How to structure a React app into reusable components for better code organization
- How to use react-hot-toast for elegant, non-blocking user feedback
- How to implement client-side filtering and sorting on a dynamic dataset

---

## Deployment

The application is deployed live using modern cloud hosting platforms:

- Frontend :- Deployed on Vercel. Uses Vite build commands to generate a static site.
- Backend :- Deployed on Render.com. Runs using Gunicorn and WhiteNoise for static file serving.
- Database :- Hosted on Neon.tech (Serverless PostgreSQL). Configured using `dj-database-url` in Django settings.

---

## Key Pages

- Login :- JWT-authenticated login form
- Register :- Registration with validation
- Dashboard :- Stats, progress bar, recent tasks
- Tasks :- Full task list with search, filter, sort
- Calendar :- Timeline view of deadlines
- Help & FAQ :- Answers to common questions