const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group bg-[#217346]/50 hover:bg-[#2D7D4A]/70 backdrop-blur-sm p-6 rounded-xl border border-[#A9D08E]/20 hover:border-[#A9D08E]/40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-center mb-4">
        <div className="bg-[#2D7D4A] p-3 rounded-lg mr-4 group-hover:bg-[#3A8C57] transition-colors duration-300">
          <Icon className="w-6 h-6 text-[#A9D08E]" />
        </div>
        <h3 
          className="text-xl font-semibold text-white" 
          style={{ fontFamily: "'Segoe UI', sans-serif" }}
        >
          {title}
        </h3>
      </div>
      <p 
        className="text-[#D1E5D9] text-left leading-relaxed" 
        style={{ fontFamily: "'Segoe UI', sans-serif" }}
      >
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;