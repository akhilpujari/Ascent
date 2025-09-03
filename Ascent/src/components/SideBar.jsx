import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaTachometerAlt, 
  FaChartBar, 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes,
  FaChevronRight,
  FaRocket
} from "react-icons/fa";
import { useSelector,useDispatch } from "react-redux";
import { clearUser } from "../utils/userSlice";
import { toast } from 'react-toastify';

export default function Sidebar() {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = useSelector((state) => state.user.user);
  
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <FaTachometerAlt size={18} />, to: "/dashboard" },
    { name: "Analytics", icon: <FaChartBar size={18} />, to: "/analytics" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call the logout API
      const res = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        dispatch(clearUser())
        navigate("/", { replace: true });
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg backdrop-blur-sm transition-all hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-71 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between transform transition-all duration-300 z-40 shadow-2xl border-r border-gray-200 dark:border-gray-700
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        
        {/* Top Section */}
        <div>
          {/* Brand Logo */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <FaRocket className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Ascent</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Career Management</p>
              </div>
            </div>
          </div>

          {/* User Profile Quick View */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://i.pinimg.com/474x/3b/2e/3d/3b2e3d35f10b6adb795f1aa1bd472c4c.jpg?nii=t"
                alt="User"
                className="w-14 h-14 rounded-2xl border-4 border-white dark:border-gray-800 shadow-md"
              />
              <div>
                <h2 className="font-semibold text-gray-800 dark:text-white text-center">{user?.username || "Guest"}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{user?.email || "guest@example.com"}</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-3">
              Navigation
            </h3>
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.to}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                    ${isActive(item.to) 
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                    }`}
                  onClick={() => window.innerWidth < 768 && setIsOpen(false)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`transition-transform ${isActive(item.to) ? "text-white" : "text-gray-400 group-hover:text-blue-500"}`}>
                      {item.icon}
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                  {isActive(item.to) && <FaChevronRight size={12} className="text-white/80" />}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-1">
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/30 transition-colors">
                {isLoggingOut ? (
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaSignOutAlt size={14} />
                )}
              </div>
              <span className="font-medium">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}