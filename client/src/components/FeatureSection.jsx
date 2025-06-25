import { useState, useEffect } from 'react';
import { FaUpload, FaChartBar, FaLightbulb, FaDownload, FaUsers, FaShieldAlt } from 'react-icons/fa';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const [loaded, setLoaded] = useState(false);
  const features = [
    {
      icon: FaUpload,
      title: "Smart File Upload",
      description: "Drag & drop Excel files (.xls, .xlsx) with intelligent data parsing and validation. Supports large datasets with progress indicators.",
      color: "from-[#2D7D4A] to-[#3A8C57]"
    },
    {
      icon: FaChartBar,
      title: "Interactive Charts",
      description: "Generate stunning 2D and 3D visualizations. Choose from bar charts, line graphs, pie charts, scatter plots, and advanced 3D models.",
      color: "from-[#217346] to-[#2D7D4A]"
    },
    {
      icon: FaLightbulb,
      title: "AI-Powered Insights",
      description: "Get intelligent analysis and automated insights from your data. AI summarizes trends, identifies patterns, and suggests optimal chart types.",
      color: "from-[#3A8C57] to-[#4CAF50]"
    },
    {
      icon: FaDownload,
      title: "Export & Share",
      description: "Download charts in multiple formats (PNG, SVG, PDF). Share interactive dashboards with customizable permissions and access controls.",
      color: "from-[#2D7D4A] to-[#217346]"
    },
    {
      icon: FaUsers,
      title: "User Dashboard",
      description: "Personal workspace with upload history, saved charts, and project management. Track usage analytics and organize your visualizations.",
      color: "from-[#3A8C57] to-[#2D7D4A]"
    },
    {
      icon: FaShieldAlt,
      title: "Admin Controls",
      description: "Comprehensive admin panel for user management, data usage monitoring, security settings, and platform analytics with detailed reporting.",
      color: "from-[#217346] to-[#3A8C57]"
    }
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section id="features" className="py-20 relative bg-gradient-to-b from-[#0E2E1D] to-[#1A5C36] overflow-hidden">
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

      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 text-white" 
            style={{ fontFamily: "'Segoe UI', sans-serif", textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Powerful <span className="text-[#A9D08E]">Features</span>
          </h2>
          <p 
            className="text-xl text-[#D1E5D9] max-w-2xl mx-auto" 
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            Everything you need to transform raw Excel data into compelling visual stories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className={`transition-all duration-700 ease-out delay-${index * 100} ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;