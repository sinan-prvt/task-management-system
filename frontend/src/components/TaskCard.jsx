export default function TaskCard({ task, editingId, editData, handleEditChange, handleUpdate, cancelEdit, handleComplete, startEdit, handleDelete, isOverdue, submitting }) {
  const priorityClass = task.priority === 'High' ? 'bg-red-50 text-red-600' : task.priority === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600';

  return (
    <div className={`p-5 rounded-xl border transition-all ${task.completed ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-green-300 hover:shadow-md'}`}>
      {editingId === task.id ? (
        <div className="space-y-4">
          <input type="text" name="title" value={editData.title} onChange={handleEditChange} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
          <textarea name="description" value={editData.description} onChange={handleEditChange} rows="2" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none" />
          <div className="flex gap-4">
            <select name="priority" value={editData.priority} onChange={handleEditChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1">
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <input type="date" name="due_date" value={editData.due_date} onChange={handleEditChange} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleUpdate(task.id)} disabled={submitting} className="px-4 py-2 bg-[#166534] text-white rounded-lg text-sm font-medium disabled:opacity-50">
              {submitting ? 'Updating...' : 'Save Changes'}
            </button>
            <button onClick={cancelEdit} disabled={submitting} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-lg font-bold ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{task.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${priorityClass}`}>{task.priority}</span>
              {isOverdue(task) && <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-600">⚠ Overdue</span>}
            </div>
            <p className={`text-sm mb-4 ${task.completed ? 'text-gray-400' : 'text-gray-500'}`}>{task.description}</p>
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
  );
}
