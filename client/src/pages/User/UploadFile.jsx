import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { FaFileExcel, FaUpload, FaChartLine, FaSpinner } from 'react-icons/fa';

const UploadFile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
        selected.type === 'application/vnd.ms-excel')) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please choose a file first.');

    setUploading(true);
    const formData = new FormData();
    formData.append('excelFile', file);

    try {
      const res = await axios.post('/upload', formData);
      const { fileId } = res.data;
      navigate(`/analysis/${res.data.analysisId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
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
              DataViz Upload
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}

            <div className="mb-8">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-[#A9D08E]/50 border-dashed rounded-lg cursor-pointer bg-[#2D7D4A]/30 hover:bg-[#2D7D4A]/50 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-10 h-10 mb-3 text-[#A9D08E]" />
                  <p className="mb-2 text-sm text-[#D1E5D9]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-[#A9D08E]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    Excel files only (.xlsx, .xls)
                  </p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".xlsx,.xls" 
                  onChange={handleFileChange} 
                />
              </label>
              {file && (
                <div className="mt-4 flex items-center justify-center text-[#D1E5D9]">
                  <FaFileExcel className="w-5 h-5 mr-2 text-[#A9D08E]" />
                  <span style={{ fontFamily: "'Segoe UI', sans-serif" }}>{file.name}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className={`w-full flex items-center justify-center ${file ? 'bg-[#2D7D4A] hover:bg-[#3A8C57]' : 'bg-gray-500 cursor-not-allowed'} 
                text-white py-4 px-6 rounded-lg text-lg font-semibold border border-[#A9D08E]/30 hover:border-[#A9D08E]/50 
                transition-all duration-300 group relative overflow-hidden`}
              style={{ fontFamily: "'Segoe UI', sans-serif" }}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <span className="relative z-10 flex items-center">
                {uploading ? (
                  <FaSpinner className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <FaChartLine className="w-5 h-5 mr-3 text-[#A9D08E] group-hover:animate-bounce" />
                )}
                {uploading ? 'Processing...' : 'Analyze Data'}
              </span>
              {isHovering && !uploading && file && (
                <span className="absolute inset-0 bg-[#A9D08E]/10 animate-pulse-glow"></span>
              )}
            </button>
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

export default UploadFile;