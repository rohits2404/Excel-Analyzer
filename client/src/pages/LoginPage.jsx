import { useState, useEffect, useContext } from 'react';
import { FaFileExcel, FaLock, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // ✅ Import AuthContext

const LoginPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Access login() from context

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/auth/login', form, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const userData = response.data; // expected: { token, name, role, ... }

      login(userData); // ✅ Save to AuthContext and localStorage
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard'); // ✅ Redirect

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err.response?.data);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A5C36] to-[#0E2E1D] relative overflow-hidden">
      {/* Floating Excel cells background */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-8 h-8 bg-[#A9D08E]/30 border border-[#A9D08E]/50 rounded-md flex items-center justify-center text-white font-bold pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 6}s ease-in-out infinite ${i * 0.3}s`,
              transform: 'translateY(0)',
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            {['A','B','C','D','E'][i%5]}{['1','2','3','4','5'][i%5]}
          </div>
        ))}
      </div>

      <div className={`container mx-auto px-4 relative z-10 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-md mx-auto bg-[#217346]/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-[#A9D08E]/30">
          {/* Header */}
          <div className="bg-[#2D7D4A] py-6 px-8 flex items-center space-x-3 border-b border-[#A9D08E]/30">
            <FaFileExcel className="h-8 w-8 text-[#A9D08E]" />
            <h2 
              className="text-2xl font-bold text-white" 
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              DataViz Login
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="mb-6">
              <label 
                htmlFor="email" 
                className="block text-[#D1E5D9] mb-2 text-sm font-medium"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-[#A9D08E]" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="bg-[#2D7D4A]/50 border border-[#A9D08E]/30 text-white text-lg rounded-lg focus:ring-[#A9D08E] focus:border-[#A9D08E] block w-full pl-10 p-3 placeholder-[#A9D08E]/50"
                  placeholder="user@example.com"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  required
                />
              </div>
            </div>

            <div className="mb-8">
              <label 
                htmlFor="password" 
                className="block text-[#D1E5D9] mb-2 text-sm font-medium"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-[#A9D08E]" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="bg-[#2D7D4A]/50 border border-[#A9D08E]/30 text-white text-lg rounded-lg focus:ring-[#A9D08E] focus:border-[#A9D08E] block w-full pl-10 p-3 placeholder-[#A9D08E]/50"
                  placeholder="••••••••"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center bg-[#2D7D4A] hover:bg-[#3A8C57] text-white py-4 px-6 rounded-lg text-lg font-semibold border border-[#A9D08E]/30 hover:border-[#A9D08E]/50 transition-all duration-300 group relative overflow-hidden`}
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="relative z-10 flex items-center">
                <FaSignInAlt className="w-5 h-5 mr-3 text-[#A9D08E] group-hover:animate-bounce" />
                Sign In
              </span>
              {isHovering && (
                <span className="absolute inset-0 bg-[#A9D08E]/10 animate-pulse-glow"></span>
              )}
            </button>

            <div className="mt-6 text-center">
              <a 
                href="/register" 
                className="text-[#A9D08E] hover:text-[#D1E5D9] text-sm transition-colors duration-300 inline-flex items-center"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                <FaUserPlus className="w-4 h-4 mr-2" />
                Create new account
              </a>
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes pulse-glow {
          0% { opacity: 0.5; }
          50% { opacity: 0.2; }
          100% { opacity: 0.5; }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;