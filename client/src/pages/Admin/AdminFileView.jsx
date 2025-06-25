import { useState } from 'react';
import { FaFileExcel, FaTrash, FaSearch, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from '../../api/axiosInstance';

const AdminFileView = ({ files = [], onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 8;

  const deleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file and all its analyses?')) return;
    try {
      setDeletingId(fileId);
      await axios.delete(`/admin/files/${fileId}`);
      onRefresh(); // Trigger refresh from AdminDashboard
    } catch {
      alert('Delete failed. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and paginate
  const filteredFiles = files.filter(file =>
    file.originalname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.uploadedBy?.email && file.uploadedBy.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const currentFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative p-6 md:p-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <FaFileExcel className="h-7 w-7 text-[#A9D08E] mr-3" />
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            File Management
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-[#A9D08E]" />
          </div>
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
      </div>

      {/* File Table or Empty/Loading */}
      {files.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin h-12 w-12 text-[#A9D08E]" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-[#217346]/50 p-6 rounded-xl text-center border border-[#A9D08E]/30">
          <p className="text-lg text-[#D1E5D9]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            {searchTerm ? 'No matching files found.' : 'No files available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[#217346]/50 rounded-xl border border-[#A9D08E]/30 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#2D7D4A]">
                <tr>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">File Name</th>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Uploaded By</th>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Date</th>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFiles.map((file) => (
                  <tr
                    key={file._id}
                    className="border-t border-[#2D7D4A]/30 hover:bg-[#2D7D4A]/30 transition duration-200"
                  >
                    <td className="p-4 text-[#D1E5D9] font-medium">{file.originalname}</td>
                    <td className="p-4 text-[#D1E5D9]">{file.uploadedBy?.email || '—'}</td>
                    <td className="p-4 text-[#D1E5D9]">
                      {new Date(file.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteFile(file._id)}
                        disabled={deletingId === file._id}
                        className="flex items-center bg-[#7D2D2D] hover:bg-[#8C3A3A] text-white px-4 py-2 rounded-lg text-sm font-medium border border-[#D08E8E]/30 hover:border-[#D08E8E]/50 transition-all duration-300 disabled:opacity-50"
                      >
                        <FaTrash className="w-4 h-4 mr-2" />
                        {deletingId === file._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-[#2D7D4A] text-white rounded-lg disabled:opacity-50"
                >
                  <FaChevronLeft />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg ${currentPage === pageNum
                        ? 'bg-[#A9D08E] text-[#0E2E1D]'
                        : 'bg-[#2D7D4A] text-white'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-[#2D7D4A] text-white rounded-lg disabled:opacity-50"
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminFileView;