import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { Login } from "./components/Auth/Login";
import { UserDashboard } from "./components/User/UserDashboard";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  const { user, profile, loading } = useAuth();
  console.log(user, profile, loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  return profile.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
};


export default App;