import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import TaskCard from "../components/TaskCard";
import AddTaskModal from "../components/AddTaskModal";
import SkeletonCard from "../components/SkeletonCard";

function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState({ username: 'Loading...', email: '...' });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({ title: "", description: "", priority: "Low", due_date: "" });

  const fetchTasks = async () => {
    try {
      const [response] = await Promise.all([
        API.get("/tasks/list/"),
        new Promise(resolve => setTimeout(resolve, 2000))
      ]);
      setTasks(response.data.results || response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await API.get('/profile/');
      setUserProfile({ username: response.data.username || 'User', email: response.data.email || '' });
    } catch (error) {
      setUserProfile({ username: localStorage.getItem('username') || 'User', email: '' });
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await API.post("/tasks/", formData);
      setTasks(prev => [response.data, ...prev]);
      toast.success("Task Created Successfully");
      setFormData({ title: "", description: "", priority: "Low", due_date: "" });
      setShowAddModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async (id) => {
    const prevTasks = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await API.delete(`/tasks/delete/${id}/`);
      toast.success("Task Deleted");
    } catch (error) {
      setTasks(prevTasks);
      toast.error("Failed to delete task");
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <p className="text-sm font-semibold text-gray-800">Are you sure you want to delete this task?</p>
        <div className="flex gap-2 justify-end mt-2">
          <button onClick={() => toast.dismiss(t.id)} className="px-4 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
          <button onClick={() => { toast.dismiss(t.id); confirmDelete(id); }} className="px-4 py-1.5 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">Delete</button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const handleComplete = async (task) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    try {
      await API.put(`/tasks/${task.id}/`, { completed: !task.completed });
      toast.success(task.completed ? "Task marked as pending." : "Task marked as completed!");
    } catch (error) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: task.completed } : t));
      toast.error("Failed to update task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditData({ title: task.title, description: task.description, priority: task.priority, due_date: task.due_date ? task.due_date.split('T')[0] : "" });
  };

  const handleEditChange = (e) => setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleUpdate = async (id) => {
    setSubmitting(true);
    const prevTasks = tasks;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...editData } : t));
    setEditingId(null);
    try {
      await API.put(`/tasks/${id}/`, editData);
      toast.success("Task Updated Successfully");
      setEditData({});
    } catch (error) {
      setTasks(prevTasks);
      setEditingId(id);
      toast.error("Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => { setEditingId(null); setEditData({}); };

  const exportToCSV = () => {
    if (tasks.length === 0) { toast.error("No tasks to export!"); return; }
    const headers = ["Title", "Description", "Priority", "Status", "Due Date"];
    const csvRows = [headers.join(","), ...tasks.map(t => [
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.priority,
      t.completed ? 'Completed' : 'Pending',
      t.due_date || 'N/A',
    ].join(","))];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `taskio_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tasks exported successfully!");
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriority = tasks.filter(t => t.priority === 'High' && !t.completed).length;

  const isOverdue = (task) => {
    if (!task.due_date || task.completed) return false;
    return new Date(task.due_date) < new Date(new Date().toDateString());
  };

  const displayedTasks = tasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'All' ? true : filterStatus === 'Completed' ? t.completed : !t.completed;
    const matchesPriority = filterPriority === 'All' ? true : t.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'due_date') return new Date(a.due_date) - new Date(b.due_date);
    if (sortBy === 'priority') { const o = { High: 0, Medium: 1, Low: 2 }; return o[a.priority] - o[b.priority]; }
    return 0;
  });

  const taskHandlers = { handleComplete, startEdit, handleDelete, handleEditChange, handleUpdate, cancelEdit, isOverdue, editingId, editData, submitting };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f4f7f6] flex font-sans text-gray-800">

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} pendingTasks={pendingTasks} loading={loading} />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        <Topbar
          activeTab={activeTab}
          userProfile={userProfile}
          highPriority={highPriority}
          pendingTasks={pendingTasks}
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filterStatus={filterStatus} setFilterStatus={setFilterStatus}
          filterPriority={filterPriority} setFilterPriority={setFilterPriority}
          sortBy={sortBy} setSortBy={setSortBy}
          loading={loading}
        />

        <div className="flex-1 overflow-y-auto p-8">

          {/* Page Header */}
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
              <div className="flex items-center gap-3">
                <button onClick={exportToCSV} className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium rounded-full flex items-center gap-2 shadow-sm transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Export CSV
                </button>
                <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-[#166534] hover:bg-green-800 text-white font-medium rounded-full flex items-center gap-2 shadow-md transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                  Add Task
                </button>
              </div>
            )}
          </div>

          {/* ── Dashboard Tab ── */}
          {activeTab === 'dashboard' && (
            <>
              <StatsCards totalTasks={totalTasks} completedTasks={completedTasks} pendingTasks={pendingTasks} highPriority={highPriority} loading={loading} />

              {totalTasks > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">Overall Progress</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{completedTasks} of {totalTasks} tasks completed</p>
                    </div>
                    <span className="text-2xl font-bold text-[#166534]">{Math.round((completedTasks / totalTasks) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-gradient-to-r from-green-500 to-[#166534] h-3 rounded-full transition-all duration-700" style={{ width: `${(completedTasks / totalTasks) * 100}%` }}></div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Recent Tasks</h2>
                  {displayedTasks.length > 2 && (
                    <button onClick={() => setActiveTab('tasks')} className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center gap-1">
                      View All <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  )}
                </div>
                {loading ? (
                  <div className="space-y-4">
                    <SkeletonCard />
                    <SkeletonCard />
                  </div>
                ) : displayedTasks.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">No tasks found. Create one to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {[...displayedTasks].slice(0, 2).map(task => (
                      <TaskCard key={task.id} task={task} {...taskHandlers} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Tasks Tab ── */}
          {activeTab === 'tasks' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-6">
                <h2 className="text-2xl font-bold text-gray-800">Task Directory</h2>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold">Total: {totalTasks}</span>
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">Pending: {pendingTasks}</span>
                </div>
              </div>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : displayedTasks.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium text-lg">No tasks found matching your search.</p>
                  <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or create a new task.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayedTasks.map(task => (
                    <TaskCard key={task.id} task={task} {...taskHandlers} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Calendar Tab ── */}
          {activeTab === 'calendar' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-6">Upcoming Deadlines</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {[...displayedTasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date)).map((task) => (
                  <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-green-100 text-green-600 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm relative z-10">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-white hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">{task.title}</h4>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${task.completed ? 'bg-gray-100 text-gray-500' : 'bg-red-50 text-red-600'}`}>
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                  </div>
                ))}
                {displayedTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-10 relative z-10 bg-white">You have no upcoming deadlines.</div>
                )}
              </div>
            </div>
          )}

          {/* ── Help Tab ── */}
          {activeTab === 'help' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-gray-50 pb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {[
                  { q: "How do I create a new task?", a: `Click the dark green "+ Add Task" button in the top right. Fill in the title, description, priority, and due date.` },
                  { q: "Can I edit a task after saving it?", a: `Yes! Click the blue "Edit" button on any task card. You cannot edit completed tasks.` },
                  { q: "How do I mark a task as done?", a: `Click the "Complete" button on the task card. Click "Undo" if you marked it complete by mistake.` },
                  { q: "How does the Calendar view work?", a: `The Calendar tab organizes all your tasks chronologically by due date in a timeline view.` },
                  { q: "How does search and filtering work?", a: `On the Tasks tab, use the search bar to find tasks by title or description. Use the dropdowns to filter by Status, Priority, or Sort order.` },
                ].map(({ q, a }) => (
                  <div key={q} className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#166534] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {q}
                    </h3>
                    <p className="text-gray-600 ml-7 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {showAddModal && (
        <AddTaskModal
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          onClose={() => setShowAddModal(false)}
          submitting={submitting}
        />
      )}

    </div>
  );
}

export default Dashboard;