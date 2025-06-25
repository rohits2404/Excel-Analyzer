import { FaGithub, FaLinkedin, FaTwitter, FaFileExcel } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <footer className="relative bg-[#0E2E1D] border-t border-[#2D7D4A]/50 overflow-hidden">
      {/* Floating Excel cells */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-6 h-6 bg-[#A9D08E]/30 border border-[#A9D08E]/50 rounded-sm flex items-center justify-center text-white font-bold text-xs pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s ease-in-out infinite ${i * 0.2}s`,
              transform: 'translateY(0)',
              fontFamily: "'Segoe UI', sans-serif"
            }}
          >
            {['A','B','C','D','E'][i%5]}{['1','2','3','4','5'][i%5]}
          </div>
        ))}
      </div>

      <div className={`container mx-auto px-4 py-8 relative z-10 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <div className="flex items-center mb-4 md:mb-0">
            <FaFileExcel className="h-6 w-6 text-[#A9D08E] mr-2" />
            <span className="text-white font-bold text-lg" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              DataViz
            </span>
            <span className="text-[#D1E5D9] text-sm ml-4" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              © {new Date().getFullYear()} All rights reserved
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <a 
              href="#" 
              className="text-[#D1E5D9] hover:text-[#A9D08E] text-sm transition-colors duration-300"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="text-[#D1E5D9] hover:text-[#A9D08E] text-sm transition-colors duration-300"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="text-[#D1E5D9] hover:text-[#A9D08E] text-sm transition-colors duration-300"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              Documentation
            </a>
          </div>

          {/* Social icons */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-[#D1E5D9] hover:text-[#A9D08E] transition-colors duration-300">
              <FaGithub className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#D1E5D9] hover:text-[#A9D08E] transition-colors duration-300">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-[#D1E5D9] hover:text-[#A9D08E] transition-colors duration-300">
              <FaTwitter className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Made with love */}
        <div className="mt-6 text-center">
          <p className="text-[#A9D08E]/70 text-xs" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            Made with ♥ for data enthusiasts
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;