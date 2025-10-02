import { CheckCircle, LayoutDashboard, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Stats } from "../Stats";
import { Header } from "../Header";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export const AdminDashboard = () => {
  const { profile } = useAuth();
  const [allTasks, setAllTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const unsubTasks = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllTasks(tasksData);
    });

    const unsubUsers = onSnapshot(collection(db, "profiles"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setAllUsers(usersData);
    });

    return () => {
      unsubTasks();
      unsubUsers();
    };
  }, []);

  const stats = [
    {
      value: allUsers.length,
      label: "Total Users",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      icon: <Users className="text-blue-600" size={24} />,
    },
    {
      value: allTasks.length,
      label: "Total Tasks",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      icon: <LayoutDashboard className="text-purple-600" size={24} />,
    },
    {
      value: allTasks.filter((t) => t.status === "completed").length,
      label: "Completed",
      color: "text-green-600",
      bgColor: "bg-green-100",
      icon: <CheckCircle className="text-green-600" size={24} />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50">
      <Header profile={profile} isAdmin={true} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Stats stats={stats} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={24} className="text-blue-600" />
              Users Overview
            </h2>
            <div className="space-y-3">
              {allUsers.map((user) => (
                <div
                  key={user.uid}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      {user.displayName || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      user.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              ))}
              {allUsers.length === 0 && (
                <p className="text-gray-500 text-center py-4">No users yet</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LayoutDashboard size={24} className="text-purple-600" />
              Recent Tasks
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {allTasks.slice(0, 10).map((task) => (
                <div key={task.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-semibold text-gray-800">{task.title}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
              {allTasks.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tasks yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Task Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {allTasks.filter((t) => t.status === "pending").length}
              </div>
              <div className="text-sm text-blue-600 font-medium">Pending Tasks</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl border-2 border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">
                {allTasks.filter((t) => t.status === "in-progress").length}
              </div>
              <div className="text-sm text-yellow-600 font-medium">In Progress</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
              <div className="text-2xl font-bold text-green-700">
                {allTasks.filter((t) => t.status === "completed").length}
              </div>
              <div className="text-sm text-green-600 font-medium">Completed</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
              <div className="text-2xl font-bold text-purple-700">
                {allTasks.length > 0
                  ? Math.round(
                      (allTasks.filter((t) => t.status === "completed").length /
                        allTasks.length) *
                        100
                    )
                  : 0}
                %
              </div>
              <div className="text-sm text-purple-600 font-medium">
                Completion Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
