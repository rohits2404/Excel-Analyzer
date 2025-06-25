import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaFileExcel, FaUpload, FaChartLine, FaUserShield,
  FaSignInAlt, FaUserPlus, FaBars, FaTimes, FaSignOutAlt
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#217346] shadow-lg' : 'bg-[#217346]'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-3">
            <FaFileExcel 
              className="h-8 w-8 text-white cursor-pointer" 
              onClick={() => navigate("/")}
            />
            <span 
              className="text-white font-bold text-2xl cursor-pointer" 
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
              onClick={() => navigate("/")}
            >
              DataViz
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 bg-[#2D7D4A] rounded-md p-1">
              {user?.role === "user" && (
                <>
                  <button
                    onClick={() => navigate("/upload")}
                    className="text-white hover:bg-[#3A8C57] px-4 py-3 rounded-md text-lg font-medium flex items-center transition-all duration-200"
                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  >
                    <FaUpload className="mr-3 text-[#A9D08E]" />
                    Upload
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="text-white hover:bg-[#3A8C57] px-4 py-3 rounded-md text-lg font-medium flex items-center transition-all duration-200"
                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  >
                    <FaChartLine className="mr-3 text-[#A9D08E]" />
                    Dashboard
                  </button>
                </>
              )}
              {user?.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="text-white hover:bg-[#3A8C57] px-4 py-3 rounded-md text-lg font-medium flex items-center transition-all duration-200"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <FaUserShield className="mr-3 text-[#A9D08E]" />
                  Admin
                </button>
              )}
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {!user ? (
                <>
                  <button 
                    onClick={() => navigate("/login")}
                    className="bg-white hover:bg-gray-100 text-[#217346] px-5 py-2.5 rounded-md text-lg font-semibold flex items-center transition-all duration-200 border border-transparent hover:border-[#2D7D4A]"
                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  >
                    <FaSignInAlt className="mr-3" />
                    Login
                  </button>
                  <button 
                    onClick={() => navigate("/register")}
                    className="bg-[#2D7D4A] hover:bg-[#3A8C57] text-white px-5 py-2.5 rounded-md text-lg font-semibold flex items-center transition-all duration-200 border border-white"
                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  >
                    <FaUserPlus className="mr-3" />
                    Register
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="bg-white hover:bg-gray-100 text-[#217346] px-5 py-2.5 rounded-md text-lg font-semibold flex items-center transition-all duration-200 border border-transparent hover:border-[#2D7D4A]"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <FaSignOutAlt className="mr-3" />
                  Logout
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-md text-white hover:bg-[#3A8C57] focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-7 w-7" />
              ) : (
                <FaBars className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#2D7D4A]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user?.role === "user" && (
              <>
                <button
                  onClick={() => {
                    navigate("/upload");
                    setIsOpen(false);
                  }}
                  className="w-full text-white hover:bg-[#3A8C57] px-4 py-3 rounded-md text-xl font-medium flex items-center"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <FaUpload className="mr-3 text-[#A9D08E]" />
                  Upload
                </button>
                <button
                  onClick={() => {
                    navigate("/dashboard");
                    setIsOpen(false);
                  }}
                  className="w-full text-white hover:bg-[#3A8C57] px-4 py-3 rounded-md text-xl font-medium flex items-center"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <FaChartLine className="mr-3 text-[#A9D08E]" />
                  Dashboard
                </button>
              </>
            )}
            {user?.role === "admin" && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsOpen(false);
                }}
                className="w-full text-white hover:bg-[#3A8C57] px-4 py-3 rounded-md text-xl font-medium flex items-center"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                <FaUserShield className="mr-3 text-[#A9D08E]" />
                Admin
              </button>
            )}
          </div>
          <div className="px-2 pt-2 pb-4 space-y-3 border-t border-[#3A8C57]">
            {!user ? (
              <>
                <button 
                  onClick={() => {
                    navigate("/login");
                    setIsOpen(false);
                  }}
                  className="w-full bg-white hover:bg-gray-100 text-[#217346] px-4 py-3 rounded-md text-xl font-semibold flex items-center justify-center"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <FaSignInAlt className="mr-3" />
                  Login
                </button>
                <button 
                  onClick={() => {
                    navigate("/register");
                    setIsOpen(false);
                  }}
                  className="w-full bg-[#217346] hover:bg-[#3A8C57] text-white px-4 py-3 rounded-md text-xl font-semibold flex items-center justify-center border border-white"
                  style={{ fontFamily: "'Segoe UI', sans-serif" }}
                >
                  <FaUserPlus className="mr-3" />
                  Register
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  logout();
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="w-full bg-white hover:bg-gray-100 text-[#217346] px-4 py-3 rounded-md text-xl font-semibold flex items-center justify-center"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              >
                <FaSignOutAlt className="mr-3" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;