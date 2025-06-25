import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import UserDashboard from './pages/User/Dashboard';
import UploadFile from './pages/User/UploadFile';
import AnalysisPage from './pages/User/AnalysisPage';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUserView from './pages/Admin/AdminUserView';
import AdminFileView from './pages/Admin/AdminFileView';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext'; // ✅ Import AuthProvider

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster />
                <Navbar />
                <Routes>
                    <Route path='/' element={<HomePage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/register' element={<RegisterPage />} />

                    {/* User Routes */}
                    <Route element={<ProtectedRoute role="user" />}>
                        <Route path='/dashboard' element={<UserDashboard />} />
                        <Route path='/upload' element={<UploadFile />} />
                        <Route path='/analysis/:id' element={<AnalysisPage />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route element={<ProtectedRoute role="admin" />}>
                        <Route path='/admin' element={<AdminDashboard />} />
                        <Route path='/admin/users' element={<AdminUserView />} />
                        <Route path='/admin/files' element={<AdminFileView />} />
                    </Route>
                </Routes>
                <Footer />
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;