import { useEffect, useState, useRef } from "react";

import API from "../services/api";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    due_date: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchTasks = async () => {

    try {

      const response = await API.get(
        "/tasks/list/"
      );

      setTasks(response.data);

    } catch (error) {

      console.log(error);

      alert("Failed to fetch tasks");
    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await API.post(
        "/tasks/",
        formData
      );

      alert("Task Created Successfully");

      setFormData({
        title: "",
        description: "",
        priority: "Low",
        due_date: "",
      });

      setShowAddModal(false);
      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Failed to create task");
    }
  };

  const handleDelete = async (id) => {

    try {

      await API.delete(
        `/tasks/delete/${id}/`
      );

      alert("Task Deleted");

      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Failed to delete task");
    }
  };

  const handleComplete = async (task) => {

    try {

      await API.put(
        `/tasks/${task.id}/`,
        {
          completed: !task.completed,
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);

      alert("Failed to update task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      due_date: task.due_date,
    });
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await API.put(
        `/tasks/${id}/`,
        editData
      );

      alert("Task Updated Successfully");
      setEditingId(null);
      setEditData({});
      fetchTasks();
    } catch (error) {
      console.log(error);
      alert("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const [showProfile, setShowProfile] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [userProfile, setUserProfile] = useState({ username: 'Loading...', email: '...' });
  const [activeTab, setActiveTab] = useState('dashboard');

  const fetchProfile = async () => {
    try {
      const response = await API.get('/profile/');
      setUserProfile({
        username: response.data.username || 'User',
        email: response.data.email || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile', error);
      // Fallback if the profile API fails
      setUserProfile({
        username: localStorage.getItem('username') || 'User',
        email: ''
      });
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriority = tasks.filter(t => t.priority === 'High' && !t.completed).length;

  const displayedTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : filterStatus === 'Completed' ? t.completed : !t.completed;
    const matchesPriority = filterPriority === 'All' ? true : t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const renderCalendar = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    return (
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
          const dayTasks = displayedTasks.filter(t => t.due_date === dateStr);
          const isToday = (i + 1) === today.getDate();
          return (
            <div key={i} className={`p-2 border rounded ${isToday ? 'bg-green-50' : 'bg-white'}`}>
              <div className="text-xs font-bold">{i + 1}</div>
              {dayTasks.map(t => <div key={t.id} className="text-[10px] truncate bg-green-100 text-green-800 rounded px-1 my-0.5">{t.title}</div>)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex font-sans text-gray-800">

      {/* Sidebar */}
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'tasks' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                Tasks
                <span className={`ml-auto py-0.5 px-2 rounded-md text-xs ${activeTab === 'tasks' ? 'bg-green-200 text-green-800' : 'bg-green-100 text-green-700'}`}>{pendingTasks}</span>
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'calendar' ? 'bg-green-50 text-green-700 border-l-4 border-green-600' : 'text-gray-500 hover:bg-gray-50'
                  }`}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
          {activeTab === 'tasks' ? (
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
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
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gray-50 border-none rounded-full py-2.5 pl-4 pr-8 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 appearance-none font-medium cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
                <svg className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>

              <div className="relative">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-gray-50 border-none rounded-full py-2.5 pl-4 pr-8 text-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-600 appearance-none font-medium cursor-pointer"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
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

          <div className="flex items-center gap-6">
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-400 hover:text-gray-600 relative focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {highPriority > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
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
                      <div className="px-4 py-4 text-center text-sm text-gray-500">
                        You're all caught up! No urgent notifications.
                      </div>
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

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">

          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'tasks' && 'All Tasks'}
                {activeTab === 'calendar' && 'Calendar View'}
                {activeTab === 'help' && 'Help Center'}
              </h1>
              <p className="text-gray-500">
                {activeTab === 'dashboard' && 'Plan, prioritize, and accomplish your tasks with ease.'}
                {activeTab === 'tasks' && 'Manage and organize all your current and past tasks.'}
                {activeTab === 'calendar' && 'Keep track of your deadlines by date.'}
                {activeTab === 'help' && 'Find answers to frequently asked questions below.'}
              </p>
            </div>
            {(activeTab === 'dashboard' || activeTab === 'tasks') && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-[#166534] hover:bg-green-800 text-white font-medium rounded-full flex items-center gap-2 shadow-md transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Add Task
              </button>
            )}
          </div>

          {/* Render content based on activeTab */}
          {activeTab === 'dashboard' && (
            <>
              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Green Solid Card */}
                <div className="bg-[#166534] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
                  <h3 className="text-green-100 font-medium mb-2 relative z-10">Total Tasks</h3>
                  <div className="text-4xl font-bold mb-4 relative z-10">{totalTasks}</div>
                  <div className="flex items-center gap-1 text-sm text-green-200 relative z-10">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    Track your full workload
                  </div>
                </div>

                {/* White Cards */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-gray-500 font-medium mb-2">Completed Tasks</h3>
                  <div className="text-4xl font-bold text-gray-800 mb-4">{completedTasks}</div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Successfully finished
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-gray-500 font-medium mb-2">Running Tasks</h3>
                  <div className="text-4xl font-bold text-gray-800 mb-4">{pendingTasks}</div>
                  <div className="flex items-center gap-1 text-sm text-blue-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Currently in progress
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h3 className="text-gray-500 font-medium mb-2">High Priority</h3>
                  <div className="text-4xl font-bold text-gray-800 mb-4">{highPriority}</div>
                  <div className="flex items-center gap-1 text-sm text-red-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Needs immediate attention
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Task List Section */}
                <div className="lg:col-span-3 space-y-6">

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
                      {displayedTasks.length > 3 && (
                        <button
                          onClick={() => setActiveTab('tasks')}
                          className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1"
                        >
                          View All
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </button>
                      )}
                    </div>

                    {displayedTasks.length === 0 ? (
                      <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 font-medium">No tasks found. Create one to get started!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...displayedTasks].sort((a, b) => b.id - a.id).slice(0, 3).map((task) => (
                          <div key={task.id} className={`p-5 rounded-xl border transition-all ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-green-300 hover:shadow-md'}`}>
                            {editingId === task.id ? (
                              <div className="space-y-4">
                                <input
                                  type="text"
                                  name="title"
                                  value={editData.title}
                                  onChange={handleEditChange}
                                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                <textarea
                                  name="description"
                                  value={editData.description}
                                  onChange={handleEditChange}
                                  rows="2"
                                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
                                />
                                <div className="flex gap-4">
                                  <select name="priority" value={editData.priority} onChange={handleEditChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1">
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                  </select>
                                  <input type="date" name="due_date" value={editData.due_date} onChange={handleEditChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1" />
                                </div>
                                <div className="flex gap-2">
                                  <button onClick={() => handleUpdate(task.id)} className="px-4 py-2 bg-[#166534] text-white rounded-lg text-sm font-medium">Save Changes</button>
                                  <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className={`text-lg font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                      {task.title}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                      task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                                        'bg-green-50 text-green-600'
                                      }`}>
                                      {task.priority}
                                    </span>
                                  </div>
                                  <p className={`text-sm mb-4 ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {task.description}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Due Date: {new Date(task.due_date).toLocaleDateString()}
                                  </div>
                                </div>

                                <div className="flex flex-row sm:flex-col gap-2 justify-start sm:justify-center border-t sm:border-t-0 pt-4 sm:pt-0 sm:border-l border-gray-100 sm:pl-4">
                                  <button onClick={() => handleComplete(task)} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${task.completed ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                    {task.completed ? 'Undo' : 'Complete'}
                                  </button>
                                  <button onClick={() => startEdit(task)} disabled={task.completed} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${task.completed ? 'opacity-50' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    Edit
                                  </button>
                                  <button onClick={() => handleDelete(task.id)} className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </>
          )}

          {/* Tasks View */}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                <h2 className="text-2xl font-bold text-gray-800">Task Directory</h2>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold">Total: {totalTasks}</span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">Pending: {pendingTasks}</span>
                </div>
              </div>

              {displayedTasks.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium text-lg">No tasks found matching your search.</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or create a new task.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedTasks.map(task => (
                    <div key={task.id} className={`p-6 rounded-2xl border ${task.completed ? 'bg-gray-50 border-gray-100 opacity-75' : 'bg-white border-gray-200 shadow-sm'}`}>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className={`text-xl font-bold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{task.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                          task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
                            'bg-green-50 text-green-600'
                          }`}>{task.priority}</span>
                      </div>
                      <p className="text-gray-600 mb-6 min-h-[3rem]">{task.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {new Date(task.due_date).toLocaleDateString()}
                        </div>
                        {task.completed ? (
                          <span className="text-green-600 font-bold flex items-center gap-1 text-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            Completed
                          </span>
                        ) : (
                          <span className="text-blue-500 font-bold flex items-center gap-1 text-sm">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Calendar View */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-6">Upcoming Deadlines</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {[...displayedTasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).map((task, idx) => (
                  <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-white hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.completed ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-600'
                          }`}>
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                  </div>
                ))}
                {displayedTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-10 relative z-10 bg-white">
                    You have no upcoming deadlines matching your search.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help & FAQ View */}
          {activeTab === 'help' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    How do I create a new task?
                  </h3>
                  <p className="text-gray-600 ml-7 leading-relaxed">
                    To create a new task, click the dark green <strong>"+ Add Task"</strong> button located in the top right corner of your screen. This will open a modal where you can fill in your task's title, description, priority, and due date.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Can I edit a task after saving it?
                  </h3>
                  <p className="text-gray-600 ml-7 leading-relaxed">
                    Yes! On any task card, you will see a blue <strong>"Edit"</strong> button at the bottom. Clicking this will let you modify the task details inline. Make sure to click <strong>"Save Changes"</strong> when you are done. Note: You cannot edit tasks that are already marked as completed.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    How do I mark a task as done?
                  </h3>
                  <p className="text-gray-600 ml-7 leading-relaxed">
                    Just click the <strong>"Complete"</strong> button on the task card. The task will be visually crossed out and grouped with your completed items. You can easily click <strong>"Undo"</strong> if you marked it complete by mistake.
                  </p>
                </div>

                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    How does the Calendar view work?
                  </h3>
                  <p className="text-gray-600 ml-7 leading-relaxed">
                    The Calendar tab automatically organizes all your tasks chronologically based on their designated due date. It gives you both a traditional month grid and a vertical timeline view so you can easily anticipate upcoming deadlines.
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#166534] p-6 flex justify-between items-center text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                Create New Task
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-green-100 hover:text-white hover:bg-green-800 p-1.5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Task Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., Design homepage"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#166534] focus:bg-white outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  name="description"
                  required
                  placeholder="Add detailed information about this task..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#166534] focus:bg-white outline-none transition-all resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#166534] focus:bg-white outline-none transition-all appearance-none"
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    required
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#166534] focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-50 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#166534] hover:bg-green-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;