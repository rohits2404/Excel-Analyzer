import { useState } from 'react';
import { FaTrash, FaSearch, FaSpinner, FaChevronLeft, FaChevronRight, FaUserShield } from 'react-icons/fa';
import axios from "../../api/axiosInstance"

const AdminUserView = ({ users = [], onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState(null);
  const itemsPerPage = 8;

  // Delete user
  const deleteUser = async (userId) => {
  if (!window.confirm('Are you sure you want to delete this user and all their data?')) return;
  try {
    console.log('Deleting user with ID:', userId);
    setDeletingId(userId);
    const res = await axios.delete(`/admin/users/${userId}`);
    console.log('Delete success response:', res.data);

    if (typeof onRefresh === 'function') {
      console.log('Calling onRefresh()...');
      onRefresh();
    } else {
      console.warn('onRefresh is not defined or not a function');
    }
  } catch (err) {
    console.error('Delete failed:', err.response?.data || err.message);
    alert('Delete failed. Please try again.');
  } finally {
    setDeletingId(null);
  }
};


  // Filter and paginate
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative p-6 md:p-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <FaUserShield className="h-7 w-7 text-[#A9D08E] mr-3" />
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            User Management
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-[#A9D08E]" />
          </div>
          <input
            type="text"
            placeholder="Search users..."
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

      {/* User Table or Empty/Loading */}
      {users.length === 0 ? (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin h-12 w-12 text-[#A9D08E]" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-[#217346]/50 p-6 rounded-xl text-center border border-[#A9D08E]/30">
          <p className="text-lg text-[#D1E5D9]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            {searchTerm ? 'No matching users found.' : 'No users available.'}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-[#217346]/50 rounded-xl border border-[#A9D08E]/30 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#2D7D4A]">
                <tr>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Name</th>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Email</th>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Role</th>
                  <th className="p-4 text-left text-[#A9D08E] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-[#2D7D4A]/30 hover:bg-[#2D7D4A]/30 transition duration-200"
                  >
                    <td className="p-4 text-[#D1E5D9] font-medium">{user.name}</td>
                    <td className="p-4 text-[#D1E5D9]">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.role === 'admin'
                          ? 'bg-[#A9D08E]/20 text-[#A9D08E] border border-[#A9D08E]/30'
                          : 'bg-[#2D7D4A]/50 text-[#D1E5D9]'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => deleteUser(user._id)}
                        disabled={deletingId === user._id}
                        className="flex items-center bg-[#7D2D2D] hover:bg-[#8C3A3A] text-white px-4 py-2 rounded-lg text-sm font-medium border border-[#D08E8E]/30 hover:border-[#D08E8E]/50 transition-all duration-300 disabled:opacity-50"
                      >
                        <FaTrash className="w-4 h-4 mr-2" />
                        {deletingId === user._id ? 'Deleting...' : 'Delete'}
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

export default AdminUserView;