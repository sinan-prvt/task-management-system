export default function StatsCards({ totalTasks, completedTasks, pendingTasks, highPriority }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-[#166534] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <h3 className="text-green-100 font-medium mb-2 relative z-10">Total Tasks</h3>
        <div className="text-4xl font-bold mb-4 relative z-10">{totalTasks}</div>
        <div className="flex items-center gap-1 text-sm text-green-200 relative z-10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
          Track your full workload
        </div>
      </div>

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
  );
}
