import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { validate } from "./utils/validation";
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaRocket, } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "./utils/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const email = useRef('');
  const password = useRef('');
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchLogin(email, password) {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        })
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success("Logged in successfully! 🎉");
        const user = data.data[0]
        dispatch(setUser(user))
        localStorage.setItem("user", JSON.stringify(user));
        navigate('/dashboard', { replace: true });
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }

  function login(event) {
    event.preventDefault();
    const emailInput = email.current.value;
    const passwordInput = password.current.value;
    const validationError = validate(
      emailInput.trim(),
      null,
      passwordInput,
      null
    );

    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    fetchLogin(emailInput, passwordInput);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <FaRocket className="text-white text-2xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/80 text-sm">Sign in to continue your journey</p>
          </div>

          <form className="p-8" onSubmit={login}>
            {/* Email Field */}
            <div className="mb-6">
              <label className="block text-white text-sm font-semibold mb-3" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input 
                  ref={email}
                  type="email" 
                  id="email" 
                  name="email" 
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="block text-white text-sm font-semibold mb-3" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input 
                  ref={password}
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  name="password" 
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/20 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-400/20 border border-red-400/30 rounded-xl">
                <p className="text-red-100 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>


            {/* Sign Up Link */}
            <div className="text-center mt-4">
              <p className="text-white/70 text-sm">
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  className="text-white font-semibold hover:text-purple-200 transition-colors underline"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-white/50 text-sm">
            © 2025 Ascent. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}