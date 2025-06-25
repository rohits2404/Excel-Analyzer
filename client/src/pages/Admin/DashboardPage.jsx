import { useState, useEffect } from 'react';
import { FaUsers, FaFileExcel, FaUserShield, FaBars, FaTimes } from 'react-icons/fa';
import AdminUserView from './AdminUserView';
import AdminFileView from './AdminFileView';
import axios from '../../api/axiosInstance';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState({
    users: true,
    files: true,
    counts: true
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, users: true, files: true, counts: true }));
      
      const [usersRes, filesRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/files'),
      ]);

      setUserData(usersRes.data);
      setFileData(filesRes.data);
      setLoading(prev => ({ ...prev, users: false, files: false, counts: false }));
    } catch (err) {
      console.error('Error fetching data:', err);
      setLoading(prev => ({ ...prev, users: false, files: false, counts: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Refresh data function to pass to children
  const refreshData = (type) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    axios.get(`/admin/${type}`)
      .then(res => {
        if (type === 'users') setUserData(res.data);
        if (type === 'files') setFileData(res.data);
      })
      .catch(err => console.error(`Error refreshing ${type}:`, err))
      .finally(() => setLoading(prev => ({ ...prev, [type]: false })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1A5C36] to-[#0E2E1D] flex flex-col">
      {/* Floating Excel cells background */}
      <div className="fixed inset-0 opacity-20 z-0 overflow-hidden">
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

      {/* Mobile Menu Button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-[#0E2E1D] border-b border-[#2D7D4A] sticky top-0 z-30">
        <div className="flex items-center">
          <FaUserShield className="h-6 w-6 text-[#A9D08E] mr-2" />
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            Admin Panel
          </h2>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#A9D08E] p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        {/* Sidebar */}
        <div 
          className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-[#0E2E1D]/90 backdrop-blur-sm border-r border-[#2D7D4A] p-4 z-20 sticky top-0 h-screen md:h-auto md:min-h-[calc(100vh-4rem)]`}
        >
          <div className="hidden md:flex items-center mb-8 p-2">
            <FaUserShield className="h-6 w-6 text-[#A9D08E] mr-2" />
            <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Admin Panel
            </h2>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                setActiveTab('users');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 ${activeTab === 'users' ? 'bg-[#2D7D4A] text-white' : 'text-[#D1E5D9] hover:bg-[#217346]'}`}
            >
              <FaUsers className="w-5 h-5 mr-3" />
              <span className="flex-1 flex items-center justify-between" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Manage Users 
                <span className="bg-[#A9D08E] text-[#0E2E1D] px-2 py-1 rounded-full text-xs ml-2">
                  {loading.counts ? '...' : userData.length}
                </span>
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('files');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center p-3 rounded-lg transition-all duration-300 ${activeTab === 'files' ? 'bg-[#2D7D4A] text-white' : 'text-[#D1E5D9] hover:bg-[#217346]'}`}
            >
              <FaFileExcel className="w-5 h-5 mr-3" />
              <span className="flex-1 flex items-center justify-between" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                Manage Files 
                <span className="bg-[#A9D08E] text-[#0E2E1D] px-2 py-1 rounded-full text-xs ml-2">
                  {loading.counts ? '...' : fileData.length}
                </span>
              </span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 relative z-10">
          {/* Dashboard Summary Section */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Admin Dashboard
            </h1>
            <p className="text-[#D1E5D9] mb-6" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              Manage users, monitor system usage, and track analytics
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-[#217346]/50 backdrop-blur-sm rounded-xl border border-[#A9D08E]/30 p-6">
                <div className="flex items-center">
                  <FaUsers className="text-[#A9D08E] text-2xl mr-3" />
                  <div>
                    <p className="text-[#D1E5D9] text-sm">Total Users</p>
                    <p className="text-white text-3xl font-bold">
                      {loading.counts ? '...' : userData.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#217346]/50 backdrop-blur-sm rounded-xl border border-[#A9D08E]/30 p-6">
                <div className="flex items-center">
                  <FaFileExcel className="text-[#A9D08E] text-2xl mr-3" />
                  <div>
                    <p className="text-[#D1E5D9] text-sm">Files Uploaded</p>
                    <p className="text-white text-3xl font-bold">
                      {loading.counts ? '...' : fileData.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-[#217346]/50 backdrop-blur-sm rounded-xl border border-[#A9D08E]/30 overflow-hidden min-h-[calc(100vh-8rem)]">
            {activeTab === 'users' ? (
              loading.users ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A9D08E]"></div>
                </div>
              ) : (
                <div className='p-4 md:p-6'>
                  <AdminUserView 
                    users={userData} 
                    onRefresh={() => refreshData('users')} 
                  />
                </div>
              )
            ) : (
              loading.files ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A9D08E]"></div>
                </div>
              ) : (
                <div className='p-4 md:p-6'>
                  <AdminFileView 
                    files={fileData} 
                    onRefresh={() => refreshData('files')} 
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        html, body {
          height: 100%;
        }
        #__next {
          min-height: 100%;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;