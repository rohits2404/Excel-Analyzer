import { useState, useEffect, useContext } from 'react';
import { FaFileExcel, FaLock, FaEnvelope, FaUser, FaSignInAlt, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { AuthContext } from '../context/AuthContext'; // ✅ Import AuthContext

const RegisterPage = () => {
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ Grab login()

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/auth/register', form, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const userData = res.data; // e.g. { token, name, role, ... }
      login(userData);          // ✅ Store in context & localStorage
      navigate(userData.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A5C36] to-[#0E2E1D] relative overflow-hidden pt-16">
      {/* Floating background cells */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-8 h-8 bg-[#A9D08E]/30 border border-[#A9D08E]/50 rounded-md flex items-center justify-center text-white font-bold pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${6 + Math.random() * 6}s ease-in-out infinite ${i * 0.3}s`,
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            {['A','B','C','D','E'][i % 5]}
            {['1','2','3','4','5'][i % 5]}
          </div>
        ))}
      </div>

      <div className={`container mx-auto px-4 relative z-10 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto bg-[#217346]/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-[#A9D08E]/30 mt-8"
        >
          {/* Header */}
          <div className="bg-[#2D7D4A] py-4 px-8 flex items-center justify-between border-b border-[#A9D08E]/30">
            <div className="flex items-center space-x-3">
              <FaFileExcel className="h-6 w-6 text-[#A9D08E]" />
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Create Account
              </h2>
            </div>
            <a
              href="/login"
              className="text-[#D1E5D9] hover:text-white transition-colors duration-300 flex items-center text-sm"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              <FaArrowLeft className="mr-1" />
              Back
            </a>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100/20 border border-red-400/30 text-red-200 px-4 py-3 rounded mx-6 mt-4">
              {error}
            </div>
          )}

          <div className="p-8">
            {/* Name */}
            <div className="mb-6">
              <label
                htmlFor="name"
                className="text-[#D1E5D9] mb-2 text-sm font-medium flex items-center"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                <FaUser className="h-4 w-4 text-[#A9D08E] mr-2" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full bg-[#2D7D4A]/50 border border-[#A9D08E]/30 text-white text-lg rounded-lg focus:ring-[#A9D08E] focus:border-[#A9D08E] block p-3 placeholder-[#A9D08E]/50"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="text-[#D1E5D9] mb-2 text-sm font-medium flex items-center"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                <FaEnvelope className="h-4 w-4 text-[#A9D08E] mr-2" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="user@example.com"
                className="w-full bg-[#2D7D4A]/50 border border-[#A9D08E]/30 text-white text-lg rounded-lg focus:ring-[#A9D08E] focus:border-[#A9D08E] block p-3 placeholder-[#A9D08E]/50"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="text-[#D1E5D9] mb-2 text-sm font-medium flex items-center"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                <FaLock className="h-4 w-4 text-[#A9D08E] mr-2" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="8"
                placeholder="••••••••"
                className="w-full bg-[#2D7D4A]/50 border border-[#A9D08E]/30 text-white text-lg rounded-lg focus:ring-[#A9D08E] focus:border-[#A9D08E] block p-3 placeholder-[#A9D08E]/50"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="w-full flex items-center justify-center bg-[#2D7D4A] hover:bg-[#3A8C57] text-white py-4 px-6 rounded-lg text-lg font-semibold border border-[#A9D08E]/30 hover:border-[#A9D08E]/50 transition-all duration-300 group relative overflow-hidden"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              <span className="relative z-10 flex items-center">
                <FaSignInAlt className="w-5 h-5 mr-3 text-[#A9D08E] group-hover:animate-bounce" />
                Register Now
              </span>
              {isHovering && <span className="absolute inset-0 bg-[#A9D08E]/10 animate-pulse-glow"></span>}
            </button>

            {/* Terms */}
            <div className="mt-6 text-center">
              <p className="text-[#D1E5D9] text-sm" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                By registering, you agree to our{' '}
                <a href="#" className="text-[#A9D08E] hover:underline">Terms</a> and{' '}
                <a href="#" className="text-[#A9D08E] hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Global Styles */}
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

export default RegisterPage;