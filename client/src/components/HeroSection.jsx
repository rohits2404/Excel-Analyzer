import { useEffect, useState } from 'react';
import { FaFileExcel, FaChartLine, FaLightbulb, FaRocket, FaArrowRight } from 'react-icons/fa';

const FloatingCell = ({ id }) => {
  const [pos, setPos] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    xSpeed: (Math.random() - 0.5) * 0.2,
    ySpeed: (Math.random() - 0.5) * 0.2,
    rotSpeed: (Math.random() - 0.5) * 0.5,
    size: 8 + Math.random() * 8
  });

  useEffect(() => {
    const moveCell = () => {
      setPos(prev => {
        // Calculate new position
        let newX = prev.x + prev.xSpeed;
        let newY = prev.y + prev.ySpeed;
        
        // Reverse direction at edges
        const xBounce = newX > 100 || newX < 0;
        const yBounce = newY > 100 || newY < 0;
        
        return {
          ...prev,
          x: xBounce ? prev.x : newX,
          y: yBounce ? prev.y : newY,
          xSpeed: xBounce ? -prev.xSpeed : prev.xSpeed,
          ySpeed: yBounce ? -prev.ySpeed : prev.ySpeed,
          rotation: prev.rotation + prev.rotSpeed
        };
      });
    };

    const interval = setInterval(moveCell, 50);
    return () => clearInterval(interval);
  }, []);

  const cellLetters = ['A', 'B', 'C', 'D', 'E'];
  const cellNumbers = ['1', '2', '3', '4', '5'];
  const cellValue = `${cellLetters[id % 5]}${cellNumbers[id % 5]}`;

  return (
    <div 
      className="absolute bg-[#A9D08E]/30 border border-[#A9D08E]/50 rounded-md flex items-center justify-center text-white font-bold pointer-events-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        width: `${pos.size}px`,
        height: `${pos.size}px`,
        fontSize: `${Math.max(10, pos.size / 2)}px`,
        transform: `rotate(${pos.rotation}deg)`,
        transition: 'all 0.5s linear',
        fontFamily: "'Segoe UI', sans-serif",
        zIndex: 0,
        opacity: 0.7 - (pos.size / 40)
      }}
    >
      {pos.size > 20 ? cellValue : ''}
    </div>
  );
};

const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1A5C36] to-[#0E2E1D] relative overflow-hidden">
      {/* Floating Excel cells background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <FloatingCell key={i} id={i} />
        ))}
      </div>

      {/* Excel-like grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[length:40px_40px] bg-[linear-gradient(to_right,#2D7D4A_1px,transparent_1px),linear-gradient(to_bottom,#2D7D4A_1px,transparent_1px)]"></div>
      </div>

      {/* Content container */}
      <div className="container mx-auto px-4 py-20 relative z-10 mt-3">
        <div className="text-center max-w-6xl mx-auto">
          <div className={`transition-all duration-700 ease-out ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Excel-style badge */}
            <div className="inline-flex items-center px-5 py-2.5 bg-[#2D7D4A] border border-[#A9D08E]/30 rounded-full mb-8 shadow-lg">
              <FaFileExcel className="w-5 h-5 mr-3 text-[#A9D08E]" />
              <span className="text-lg text-white font-medium" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Microsoft Excel Integrated
              </span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white" style={{ fontFamily: "'Segoe UI', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
              Transform <span className="text-[#A9D08E]">Spreadsheets</span> Into<br />
              Powerful <span className="text-[#A9D08E]">Data Visualizations</span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-[#D1E5D9] mb-10 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Upload any Excel file and instantly generate professional charts, dashboards, and AI-powered insights that make your data tell compelling stories.
            </p>
          </div>

          {/* Action buttons */}
          <div className={`flex flex-col sm:flex-row gap-5 justify-center items-center mb-16 transition-all duration-700 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button 
              className="flex items-center bg-[#217346] hover:bg-[#2D7D4A] text-white px-8 py-4 text-xl rounded-lg shadow-lg border border-[#A9D08E]/30 hover:border-[#A9D08E]/50 transition-all duration-300 group"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              <FaFileExcel className="w-6 h-6 mr-3 text-[#A9D08E] group-hover:animate-bounce" />
              Upload Excel File
              <FaArrowRight className="w-5 h-5 ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            </button>
            
            <button 
              className="flex items-center bg-transparent hover:bg-[#2D7D4A]/30 text-white px-8 py-4 text-xl rounded-lg shadow-lg border border-white/20 hover:border-white/40 transition-all duration-300"
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
            >
              <FaChartLine className="w-6 h-6 mr-3 text-[#A9D08E]" />
              View Live Demo
            </button>
          </div>

          {/* Feature cards */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {[
              { icon: FaRocket, title: "Instant Processing", desc: "Analyze large datasets in seconds" },
              { icon: FaChartLine, title: "20+ Chart Types", desc: "From pie charts to 3D surfaces" },
              { icon: FaLightbulb, title: "AI Insights", desc: "Get automatic data recommendations" },
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-[#217346]/50 backdrop-blur-sm p-6 rounded-xl border border-[#A9D08E]/20 hover:border-[#A9D08E]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-[#2D7D4A] p-3 rounded-lg mr-4">
                    <feature.icon className="w-6 h-6 text-[#A9D08E]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{feature.title}</h3>
                </div>
                <p className="text-[#D1E5D9] text-left" style={{ fontFamily: "'Segoe UI', sans-serif" }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;