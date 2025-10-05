import React, { lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetails = lazy(() => import('./pages/CourseDetails'));
const Lesson = lazy(() => import('./pages/Lesson'));
const Progress = lazy(() => import('./pages/Progress'));
const CreatorApply = lazy(() => import('./pages/CreatorApply'));
const CreatorDashboard = lazy(() => import('./pages/CreatorDashboard'));
const AdminReview = lazy(() => import('./pages/AdminReview'));
const Certificate = lazy(() => import('./pages/Certificate'));

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('user-login', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('user-login', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen w-full bg-blue-50">
       <nav className="bg-slate-800 text-white px-8 py-4 flex justify-between items-center shadow-lg">
          <div className="font-extrabold text-2xl tracking-wide drop-shadow">MicroCourses</div>
          <div className="space-x-4 flex items-center">
            <Link to="/" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">Home</Link>

            {user?.role === 'Learner' && 
            <Link 
            to="/courses" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">Courses
            </Link>}

            {!user && 
            <Link to="/courses" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">Courses
            </Link>}

            {user?.role === 'Learner' && 
            <Link to="/dashboard" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">Dashboard
            </Link>}

            {user?.role === 'Learner' && 
            <Link to="/progress" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
              Progress</Link>}

            {user?.role === 'Creator' && 
            <Link to="/creator/apply" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
             Creator Apply</Link>}

            {user?.role === 'Creator' 
            && <Link to="/creator/dashboard" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
              Creator Dashboard</Link>}

            {user?.role === 'Admin' && 
            <Link to="/dashboard" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
              Dashboard</Link>}

            {user?.role === 'Admin' && 
            <Link to="/admin/review/courses" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
              Admin Review</Link>}

            {!user && 
            <Link to="/login" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
              Login</Link>}

            {!user && 
            <Link to="/register" className="hover:bg-white hover:text-purple-700 px-4 py-2 rounded transition font-semibold">
              Register</Link>}

            {user && (
              <button
                onClick={handleLogout}
                className="bg-white text-purple-700 px-4 py-2 rounded-full font-bold shadow hover:bg-purple-100 transition ml-2"
              >
                Logout
              </button>
            )}

          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetails />} />
          <Route path="/learn/:lessonId" element={<Lesson />} />

          {/* Learner routes */}
          {user?.role === 'Learner' && (
            <React.Fragment>
              <Route path="/progress" element={<Progress user={user} />} />
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/certificate/:courseId" element={<React.Suspense fallback={null}><Certificate /></React.Suspense>} />
            </React.Fragment>
          )}

          {/* Creator routes */}
          {user?.role === 'Creator' && (
            <React.Fragment>
              <Route path="/creator/apply" element={<CreatorApply user={user} />} />
              <Route path="/creator/dashboard" element={<CreatorDashboard user={user} />} />
            </React.Fragment>
          )}

          {/* Admin routes */}
          {user?.role === 'Admin' && (
            <React.Fragment>
              <Route path="/dashboard" element={<Dashboard user={user} />} />
              <Route path="/admin/review/courses" element={<AdminReview user={user} />} />
            </React.Fragment>
          )}
          
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
