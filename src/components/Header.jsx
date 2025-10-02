import { LayoutDashboard, LogOut, Users } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/authService";

export const Header = ({ profile, isAdmin }) => {

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert('Logout failed: ' + error.message);
    }
  };

  return (
    <div className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${isAdmin ? 'bg-gradient-to-r from-red-500 to-pink-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'} w-12 h-12 rounded-xl flex items-center justify-center shadow-lg`}>
            {isAdmin ? <Users className="text-white" size={24} /> : <LayoutDashboard 
            className="text-white" size={24} />}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {isAdmin ? '🔐 Admin Dashboard' : '📋 My Tasks'}
            </h1>
            <p className="text-sm text-gray-600">{profile?.displayName}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};
