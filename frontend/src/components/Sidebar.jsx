export default function Sidebar({ activeTab, setActiveTab, pendingTasks, loading }) {
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
      <div className="h-20 flex items-center px-8 border-b border-gray-50">
        <div className="flex items-center gap-2 text-green-800 font-bold text-2xl tracking-tight">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          Taskio
        </div>
      </div>

      <div className="flex-1 flex flex-col py-6 px-4 overflow-y-auto">
        <div>
          <p className="text-xs font-semibold text-gray-400 tracking-wider mb-4 px-4">MENU</p>
          <nav className="space-y-1 mb-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'tasks' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              Tasks
              {loading ? (
                <span className="ml-auto w-6 h-5 rounded-md bg-green-200/50 animate-pulse"></span>
              ) : (
                <span className={`ml-auto py-0.5 px-2 rounded-md text-xs ${activeTab === 'tasks' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700'}`}>{pendingTasks}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'calendar' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Calendar
            </button>
          </nav>
        </div>

        <div className="mt-auto">
          <p className="text-xs font-semibold text-gray-400 tracking-wider mb-4 px-4">GENERAL</p>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('help')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'help' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Help & FAQ
            </button>
            <a href="/" onClick={() => localStorage.clear()} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
}
