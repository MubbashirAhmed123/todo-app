import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Stats } from "../Stats";
import { Header } from "../Header";
import { AlertCircle, CheckCircle, Clock, Plus, Sparkles } from "lucide-react";
import { TaskList } from "./TaskList";
import { TaskModal } from "./TaskModal";
import { AIAnalysis } from "./AIAnalysis";
import { createTask, deleteTask, getUserTasks, updateTask } from "../../services/taskService";
import { analyzeTasksWithAI } from "../../services/aiService";

export const UserDashboard = () => {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

 useEffect(() => {
  if (user) {
    const fetchTasks = async () => {
      const userTasks = await getUserTasks(user.uid);
      setTasks(userTasks);
    };
    fetchTasks();
  }
}, [user]);


const handleAddTask = async (formData) => {
  const newTask = await createTask({
    ...formData,
    userId: user.uid
  });
  setTasks([newTask, ...tasks]);
  setShowModal(false);
};

const handleUpdateTask = async (formData) => {
  await updateTask(editingTask.id, formData);
  setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...formData } : t));
  setShowModal(false);
  setEditingTask(null);
};

const handleDeleteTask = async (taskId) => {
  if (window.confirm('Are you sure you want to delete this task?')) {
    await deleteTask(taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
  }
};


  const handleAIAnalysis = () => {
    setShowAIAnalysis(true);
    setAiLoading(true);
    setTimeout(() => {
      const analysis = analyzeTasksWithAI(tasks, profile?.displayName || 'User');
      setAiAnalysis(analysis);
      setAiLoading(false);
    }, 1500);
  };

  console.log(tasks)

  const pending =tasks&& tasks.filter(t => t.status === 'pending').length;
  const inProgress =tasks&& tasks.filter(t => t.status === 'in-progress').length;
  const completed =tasks&& tasks.filter(t => t.status === 'completed').length;

  const stats = [
    { value: pending, label: 'Pending', color: 'text-gray-600', bgColor: 'bg-gray-100', icon: <AlertCircle className="text-gray-600" size={24} /> },
    { value: inProgress, label: 'In Progress', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: <Clock className="text-yellow-600" size={24} /> },
    { value: completed, label: 'Completed', color: 'text-green-600', bgColor: 'bg-green-100', icon: <CheckCircle className="text-green-600" size={24} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header profile={profile} isAdmin={false} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Stats stats={stats} />
        
        <div className="mt-8 flex gap-4 flex-wrap">
          <button
            onClick={() => { setEditingTask(null); setShowModal(true); }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus size={20} />
            Add New Task
          </button>
          
          <button
            onClick={handleAIAnalysis}
            disabled={tasks.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles size={20} />
            AI Analysis
          </button>
        </div>
        
        <div className="mt-8">
          <TaskList 
            tasks={tasks}
            onEdit={(task) => { setEditingTask(task); setShowModal(true); }}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          onSave={editingTask ? handleUpdateTask : handleAddTask}
        />
      )}

      {showAIAnalysis && (
        <AIAnalysis
          analysis={aiAnalysis}
          loading={aiLoading}
          onClose={() => setShowAIAnalysis(false)}
        />
      )}
    </div>
  );
};
