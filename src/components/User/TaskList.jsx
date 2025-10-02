import { Clock, Edit2, LayoutDashboard, Trash2 } from "lucide-react";

export const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center">
        <LayoutDashboard className="mx-auto text-gray-400 mb-4" size={64} />
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all border-l-4 border-indigo-500">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-2">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  task.status === 'completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status === 'completed' ? '✅' : task.status === 'in-progress' ? '🔄' : '⏳'} {task.status}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit(task)}
                className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition"
                title="Edit task"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
                title="Delete task"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
