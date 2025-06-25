import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { FaFileExcel, FaSearch, FaUpload, FaRedo, FaChartLine, FaSpinner, FaDownload } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const UserDashboard = () => {
  const [userName, setUserName] = useState('User');
  const [files, setFiles] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('latest');

  const itemsPerPage = 6;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.name) setUserName(user.name);
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axiosInstance.get('/user/history');
      setFiles(res.data.files || []);
      setAnalyses(res.data.analyses || []);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to fetch data.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const reanalyze = async (analysisId) => {
    try {
      await axiosInstance.post(`/ai/summary/${analysisId}`);
      toast.success('AI Summary updated.');
      fetchHistory();
    } catch (err) {
      toast.error('AI summary failed.');
    }
  };

  const filtered = analyses
    .filter((a) => a.file.originalname.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'az') return a.file.originalname.localeCompare(b.file.originalname);
      if (sortBy === 'oldest') return new Date(a.file.createdAt) - new Date(b.file.createdAt);
      return new Date(b.file.createdAt) - new Date(a.file.createdAt);
    });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A5C36] to-[#0E2E1D] py-12 px-4 relative overflow-hidden">
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
            {['A', 'B', 'C', 'D', 'E'][i % 5]}
            {['1', '2', '3', '4', '5'][i % 5]}
          </div>
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-6 bg-[#217346]/50 backdrop-blur-sm p-4 rounded-xl border border-[#A9D08E]/30 animate-fade-in">
          <h1 className="text-center text-4xl font-bold text-[#A9D08E]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-[#D1E5D9] text-xl text-center" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            Here's your comprehensive Excel analytics dashboard with beautiful custom animations
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center mb-4 md:mb-0">
            <FaFileExcel className="h-8 w-8 text-[#A9D08E] mr-3" />
            <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Your DataViz Dashboard
            </h1>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A9D08E]" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#2D7D4A]/50 border border-[#A9D08E]/30 text-white text-lg rounded-lg pl-10 p-3 placeholder-[#A9D08E]/50 focus:outline-none focus:ring-2 focus:ring-[#A9D08E]"
                style={{ fontFamily: "'Segoe UI', sans-serif" }}
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#2D7D4A] text-white rounded-lg px-4 py-3 border border-[#A9D08E]/30 flex-1 md:flex-none md:w-40"
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A-Z</option>
            </select>
          </div>
          <Link
            to="/upload"
            className="flex items-center justify-center bg-[#2D7D4A] hover:bg-[#3A8C57] text-white px-6 py-3 rounded-lg text-lg font-medium border border-[#A9D08E]/30 w-full md:w-auto"
            style={{ fontFamily: "'Segoe UI', sans-serif" }}
          >
            <FaUpload className="w-5 h-5 mr-2 text-[#A9D08E]" />
            + Upload New File
          </Link>
        </div>

        {/* Recent Files Header */}
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
          Recent Files
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="animate-pulse bg-[#2D7D4A]/30 h-48 rounded-xl border border-[#A9D08E]/20"></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#217346]/50 p-8 rounded-xl border border-[#A9D08E]/30 text-center text-[#D1E5D9]">
            {searchTerm ? 'No matching files found.' : 'No files uploaded yet.'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentItems.map((a) => (
                <div
                  key={a._id}
                  className="bg-[#217346]/50 rounded-xl border border-[#A9D08E]/30 hover:border-[#A9D08E]/50 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start mb-2">
                    <div className="bg-[#2D7D4A] p-3 rounded-lg mr-4">
                      <FaFileExcel className="w-6 h-6 text-[#A9D08E]" />
                    </div>
                    <div>
                      <h2 className="text-white font-semibold line-clamp-1">{a.file.originalname}</h2>
                      <p className="text-[#D1E5D9] text-sm">
                        {new Date(a.file.createdAt).toLocaleDateString()} • {(a.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>

                  {a.keywords?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {a.keywords.map((kw, idx) => (
                        <span key={idx} className="bg-[#A9D08E]/20 text-[#A9D08E] px-2 py-1 rounded text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[#D1E5D9] text-sm italic mb-4 line-clamp-3">
                    {a.summary || 'No summary yet. Click re-analyze.'}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/analysis/${a._id}`}
                      title="View detailed chart analysis"
                      className="bg-[#2D7D4A] hover:bg-[#3A8C57] text-white px-4 py-2 rounded-lg text-sm flex items-center"
                    >
                      <FaChartLine className="mr-2" />
                      View
                    </Link>
                    <button
                      onClick={() => reanalyze(a._id)}
                      title="Ask AI to generate summary again"
                      className="bg-[#217346] hover:bg-[#2D7D4A] text-white px-4 py-2 rounded-lg text-sm flex items-center"
                    >
                      <FaRedo className="mr-2" />
                      Re-analyze
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-[#2D7D4A] text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === page ? 'bg-[#A9D08E] text-[#0E2E1D]' : 'bg-[#2D7D4A] text-white'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-[#2D7D4A] text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;