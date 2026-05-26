import { useRef, useState } from "react";

export default function Topbar({
  activeTab, userProfile, highPriority, pendingTasks,
  searchQuery, setSearchQuery,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
  sortBy, setSortBy,
}) {
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleOutsideClick = (ref, setter) => (e) => {
    if (ref.current && !ref.current.contains(e.target)) setter(false);
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">

      {/* Left: Search/Filters or Welcome */}
      {activeTab === 'tasks' ? (
        <div className="flex items-center gap-3 flex-1 max-w-3xl">
          <div className="relative flex-1">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-full py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
          </div>
          <div className="relative">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-gray-50 border-none rounded-full py-2.5 pl-4 pr-8 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 appearance-none font-medium cursor-pointer">
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="relative">
            <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="bg-gray-50 border-none rounded-full py-2.5 pl-4 pr-8 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 appearance-none font-medium cursor-pointer">
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-gray-50 border-none rounded-full py-2.5 pl-4 pr-8 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 appearance-none font-medium cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="due_date">By Due Date</option>
              <option value="priority">By Priority</option>
            </select>
            <svg className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center">
          <h2 className="text-xl font-bold text-gray-800">
            {activeTab === 'dashboard' ? `Welcome back, ${userProfile.username || 'User'}! ` : ''}
          </h2>
          {activeTab === 'dashboard' && (
            <span className="ml-4 text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          )}
        </div>
      )}

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-6">

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            onBlur={() => setTimeout(() => setShowNotifications(false), 150)}
            className="text-gray-400 hover:text-gray-600 relative focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {highPriority > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50">
              <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800">Notifications</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {highPriority > 0 ? (
                  <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-red-500 bg-red-50/30">
                    <p className="text-sm font-medium text-gray-800">High Priority Tasks</p>
                    <p className="text-xs text-gray-500 mt-1">You have {highPriority} task(s) marked as high priority that need immediate attention.</p>
                  </div>
                ) : (
                  <div className="px-4 py-4 text-center text-sm text-gray-500">You&apos;re all caught up! No urgent notifications.</div>
                )}
                {pendingTasks > 0 && (
                  <div className="px-4 py-3 hover:bg-gray-50 border-l-4 border-blue-500 mt-1">
                    <p className="text-sm font-medium text-gray-800">Pending Tasks</p>
                    <p className="text-xs text-gray-500 mt-1">You currently have {pendingTasks} tasks waiting to be completed.</p>
                  </div>
                )}
              </div>
              <div className="px-4 pt-3 border-t border-gray-50 mt-2 text-center">
                <button onClick={() => setShowNotifications(false)} className="text-sm font-bold text-green-600 hover:text-green-700">Close</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 border-l pl-6 border-gray-200 hover:bg-gray-50 p-2 rounded-xl transition-colors focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold uppercase">
              {userProfile.username.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold text-gray-800">{userProfile.username}</p>
              <p className="text-xs text-gray-500">{userProfile.email}</p>
            </div>
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-4 z-50">
              <div className="px-6 pb-4 border-b border-gray-100 mb-2">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl uppercase mx-auto mb-3">
                  {userProfile.username.charAt(0)}
                </div>
                <p className="text-center font-bold text-gray-900 text-lg">{userProfile.username}</p>
                <p className="text-center text-sm text-gray-500">{userProfile.email}</p>
              </div>
              <div className="px-4 py-2">
                <div className="text-sm text-gray-600 mb-2 font-semibold">Account Details</div>
                <div className="text-xs text-gray-500 flex justify-between mb-1"><span>Role:</span> <span className="font-medium text-gray-800">User</span></div>
                <div className="text-xs text-gray-500 flex justify-between"><span>Status:</span> <span className="text-green-600 font-medium">Active</span></div>
              </div>
              <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                <a href="/" onClick={() => localStorage.clear()} className="block w-full text-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
                  Sign Out
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
